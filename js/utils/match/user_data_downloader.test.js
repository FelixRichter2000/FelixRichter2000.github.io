const UserDataDownloader = require('./user_data_downloader');
let mock_fetch_json = jest.fn();
mock_fetch_json.mockImplementation(() => new Promise(resolve => resolve({ "data": { "algos": [1, 2] } })));

afterEach(() => {
    jest.clearAllMocks();
});

describe('UserDataDownloader tests', function() {
    test('create UserDataDownloader', () => {
        new UserDataDownloader(mock_fetch_json);
    });

    test('download replay config and replay are getting set', () => {
        return new UserDataDownloader(mock_fetch_json)
            .download(123456)
            .then((result) => {
                expect(mock_fetch_json).toHaveBeenCalledWith('https://terminal.c1games.com/api/game/match/123456/algos');
                expect(result.algos).toEqual([1, 2]);
            });
    });
});