const LayoutReader = require("./layout_reader");
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

let mock_real_config = {
    "unitInformation": [
        {
            "unitCategory": 0
        },
        {
            "unitCategory": 0
        },
        {
            "unitCategory": 0
        },
        {
            "unitCategory": 1
        },
        {
            "unitCategory": 1
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
    layout_reader = new LayoutReader(mockActionEventSystem);
});

it('should handle the set_config event', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
    layout_reader.set_config(mock_real_config);
});

it('should handle empty set_replay_data event', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
    layout_reader.set_config(mock_real_config);
    layout_reader.analyse_replay_data([]);

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_replay_data', []);
});

it('should ignore everything that is not a firewall or upgrade with simplified config', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
    layout_reader.set_config(mock_simple_config);
    let mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 0, '0', 1],
                    [[10, 11], 1, '1', 1],
                    [[10, 12], 2, '2', 1],
                    [[10, 13], 3, '3', 1],
                ]
            }
        }
    ]
    layout_reader.analyse_replay_data(mock_replay_data);

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_replay_data', [
            {
                p0: [
                    [[10, 10], 0, '', 0],
                    [[10, 13], 3, '', 0],
                ],
                p1: [
                ],
                frame: 0,
                turnInfo: [1, 0, 0, 0],
            },
            {
                p0: [
                    [[10, 10], 0, '', 0],
                    [[10, 13], 3, '', 0],
                ],
                p1: [
                ],
                frame: 1,
                turnInfo: [1, 0, 1, 1],
            }
        ]);
});


it('should handle simple analyse_replay_data event', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
    layout_reader.set_config(mock_real_config);

    let mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 0, '0', 1],
                    [[10, 15], 0, '1', 2],
                ]
            }
        }
    ]

    layout_reader.analyse_replay_data(mock_replay_data);

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_replay_data', [
            {
                p0: [
                    [[10, 10], 0, '', 0],
                ],
                p1: [
                    [[10, 15], 0, '', 1],
                ],
                frame: 0,
                turnInfo: [1, 0, 0, 0],
            }
        ]);
})

it('should handle simple analyse_replay_data event 2', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
    layout_reader.set_config(mock_real_config);
    let mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 0, '0', 1],
                    [[10, 11], 0, '1', 1],
                ]
            }
        }
    ]
    layout_reader.analyse_replay_data(mock_replay_data);

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_replay_data', [
            {
                p0: [
                    [[10, 10], 0, '', 0],
                    [[10, 11], 0, '', 0],
                ],
                p1: [
                ],
                frame: 0,
                turnInfo: [1, 0, 0, 0],
            },
            {
                p0: [
                    [[10, 10], 0, '', 0],
                    [[10, 11], 0, '', 0],
                ],
                p1: [
                ],
                frame: 1,
                turnInfo: [1, 0, 1, 1],
            }
        ]);
});

it('should ignore everything that is not a firewall or upgrade', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
    layout_reader.set_config(mock_real_config);
    let mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 0, '0', 1],
                    [[10, 11], 3, '1', 1],
                    [[10, 12], 4, '2', 1],
                    [[10, 13], 5, '3', 1],
                    [[10, 14], 6, '4', 1],
                    [[10, 15], 7, '5', 1],
                ]
            }
        }
    ]
    layout_reader.analyse_replay_data(mock_replay_data);

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_replay_data', [
            {
                p0: [
                    [[10, 10], 0, '', 0],
                    [[10, 15], 7, '', 0],
                ],
                p1: [
                ],
                frame: 0,
                turnInfo: [1, 0, 0, 0],
            },
            {
                p0: [
                    [[10, 10], 0, '', 0],
                    [[10, 15], 7, '', 0],
                ],
                p1: [
                ],
                frame: 1,
                turnInfo: [1, 0, 1, 1],
            }
        ]);
});


it('should keep only unique firewalls and upgrades but in order', () => {
    layout_reader = new LayoutReader(mockActionEventSystem);
    layout_reader.set_config(mock_simple_config);
    let mock_replay_data = [
        {
            events: {
                spawn: [
                    [[10, 10], 0, '0', 1],
                    [[10, 10], 0, '1', 1],
                    [[10, 10], 3, '2', 1],
                    [[10, 10], 3, '3', 1],
                ]
            }
        }
    ]
    layout_reader.analyse_replay_data(mock_replay_data);

    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_replay_data', [
            {
                p0: [
                    [[10, 10], 0, '', 0],
                    [[10, 10], 3, '', 0],
                ],
                p1: [
                ],
                frame: 0,
                turnInfo: [1, 0, 0, 0],
            },
            {
                p0: [
                    [[10, 10], 0, '', 0],
                    [[10, 10], 3, '', 0],
                ],
                p1: [
                ],
                frame: 1,
                turnInfo: [1, 0, 1, 1],
            }
        ]);
});
