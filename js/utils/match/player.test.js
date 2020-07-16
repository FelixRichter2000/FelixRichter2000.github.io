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

    test('pause_play', () => {
        let player = new Player(mockActionEventSystem);
        player.pause();
        jest.advanceTimersByTime(1000);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(0);
    });

    test('combination of pause and play', () => {
        let player = new Player(mockActionEventSystem);
        player.set_playback_speed(10);
        player.pause();
        jest.advanceTimersByTime(300);
        player.play();
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
});