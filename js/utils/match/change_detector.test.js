const ChangeDetector = require("./change_detector");

//Format of spawns: [[[x, y], type, id, player_index], ...]
//Resultign format: [[p1FirewallSpawns],[p1InformationSpawns],[p2FirewallSpawns],[p2InformationSpawns]]
//resolting single spawn format: [type_shorthand, x, y]

describe('create ChangeDetector', () => {
    test('create', () => {
        new ChangeDetector();
    });
});

describe('detect changes', () => {
    it('has a method called detect_changes that returns empty actions when nothing gets passed', () => {
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes();
        expect(changes).toEqual([
            [],
            [],
            [],
            []
        ]);
    });

    it('has a method called detect_changes that returns empty actions an empty array gets passed', () => {
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes([]);
        expect(changes).toEqual([
            [],
            [],
            [],
            []
        ]);
    });

    it('should return an additional filter at 0, 0', () => {
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes([
            [
                [0, 0], 0, '0', 1
            ]
        ]);
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
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes([
            [
                [1, 12], 0, '0', 1
            ]
        ]);
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
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes([
            [
                [2, 2], 0, '0', 1
            ],
            [
                [3, 3], 0, '1', 1
            ]
        ]);
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

    it('should return an additional encryptor at 1, 12', () => {
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes([
            [
                [1, 12], 1, '0', 1
            ]
        ]);
        expect(changes).toEqual([
            [
                ['EF', 1, 12]
            ],
            [],
            [],
            []
        ]);
    });

    it('should return an additional destructor at 1, 12', () => {
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes([
            [
                [1, 12], 2, '0', 1
            ]
        ]);
        expect(changes).toEqual([
            [
                ['DF', 1, 12]
            ],
            [],
            [],
            []
        ]);
    });

    it('should return an removal at 1, 12', () => {
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes([
            [
                [1, 12], 6, '0', 1
            ]
        ]);
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
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes([
            [
                [1, 12], 7, '0', 1
            ]
        ]);
        expect(changes).toEqual([
            [
                ['UP', 1, 12]
            ],
            [],
            [],
            []
        ]);
    });

    it('should return a ping, emp and scrambler', () => {
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes([
            [
                [1, 12], 3, '0', 1
            ],
            [
                [1, 12], 4, '0', 1
            ],
            [
                [1, 12], 5, '0', 1
            ],
        ]);
        expect(changes).toEqual([
            [],
            [
                ['PI', 1, 12],
                ['EI', 1, 12],
                ['SI', 1, 12],
            ],
            [],
            []
        ]);
    });

    it('everything once of player 2', () => {
        let change_detector = new ChangeDetector();
        let changes = change_detector.detect_changes([
            [
                [1, 12], 0, '0', 2
            ],
            [
                [1, 12], 1, '0', 2
            ],
            [
                [1, 12], 2, '0', 2
            ],
            [
                [1, 12], 3, '0', 2
            ],
            [
                [1, 12], 4, '0', 2
            ],
            [
                [1, 12], 5, '0', 2
            ],
            [
                [1, 12], 6, '0', 2
            ],
            [
                [1, 12], 7, '0', 2
            ],
        ]);
        expect(changes).toEqual([
            [],
            [],
            [
                ['FF', 1, 12],
                ['EF', 1, 12],
                ['DF', 1, 12],
                ['RM', 1, 12],
                ['UP', 1, 12],
            ],
            [
                ['PI', 1, 12],
                ['EI', 1, 12],
                ['SI', 1, 12],
            ]
        ]);
    });
});