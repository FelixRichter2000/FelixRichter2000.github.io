const Controller = require('./controller');
const MatchViewer = require('./match_viewer');
jest.mock('./match_viewer');
const mockMatchViewer = new MatchViewer();

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
        controller.setReplayData([1, 2, 3]);
    });

    test('set MatchViewer in constructor is possible', () => {
        const controller = new Controller(mockMatchViewer);
    });

    test('don`t throw exception when MatchViewer.show_data is called and replayData is not set', () => {
        const controller = new Controller(mockMatchViewer);
        controller.showFrame(0);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalled();
    });

    test('don`t call MatchViewer.show_data when showFrame (-1) is called', () => {
        const controller = new Controller(mockMatchViewer);
        controller.setReplayData([10, 11, 12]);
        controller.showFrame(-1);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalled();
    });

    test('don`t call MatchViewer.show_data when showFrame with bigger than highest index is called', () => {
        const controller = new Controller(mockMatchViewer);
        controller.setReplayData([10, 11, 12]);
        controller.showFrame(3);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalled();
    });

    test('call MatchViewer.show_data with correct data when showFrame (0) is called', () => {
        const controller = new Controller(mockMatchViewer);
        controller.setReplayData([10, 11, 12]);
        controller.showFrame(0);
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(10);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalledWith(11);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalledWith(12);
    });

    test('call MatchViewer.show_data with correct data when showFrame (1) is called', () => {
        const controller = new Controller(mockMatchViewer);
        controller.setReplayData([10, 11, 12]);
        controller.showFrame(1);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalledWith(10);
        expect(mockMatchViewer.show_data).toHaveBeenCalledWith(11);
        expect(mockMatchViewer.show_data).not.toHaveBeenCalledWith(12);
    });
});