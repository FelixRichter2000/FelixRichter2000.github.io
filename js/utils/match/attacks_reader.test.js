const AttacksReader = require("./attacks_reader");
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

let mock_replay_data_1 = [
    {
        events: {
            spawn: [
                [[10, 10], 0, '0', 1],
                [[10, 15], 0, '1', 2],
            ]
        }
    }
]


afterEach(() => {
    jest.clearAllMocks();
});

it('should be creatable', () => {
    layout_reader = new AttacksReader(mockActionEventSystem);
});