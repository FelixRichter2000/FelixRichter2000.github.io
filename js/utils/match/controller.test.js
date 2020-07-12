const Controller = require('./controller');
const MatchViewer = require('./match_viewer');
jest.mock('./match_viewer');
const mockMatchViewer = new MatchViewer();
const mockReplayData = [
    { frame: 0, turnInfo: [0] },
    { frame: 1, turnInfo: [1] },
    { frame: 2, turnInfo: [0] },
    { frame: 3, turnInfo: [1] },
    { frame: 4, turnInfo: [1] },
    { frame: 5, turnInfo: [0] },
    { frame: 6, turnInfo: [1] },
]

afterEach(() => {
    jest.clearAllMocks();
});

describe('mockMatchViewer tests', function() {
    test('pass 1 expect 1', () => {
        mockMatchViewer.show_data(1);
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(1);
    });
    test('pass 5 expect 5', () => {
        mockMatchViewer.show_data(5);
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(5);
    });
});

describe('Controller tests', function() {
    test('set replayData is possible', () => {
        const controller = new Controller();
        controller.set_replay_data([1, 2, 3]);
    });

    test('set MatchViewer in constructor is possible', () => {
        const controller = new Controller(mockMatchViewer);
    });

    test('don`t throw exception when MatchViewer.show_data is called and replayData is not set', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_frame(0);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalled();
    });

    test('don`t call MatchViewer.show_data when show_frame (-1) is called', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 11, 12]);
        controller.set_frame(-1);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalled();
    });

    test('don`t call MatchViewer.show_data when show_frame with bigger than highest index is called', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 11, 12]);
        controller.set_frame(3);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalled();
    });

    test('call MatchViewer.show_data with correct data when show_frame (0) is called', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 11, 12]);
        controller.set_frame(0);
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(10);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalledWith(11);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalledWith(12);
    });

    test('call MatchViewer.show_data with correct data when show_frame (1) is called', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 11, 12]);
        controller.set_frame(1);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalledWith(10);
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(11);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalledWith(12);
    });
});

describe('test do_action set_frame', () => {
    test('set_frame with frame_number when replay_data is not set', () => {
        const controller = new Controller(mockMatchViewer);

        controller.set_frame(0);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalled();
    });

    test('set_frame with frame_number = 0', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 20, 30]);
        controller.set_frame(0);
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(10);
    });

    test('set_frame with frame_number = 2', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 20, 30]);
        controller.set_frame(2);
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(30);
    });

    test('set_frame with frame_number = -1', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 20, 30]);
        controller.set_frame(-1);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalledWith(10);
    });

    test('set_frame with frame_number = 5', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 20, 30]);
        controller.set_frame(5);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalledWith(10);
    });
});

describe('test do_action next_frame', () => {
    test('next_frame when replay_data is not set', () => {
        const controller = new Controller(mockMatchViewer);

        controller.next_frame();
        expect(mockMatchViewer.show_data).not.toHaveBeenCalled();
    });

    test('next_frame: show 2nd frame', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 20, 30]);
        controller.next_frame();
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(20);
    });

    test('next_frame twice: show 2nd and then 3rd frame', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 20, 30]);
        controller.next_frame();
        controller.next_frame();
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(20);
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(30);
    });

    test('next_frame: calling it to often makes it do nothing', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 20, 30]);
        controller.next_frame();
        controller.next_frame();
        controller.next_frame();
        controller.next_frame();
        expect(mockMatchViewer.show_data).toHaveBeenCalledTimes(2);
    });
});

describe('test do_action previous_frame', () => {
    test('previous_frame when replay_data is not set', () => {
        const controller = new Controller(mockMatchViewer);

        controller.previous_frame();
        expect(mockMatchViewer.show_data).not.toHaveBeenCalled();
    });

    test('previous_frame: with data set should still not do anything', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 20, 30]);
        controller.previous_frame();
        expect(mockMatchViewer.show_data).not.toHaveBeenCalledWith(20);
    });

    test('previous_frame: should work now', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 20, 30]);
        controller.set_frame(2);
        controller.previous_frame();
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(30);
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(20);
    });

    test('combination of multiple next_frame and previous_frame calls', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data([10, 20, 30]);
        controller.next_frame(); //1
        controller.next_frame(); //2
        controller.next_frame(); //does nothing
        controller.next_frame(); //does nothing
        controller.previous_frame(); //3
        controller.previous_frame(); //4
        controller.previous_frame(); //does nothing
        controller.previous_frame(); //does nothing
        controller.next_frame(); //5
        expect(mockMatchViewer.show_data).toHaveBeenCalledTimes(5);
    });
});

describe('test do_action next_turn', () => {
    test('should not show next turn if it`s already the last turn', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(6);
        jest.clearAllMocks();
        controller.next_turn();
        expect(mockMatchViewer.show_data).toHaveBeenCalledTimes(0);
    });

    test('should find and show next turn', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data(mockReplayData);
        controller.next_turn();
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith({ frame: 3, turnInfo: [1] });
    });

    test('should find and show next turn with multiple steps in between', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(3);
        controller.next_turn();
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith({ frame: 6, turnInfo: [1] });
    });

    test('should find and show next turn with multiple steps in between from turn frame -1', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(2);
        controller.next_turn();
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith({ frame: 6, turnInfo: [1] });
    });
});

describe('test do_action previous_turn', () => {
    test('should not show previous turn if it`s already the first turn', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data(mockReplayData);
        controller.previous_turn();
        expect(mockMatchViewer.show_data).toHaveBeenCalledTimes(0);
    });

    test('should find and show previous turn', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(3);
        jest.clearAllMocks();
        controller.previous_turn();
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith({ frame: 1, turnInfo: [1] });
    });

    test('should find and show previous turn from turn_frame -1', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(2);
        jest.clearAllMocks();
        controller.previous_turn();
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith({ frame: 1, turnInfo: [1] });
    });

    test('should find and show previous turn with multiple steps', () => {
        const controller = new Controller(mockMatchViewer);
        controller.set_replay_data(mockReplayData);
        controller.set_frame(6);
        jest.clearAllMocks();
        controller.previous_turn();
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith({ frame: 3, turnInfo: [1] });
    });
});