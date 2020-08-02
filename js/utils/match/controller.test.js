const Controller = require('./controller');
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();
const ChangeDetector = require('./change_detector');
jest.mock('./change_detector');
const mockChangeDetector = new ChangeDetector();
mockChangeDetector.detect_changes.mockImplementation(_ => 'detected_changes');
const mockReplayData = [
    { frame: 0, turnInfo: [0] },
    { frame: 1, turnInfo: [1] },
    { frame: 2, turnInfo: [0] },
    { frame: 3, turnInfo: [1] },
    { frame: 4, turnInfo: [1] },
    { frame: 5, turnInfo: [0] },
    { frame: 6, turnInfo: [1] },
    { frame: 7, turnInfo: [0] },
    { frame: 8, turnInfo: [0] },
    { frame: 9, turnInfo: [0] }, //This one should not be reachable during play
];

afterEach(() => {
    jest.clearAllMocks();
});

describe('Controller tests', function() {
    test('set replayData is possible', () => {
        const controller = new Controller();
        controller.set_replay_data([1, 2, 3]);
    });

    test('set MatchViewer in constructor is possible', () => {
        const controller = new Controller(mockActionEventSystem);
    });

    test('don`t throw exception when MatchViewer.update_frame_data is called and replayData is not set', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_frame(0);
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalled();
    });

    test('don`t call MatchViewer.update_frame_data when set_frame (-1) is called', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 11, 12]);
        controller.set_frame(-1);
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalled();
    });

    test('don`t call MatchViewer.update_frame_data when show_frame with bigger than highest index is called', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 11, 12]);
        controller.set_frame(3);
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalled();
    });

    test('call MatchViewer.update_frame_data with correct data when show_frame (0) is called', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 11, 12]);
        controller.set_frame(0);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', 10);
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalledWith(11);
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalledWith(12);
    });

    test('call MatchViewer.update_frame_data with correct data when show_frame (1) is called', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 11, 12]);
        controller.set_frame(1);
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalledWith(10);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', 11);
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalledWith(12);
    });
});

describe('test set_frame', () => {
    test('set_frame with frame_number when replay_data is not set', () => {
        const controller = new Controller(mockActionEventSystem);

        controller.set_frame(0);
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalled();
    });

    test('set_frame with frame_number = 0', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 20, 30]);
        controller.set_frame(0);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', 10);
    });

    test('set_frame with frame_number = 2', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 20, 30, 'unreachable']);
        controller.set_frame(2);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', 30);
    });

    test('set_frame with frame_number = -1', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 20, 30]);
        controller.set_frame(-1);
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalledWith(10);
    });

    test('set_frame with frame_number = 5', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 20, 30]);
        controller.set_frame(5);
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalledWith(10);
    });
});

describe('test next_frame', () => {
    test('next_frame when replay_data is not set', () => {
        const controller = new Controller(mockActionEventSystem);

        controller.next_frame();
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalled();
    });

    test('next_frame: show 2nd frame', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 20, 30]);
        controller.next_frame();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', 20);
    });

    test('next_frame twice: show 2nd and then 3rd frame', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 20, 30, 'unreachable']);
        controller.next_frame();
        controller.next_frame();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', 20);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', 30);
    });

    test('next_frame: calling it to often makes it do nothing', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 20, 30, 'unreachable']);
        controller.next_frame();
        controller.next_frame();
        controller.next_frame();
        controller.next_frame();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(2);
    });
});

describe('test previous_frame', () => {
    test('previous_frame when replay_data is not set', () => {
        const controller = new Controller(mockActionEventSystem);

        controller.previous_frame();
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalled();
    });

    test('previous_frame: with data set should still not do anything', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 20, 30]);
        controller.previous_frame();
        expect(mockActionEventSystem.release_event).not.toHaveBeenCalledWith(20);
    });

    test('previous_frame: should work now', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 20, 30, 'unreachable']);
        controller.set_frame(2);
        controller.previous_frame();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', 30);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', 20);
    });

    test('combination of multiple next_frame and previous_frame calls', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data([10, 20, 30, 'unreachable']);
        controller.next_frame(); //1
        controller.next_frame(); //2
        controller.next_frame(); //does nothing
        controller.next_frame(); //does nothing
        controller.previous_frame(); //3
        controller.previous_frame(); //4
        controller.previous_frame(); //does nothing
        controller.previous_frame(); //does nothing
        controller.next_frame(); //5
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(5);
    });
});

describe('test next_turn', () => {
    test('should jump to last frame if it`s already the last turn', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(6);
        jest.clearAllMocks();
        controller.next_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', { frame: 8, turnInfo: [0] });
    });

    test('should jump to last frame if it`s already the last turn from within turn', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(7);
        jest.clearAllMocks();
        controller.next_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', { frame: 8, turnInfo: [0] });
    });

    test('should find and show next turn', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.next_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', { frame: 3, turnInfo: [1] });
    });

    test('should find and show next turn with multiple steps in between', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(3);
        controller.next_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', { frame: 6, turnInfo: [1] });
    });

    test('should find and show next turn with multiple steps in between from turn frame -1', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(2);
        controller.next_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', { frame: 6, turnInfo: [1] });
    });
});

describe('test previous_turn', () => {
    test('should not show previous turn if it`s already the first turn', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.previous_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(0);
    });

    test('should find and show previous turn', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(3);
        jest.clearAllMocks();
        controller.previous_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', { frame: 1, turnInfo: [1] });
    });

    test('should find and show previous turn from turn_frame -1', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(2);
        jest.clearAllMocks();
        controller.previous_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', { frame: 1, turnInfo: [1] });
    });

    test('should find and show previous turn with multiple steps', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(6);
        jest.clearAllMocks();
        controller.previous_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', { frame: 3, turnInfo: [1] });
    });
});

describe('Test start_of_turn', () => {
    it('should do nothing if already on first frame of turn', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(0);
        jest.clearAllMocks();
        controller.start_of_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(0);
    });

    it('should load frame 0 when starting on frame 1', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(1);
        jest.clearAllMocks();
        controller.start_of_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', { frame: 0, turnInfo: [0] });
    });

    it('should do nothing if already on first frame of second turn', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(2);
        jest.clearAllMocks();
        controller.start_of_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(0);
    });

    it('should load frame 2 when starting on frame 3', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(3);
        jest.clearAllMocks();
        controller.start_of_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', { frame: 2, turnInfo: [0] });
    });

    it('should load frame 2 when starting on frame 4', () => {
        const controller = new Controller(mockActionEventSystem);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(4);
        jest.clearAllMocks();
        controller.start_of_turn();
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_frame_data', { frame: 2, turnInfo: [0] });
    });
});

describe('test resimulate', () => {
    const replayData = [
        { frame: 0, turnInfo: [0], events: { spawn: [] } },
        { frame: 1, turnInfo: [1], events: { spawn: 'spawnDataToPassToChangeDetector' } },
        { frame: 2, turnInfo: [0], events: { spawn: [] } },
        { frame: 3, turnInfo: [1], events: { spawn: [] } },
        { frame: 4, turnInfo: [1], events: { spawn: [] } },
        { frame: 5, turnInfo: [0], events: { spawn: [] } },
        { frame: 6, turnInfo: [1], events: { spawn: [] } },
        { frame: 7, turnInfo: [0], events: { spawn: [] } },
        { frame: 8, turnInfo: [0], events: { spawn: [] } },
    ];

    it('should call the ChangeDetector to figure out the changes between the start of the current turn and the next frame', () => {
        let controller = new Controller(mockActionEventSystem, mockChangeDetector);
        controller.set_replay_data(replayData);
        controller.set_frame(1);
        jest.clearAllMocks();
        controller.resimulate();
        expect(mockChangeDetector.detect_changes).toHaveBeenCalledWith('spawnDataToPassToChangeDetector');
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_simulation_game_state', { 'events': { 'spawn': [] }, 'frame': 0, 'turnInfo': [0] });
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('submit_actions', 'detected_changes');
    });
});