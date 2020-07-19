const UserDataDownloader = require('./user_data_downloader');
let mock_fetch_json = jest.fn();
mock_fetch_json.mockImplementation(() => new Promise(resolve =>
    resolve({ "data": { "algos": [{ f1: 1, f2: 2 }, { f1: 11, f2: 22 }] } })));
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();


afterEach(() => {
    jest.clearAllMocks();
});

describe('UserDataDownloader tests', function() {
    test('create UserDataDownloader', () => {
        new UserDataDownloader(mockActionEventSystem, mock_fetch_json);
    });

    test('downloads and transforms downloaded data', () => {
        return new UserDataDownloader(mockActionEventSystem, mock_fetch_json)
            .download(123456)
            .then(_ => {
                expect(mock_fetch_json).toHaveBeenCalledWith('https://terminal.c1games.com/api/game/match/123456/algos');
                expect(mockActionEventSystem.release_event)
                    .toHaveBeenCalledWith('set_user_data', { f1: [1, 11], f2: [2, 22], match_id: [123456] });
            });
    });
});