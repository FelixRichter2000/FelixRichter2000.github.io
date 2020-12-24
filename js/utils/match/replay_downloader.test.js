const ReplayDownloader = require('./replay_downloader');
let mock_fetch_json = jest.fn();
mock_fetch_json.mockImplementation(() => new Promise(resolve => resolve('{"config":123}\n{"line":1}\n\n{"line":2}\n{"end":99, "turnInfo":[10, 10, 10, 10]}')));
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();


afterEach(() => {
    jest.clearAllMocks();
});

describe('ReplayDownloader tests', function () {
    test('create ReplayDownloader', () => {
        new ReplayDownloader(mockActionEventSystem, mock_fetch_json);
    });

    test('download replay config and replay are getting set', () => {
        return new ReplayDownloader(mockActionEventSystem, mock_fetch_json)
            .download(123456)
            .then(_ => {
                expect(mock_fetch_json)
                    .toHaveBeenCalledWith('https://terminal.c1games.com/api/game/replayexpanded/123456');
                expect(mockActionEventSystem.release_event)
                    .toHaveBeenCalledWith('set_config', { config: 123 });
                expect(mockActionEventSystem.release_event)
                    .toHaveBeenCalledWith('set_replay_data_raw', [{ line: 1 }, { line: 2 }, { end: 99, turnInfo: [0, 11, -1, 11] }]);
                expect(mockActionEventSystem.release_event)
                    .toHaveBeenCalledWith('set_replay_raw', '{"config":123}\n{"line":1}\n\n{"line":2}\n{"end":99, "turnInfo":[10, 10, 10, 10]}');
            });
    });
});