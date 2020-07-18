const Player = require('./player');
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

const normalFPS = 12;
const normalSpeed = 1000.0 / normalFPS;

jest.useFakeTimers();

afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
});

describe('test player', () => {
    test('create player ', () => {
        new Player(mockActionEventSystem);
    });

    test('player should call next_frame periodically', () => {
        new Player(mockActionEventSystem);
        jest.advanceTimersByTime(normalSpeed + 1);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('next_frame');
    });

    test('default speed', () => {
        let player = new Player(mockActionEventSystem);

        jest.advanceTimersByTime(normalSpeed * 10 + 1);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(10);
    });

    test('set invalid speed (-1) does not change playback speed', () => {
        let player = new Player(mockActionEventSystem);

        player.set_playback_speed(-1);

        jest.advanceTimersByTime(normalSpeed * 10 + 1);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(10);
    });

    test('set invalid speed (-1000) does not change playback speed', () => {
        let player = new Player(mockActionEventSystem);

        player.set_playback_speed(-1000);

        jest.advanceTimersByTime(normalSpeed * 10 + 1);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(10);
    });

    test('set minimum playback_speed works', () => {
        let player = new Player(mockActionEventSystem);

        player.set_playback_speed(1);

        jest.advanceTimersByTime(1000);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(1);
    });

    test('set to high playback_speed does not change playback speed', () => {
        let player = new Player(mockActionEventSystem);

        player.set_playback_speed(61);

        jest.advanceTimersByTime(normalSpeed * 10 + 1);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(10);
    });


    test('set maximum playback_speed works', () => {
        let player = new Player(mockActionEventSystem);

        player.set_playback_speed(60);

        jest.advanceTimersByTime(1000 / 60);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(1);
    });

    test('set playback_speed', () => {
        let player = new Player(mockActionEventSystem);

        player.set_playback_speed(24);

        jest.advanceTimersByTime(normalSpeed * 10 + 1);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(20);
    });

    test('pause replay whils running', () => {
        let player = new Player(mockActionEventSystem);
        player.pause();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('toggle_play');
    });

    test('pause replay whils pausing', () => {
        let player = new Player(mockActionEventSystem);
        player.toggle_play();
        player.pause();
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalled();
    });

    test('play replay whilst playing', () => {
        let player = new Player(mockActionEventSystem);
        player.play();
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalled();
    });

    test('play replay whilst pausing', () => {
        let player = new Player(mockActionEventSystem);
        player.toggle_play();
        player.play();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('toggle_play');
    });

    test('combination of pause and play', () => {
        let player = new Player(mockActionEventSystem);
        player.set_playback_speed(10);
        player.toggle_play();
        jest.advanceTimersByTime(300);
        player.toggle_play();
        jest.advanceTimersByTime(700);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(7);
    });

    test('set_playback_speed multiple times', () => {
        let player = new Player(mockActionEventSystem);
        player.set_playback_speed(20);
        player.set_playback_speed(10);
        jest.advanceTimersByTime(1000);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(10);
    });

    test('faster_playback should increase the number of events per second', () => {
        let player = new Player(mockActionEventSystem);
        player.set_playback_speed(10);
        player.faster_playback();
        jest.advanceTimersByTime(1000);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(14);
    });

    test('faster_playback multiple times should increase the number of events per second more', () => {
        let player = new Player(mockActionEventSystem);
        player.set_playback_speed(10);
        player.faster_playback();
        player.faster_playback();
        player.faster_playback();
        player.faster_playback();
        jest.advanceTimersByTime(1000);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(25);
    });

    test('faster_playback at max speed should not increase speed further', () => {
        let player = new Player(mockActionEventSystem);
        player.set_playback_speed(56);
        player.faster_playback();
        player.faster_playback();
        player.faster_playback();
        player.faster_playback();
        jest.advanceTimersByTime(1000);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(60);
    });

    test('slower_playback should decrease the number of events per second', () => {
        let player = new Player(mockActionEventSystem);
        player.set_playback_speed(12);
        player.slower_playback();
        jest.advanceTimersByTime(1000);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(8);
    });

    test('slower_playback multiple times should decrease the number of events per second', () => {
        let player = new Player(mockActionEventSystem);
        player.set_playback_speed(12);
        player.slower_playback();
        player.slower_playback();
        jest.advanceTimersByTime(1000);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(4);
    });

    test('slower_playback should never go lower than 4', () => {
        let player = new Player(mockActionEventSystem);
        player.set_playback_speed(8);
        player.slower_playback();
        player.slower_playback();
        jest.advanceTimersByTime(1000);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(4);
    });

    test('toggle play', () => {
        let player = new Player(mockActionEventSystem);
        player.set_playback_speed(10);
        player.toggle_play();
        jest.advanceTimersByTime(300);
        player.toggle_play();
        jest.advanceTimersByTime(700);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(7);
    });

    test('previous_frame should pause player', () => {
        let player = new Player(mockActionEventSystem);
        player.previous_frame();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('toggle_play');
    });

    test('previous_turn should pause player', () => {
        let player = new Player(mockActionEventSystem);
        player.previous_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('toggle_play');
    });
});