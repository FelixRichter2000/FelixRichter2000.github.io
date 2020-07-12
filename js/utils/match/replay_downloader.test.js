const ReplayDownloader = require('./replay_downloader');
let mock_fetch_json = jest.fn();
mock_fetch_json.mockImplementation(() => new Promise(resolve => resolve('{"config":123}\n{"line":1}\n\n{"line":2}\n{"end":99}')));

afterEach(() => {
    jest.clearAllMocks();
});

describe('ReplayDownloader tests', function() {
    test('create ReplayDownloader', () => {
        new ReplayDownloader(mock_fetch_json);
    });

    test('download replay config and replay are getting set', () => {
        return new ReplayDownloader(mock_fetch_json)
            .download(123456)
            .then((result) => {
                expect(mock_fetch_json).toHaveBeenCalledWith('https://terminal.c1games.com/api/game/replayexpanded/123456');
                expect(result.config).toEqual({ config: 123 });
                expect(result.replay).toEqual([{ line: 1 }, { line: 2 }]);
            });
    });
});