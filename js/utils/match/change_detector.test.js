const ChangeDetector = require("./change_detector");

const empty_game_state = {
    p1Units: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ],
    p2Units: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ]
};


describe('create ChangeDetector', () => {
    test('create', () => {
        new ChangeDetector();
    });
});

describe('detect changes', () => {
    it('has a method called detect_changes that throws when the parameter after has no p1Units property', () => {
        let change_detector = new ChangeDetector();;
        expect(() => change_detector.detect_changes()).toThrow();
    });

    it('should return an array with four empty arrays when nothing is different', () => {
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes(empty_game_state, empty_game_state);
        expect(changes).toEqual([
            [],
            [],
            [],
            []
        ]);
    });

    it('should return an additional filter at 0, 0', () => {
        const game_state_after = {
            p1Units: [
                [
                    [0, 0, 60, '1']
                ],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ],
            p2Units: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        };

        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes(empty_game_state, game_state_after);
        expect(changes).toEqual([
            [
                ['FF', 0, 0]
            ],
            [],
            [],
            []
        ]);
    });

    it('should return an additional filter at 1, 12', () => {
        const game_state_after = {
            p1Units: [
                [
                    [1, 12, 60, '1']
                ],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ],
            p2Units: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        };

        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes(empty_game_state, game_state_after);
        expect(changes).toEqual([
            [
                ['FF', 1, 12]
            ],
            [],
            [],
            []
        ]);
    });

    it('should return multiple additional filters at [2, 2] and [3, 3]', () => {
        const game_state_after = {
            p1Units: [
                [
                    [2, 2, 60, '1'],
                    [3, 3, 60, '1']
                ],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ],
            p2Units: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        };

        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes(empty_game_state, game_state_after);
        expect(changes).toEqual([
            [
                ['FF', 2, 2],
                ['FF', 3, 3]
            ],
            [],
            [],
            []
        ]);
    });

    it('should not return filters when the filter was already there before', () => {
        const game_state_before = {
            p1Units: [
                [
                    [1, 12, 60, '1']
                ],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ],
            p2Units: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        };
        const game_state_after = {
            p1Units: [
                [
                    [1, 12, 60, '1']
                ],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ],
            p2Units: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        };

        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes(game_state_before, game_state_after);
        expect(changes).toEqual([
            [],
            [],
            [],
            []
        ]);
    });

    it('should return an additional destructor at 1, 12', () => {
        const game_state_after = {
            p1Units: [
                [],
                [
                    [1, 12, 60, '1']
                ],
                [],
                [],
                [],
                [],
                [],
                []
            ],
            p2Units: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        };

        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes(empty_game_state, game_state_after);
        expect(changes).toEqual([
            [
                ['DF', 1, 12]
            ],
            [],
            [],
            []
        ]);
    });

    it('should return an additional encryptor at 1, 12', () => {
        const game_state_after = {
            p1Units: [
                [],
                [],
                [
                    [1, 12, 60, '1']
                ],
                [],
                [],
                [],
                [],
                []
            ],
            p2Units: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        };

        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes(empty_game_state, game_state_after);
        expect(changes).toEqual([
            [
                ['EF', 1, 12]
            ],
            [],
            [],
            []
        ]);
    });

    it('should return an removal at 1, 12', () => {
        const game_state_before = {
            p1Units: [
                [
                    [1, 12, 60, '1']
                ],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ],
            p2Units: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        };
        const game_state_after = {
            p1Units: [
                [
                    [1, 12, 60, '1']
                ],
                [],
                [],
                [],
                [],
                [],
                [
                    [1, 12, 60, '1']
                ],
                []
            ],
            p2Units: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        };

        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes(game_state_before, game_state_after);
        expect(changes).toEqual([
            [
                ['RM', 1, 12]
            ],
            [],
            [],
            []
        ]);
    });

    it('should return an upgrade at 1, 12', () => {
        const game_state_before = {
            p1Units: [
                [
                    [1, 12, 60, '1']
                ],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ],
            p2Units: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        };
        const game_state_after = {
            p1Units: [
                [
                    [1, 12, 60, '1']
                ],
                [],
                [],
                [],
                [],
                [],
                [],
                [
                    [1, 12, 60, '1']
                ]
            ],
            p2Units: [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        };

        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes(game_state_before, game_state_after);
        expect(changes).toEqual([
            [
                ['UP', 1, 12]
            ],
            [],
            [],
            []
        ]);
    });
});