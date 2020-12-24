const LayoutReader = require("./layout_reader");
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

let mock_config = {
    "unitInformation": [
        {
            "unitCategory": 0
        },
        {
            "unitCategory": 1
        }
    ]
}

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

let mock_replay_data_2 = [
    {
        events: {
            spawn: [
                [[10, 10], 0, '0', 1],
                [[10, 11], 0, '1', 1],
            ]
        }
    }
]


afterEach(() => {
    jest.clearAllMocks();
});

it('should be creatable', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
});

it('should handle the set_config event', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
    layout_reader.set_config(mock_config);
});

it('should handle empty set_replay_data event', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
    layout_reader.set_config(mock_config);
    layout_reader.analyse_replay_data([]);

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_replay_data', []);
});

it('should handle simple analyse_replay_data event', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
    layout_reader.set_config(mock_config);
    layout_reader.analyse_replay_data(mock_replay_data_1);

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_replay_data', [
            {
                p0: [
                    [[10, 10], 0, '0', 0],
                ],
                p1: [
                    [[10, 15], 0, '1', 1],
                ],
                frame: 0,
                turnInfo: [1, 0, 0, 0],
            }
        ]);
})

it('should handle simple analyse_replay_data event 2', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
    layout_reader.set_config(mock_config);
    layout_reader.analyse_replay_data(mock_replay_data_2);

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_replay_data', [
            {
                p0: [
                    [[10, 10], 0, '0', 0],
                    [[10, 11], 0, '1', 0],
                ],
                p1: [
                ],
                frame: 0,
                turnInfo: [1, 0, 0, 0],
            },
            {
                p0: [
                    [[10, 10], 0, '0', 0],
                    [[10, 11], 0, '1', 0],
                ],
                p1: [
                ],
                frame: 1,
                turnInfo: [1, 0, 1, 1],
            }
        ]);
});
