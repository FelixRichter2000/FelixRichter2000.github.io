const AttacksReader = require("./attacks_reader");
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

let mock_simple_config = {
    "unitInformation": [
        {
            "unitCategory": 0
        },
        {
            "unitCategory": 1
        },
        {
            "shorthand": "RM",
        },
        {
            "shorthand": "UP",
        }
    ]
}


afterEach(() => {
    jest.clearAllMocks();
});

it('should be creatable', () => {
    attacks_reader = new AttacksReader(mockActionEventSystem);
    attacks_reader.set_config(mock_simple_config);
});

it('should handle empty set_replay_data event', () => {
    attacks_reader = new AttacksReader(mockActionEventSystem);
    attacks_reader.set_config(mock_simple_config);
    attacks_reader.analyse_replay_data([]);

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_attacks', [[[]], [[]]]);
});

it('should create an attack with the information units that spawned in the same turn', () => {
    attacks_reader = new AttacksReader(mockActionEventSystem);
    attacks_reader.set_config(mock_simple_config);
    mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 1, '0', 1],
                    [[10, 11], 1, '1', 1],
                ]
            }
        }
    ]
    attacks_reader.analyse_replay_data(mock_replay_data);

    let expected_attacks = [
        [
            [],
            [
                [[10, 10], 1, 0, 1],
                [[10, 11], 1, 0, 1],
            ]
        ],
        [
            [],
        ]
    ];

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_attacks', expected_attacks);
});

it('should do both players separately', () => {
    attacks_reader = new AttacksReader(mockActionEventSystem);
    attacks_reader.set_config(mock_simple_config);
    mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 1, '0', 1],
                    [[10, 11], 1, '1', 1],
                    [[10, 14], 1, '2', 2],
                    [[10, 15], 1, '3', 2],
                ]
            }
        }
    ]
    attacks_reader.analyse_replay_data(mock_replay_data);

    let expected_attacks = [
        [
            [],
            [
                [[10, 10], 1, 0, 1],
                [[10, 11], 1, 0, 1],
            ]
        ],
        [
            [],
            [
                [[10, 14], 1, 1, 1],
                [[10, 15], 1, 1, 1],
            ]
        ]
    ];

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_attacks', expected_attacks);
});

it('should make different attack from multiple turns', () => {
    attacks_reader = new AttacksReader(mockActionEventSystem);
    attacks_reader.set_config(mock_simple_config);
    mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 1, '0', 1],
                ]
            }
        },
        {
            events: {
                spawn: [
                    [[10, 11], 1, '1', 1],
                ]
            }
        }
    ]
    attacks_reader.analyse_replay_data(mock_replay_data);

    let expected_attacks = [
        [
            [],
            [
                [[10, 10], 1, 0, 1],
            ],
            [
                [[10, 11], 1, 0, 1],
            ]
        ],
        [
            []
        ]
    ];

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_attacks', expected_attacks);
});

it('should calculate percentages correctly', () => {
    attacks_reader = new AttacksReader(mockActionEventSystem);
    attacks_reader.set_config(mock_simple_config);
    mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 1, '0', 1],
                    [[10, 10], 1, '1', 1],
                    [[10, 10], 1, '2', 1],
                    [[10, 11], 1, '3', 1],
                ]
            }
        }
    ]
    attacks_reader.analyse_replay_data(mock_replay_data);

    let expected_attacks = [
        [
            [],
            [
                [[10, 10], 1, 0, 3],
                [[10, 11], 1, 0, 1],
            ]
        ],
        [
            []
        ]
    ];

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_attacks', expected_attacks);
});

it('should drop random firewalls placed along of attack', () => {
    attacks_reader = new AttacksReader(mockActionEventSystem);
    attacks_reader.set_config(mock_simple_config);
    mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 0, '0', 1],
                    [[10, 10], 0, '1', 1],
                ]
            }
        }
    ]
    attacks_reader.analyse_replay_data(mock_replay_data);

    let expected_attacks = [
        [
            [],
        ],
        [
            [],
        ]
    ];

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_attacks', expected_attacks);
});


it('should add removals from previous turn when an attack was sent', () => {
    attacks_reader = new AttacksReader(mockActionEventSystem);
    attacks_reader.set_config(mock_simple_config);
    mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 2, '0', 1],//removal
                ]
            }
        },
        {
            events: {
                spawn: [
                    [[10, 10], 1, '0', 1],//spawn
                ]
            }
        }
    ]
    attacks_reader.analyse_replay_data(mock_replay_data);

    let expected_attacks = [
        [
            [],
            [
                [[10, 10], 1, 0, 1],//spawn
                [[10, 10], 2, 0, 0],//removal
            ]
        ],
        [
            [],
        ]
    ];

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_attacks', expected_attacks);
});

it('should dont add removals from previous turn when nothing else attack was sent', () => {
    attacks_reader = new AttacksReader(mockActionEventSystem);
    attacks_reader.set_config(mock_simple_config);
    mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 2, '0', 1],//removal
                ]
            }
        },
        {
            events: {
                spawn: [
                    [[10, 11], 2, '0', 1],//removal
                ]
            }
        }
    ]
    attacks_reader.analyse_replay_data(mock_replay_data);

    let expected_attacks = [
        [
            [],
        ],
        [
            [],
        ]
    ];

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_attacks', expected_attacks);
});
