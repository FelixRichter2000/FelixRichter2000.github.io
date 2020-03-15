const mu = require('./match_utils');

describe('Test generate_default_td_contents', function () {

    test('single source', () => {
        expect(mu.generate_default_td_contents(['1']))
            .toMatchSnapshot();
    });

    test('two sources (1, 2)', () => {
        expect(mu.generate_default_td_contents(['1', '2']))
            .toMatchSnapshot();
    });

    test('multiple ("filter", "destructor", "encryptor")', () => {
        expect(mu.generate_default_td_contents(["filter", "destructor", "encryptor"]))
            .toMatchSnapshot();
    });

});

describe('Test generate_default_td_contents_v2', function () {

    test('single source', () => {
        expect(mu.generate_default_td_contents_v2('default', ['1']))
            .toMatchSnapshot();
    });

    test('two sources (1, 2)', () => {
        expect(mu.generate_default_td_contents_v2('default', ['1', '2']))
            .toMatchSnapshot();
    });

    test('multiple ("filter", "destructor", "encryptor")', () => {
        expect(mu.generate_default_td_contents_v2('default', ["filter", "destructor", "encryptor"]))
            .toMatchSnapshot();
    });

});

describe('Test generate_settings', function () {

    test('size 4', () => {
        expect(mu.generate_settings(4))
            .toEqual({ "half_size": 2, "size": 4, "image_count": 13 });
    });

    test('size 8', () => {
        expect(mu.generate_settings(8))
            .toEqual({ "half_size": 4, "size": 8, "image_count": 13 });
    });

});


describe('Test is_in_arena_bounds', function () {

    test('expect false (1)', () => {
        expect(mu.is_in_arena_bounds(0, 0, { size: 4, half_size: 2 }))
            .toBe(false);
    });

    test('expect false (2)', () => {
        expect(mu.is_in_arena_bounds(0, 3, { size: 4, half_size: 2 }))
            .toBe(false);
    });

    test('expect false (3)', () => {
        expect(mu.is_in_arena_bounds(3, 3, { size: 4, half_size: 2 }))
            .toBe(false);
    });

    test('expect false (4)', () => {
        expect(mu.is_in_arena_bounds(3, 0, { size: 4, half_size: 2 }))
            .toBe(false);
    });

    test('expect true (1)', () => {
        expect(mu.is_in_arena_bounds(0, 1, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (2)', () => {
        expect(mu.is_in_arena_bounds(0, 2, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (3)', () => {
        expect(mu.is_in_arena_bounds(1, 0, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (4)', () => {
        expect(mu.is_in_arena_bounds(1, 1, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (5)', () => {
        expect(mu.is_in_arena_bounds(1, 2, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (6)', () => {
        expect(mu.is_in_arena_bounds(1, 3, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (7)', () => {
        expect(mu.is_in_arena_bounds(2, 0, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (8)', () => {
        expect(mu.is_in_arena_bounds(2, 1, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (9)', () => {
        expect(mu.is_in_arena_bounds(2, 2, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (10)', () => {
        expect(mu.is_in_arena_bounds(2, 3, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (11)', () => {
        expect(mu.is_in_arena_bounds(3, 1, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (12)', () => {
        expect(mu.is_in_arena_bounds(3, 2, { size: 4, half_size: 2 }))
            .toBe(true);
    });

});


describe('Test generate_terminal_trs', function () {

    test('Generate generate_terminal_trs size 4', () => {
        expect(mu.generate_terminal_trs({ size: 4, half_size: 2 }, '.'))
            .toMatchSnapshot();
    });

    test('Generate generate_terminal_trs size 8', () => {
        expect(mu.generate_terminal_trs({ size: 8, half_size: 4 }, '.'))
            .toMatchSnapshot();
    });

});


describe('Test put_value_in_range', function () {

    test('Generate put_value_in_range -1 range(0, 4)', () => {
        expect(mu.put_value_in_range(-1, { min: 0, max: 4 }))
            .toBe(0);
    });

    test('Generate put_value_in_range 1 range(0, 4)', () => {
        expect(mu.put_value_in_range(1, { min: 0, max: 4 }))
            .toBe(1);
    });

    test('Generate put_value_in_range 10 range(0, 4)', () => {
        expect(mu.put_value_in_range(10, { min: 0, max: 4 }))
            .toBe(4);
    });

});


describe('Test create_viewer', function () {

    //test('Generate create_viewer', () => {
    //    expect(mu.create_viewer())
    //        .toMatchSnapshot();
    //});

});

describe('Test spez', function () {

    test('Generate spez []', () => {
        let settings = mu.generate_settings(4);
        expect(mu.spez(2, 2, settings))
            .toBe(10);
    });

});

describe('Test generate_location_to_index_map', function () {

    test('Generate generate_location_to_index_map []', () => {
        let settings = mu.generate_settings(4);
        expect(mu.generate_location_to_index_map(settings))
            .toEqual({
                1: 10,
                2: 11,
                4: 6,
                5: 7,
                6: 8,
                7: 9,
                8: 2,
                9: 3,
                10: 4,
                11: 5,
                13: 0,
                14: 1,
            });
    });

});

describe('Test location_to_index', function () {

    test('Find Index with location_to_index ', () => {
        let settings = mu.generate_settings(4);
        let map = mu.generate_location_to_index_map(settings);
        let location = [1, 1];
        // . 0 0 .
        // 0 0 0 0
        // 0 X 0 0  => should be 7
        // . 0 0 .

        expect(mu.location_to_index(location, map, settings))
            .toBe(7);
    });

    test('Find Index with location_to_index ', () => {
        let settings = mu.generate_settings(4);
        let map = mu.generate_location_to_index_map(settings);
        let location = [2, 1];
        // . 0 0 .
        // 0 0 0 0
        // 0 0 X 0  => should be 8
        // . 0 0 .

        expect(mu.location_to_index(location, map, settings))
            .toBe(8);
    });

    test('Find Index with location_to_index ', () => {
        let settings = mu.generate_settings(4);
        let map = mu.generate_location_to_index_map(settings);
        let location = [2, 3];
        // . 0 X .  => should be 1
        // 0 0 0 0
        // 0 0 0 0
        // . 0 0 .

        expect(mu.location_to_index(location, map, settings))
            .toBe(1);
    });

});

describe('Test parse_row_to_single_array', function () {

    test('parse_row_to_single_array ', () => {
        let row = '{"p1Units": [[1, 1], [2], [3], [4], [5], [6], [7, 77], [8, 88]], "p2Units": [[10], [20, 21], [30], [40], [50], [60], [70, 71], [80, 81]]}';

        expect(mu.parse_row_to_single_array(JSON.parse(row)))
            .toEqual([[1, 1, 10], [2, 20, 21], [3, 30], [4], [5], [6], [40], [50], [60], [7, 77, 70, 71], [8, 88, 80, 81]]);
    });

});

describe('Test parse_replay_row_to_array', function () {

    test('parse_replay_row_to_array with filters', () => {
        let row = '{"p1Units": [[[0, 0, 60, "32"]], [], [], [], [], [], [], []], "p2Units": [[[0, 1, 30, "33"]], [], [], [], [], [], [], []]}';
        let settings = mu.generate_settings(2);

        expect(mu.parse_replay_row_to_array(JSON.parse(row), settings))
            .toEqual(new Int8Array(
                [
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            ));
    });

    test('parse_replay_row_to_array with encryptors', () => {
        let row = '{"p1Units": [[], [[0, 0, 30, "32"]], [], [], [], [], [], []], "p2Units": [[], [[0, 1, 15, "33"]], [], [], [], [], [], []]}';
        let settings = mu.generate_settings(2);

        expect(mu.parse_replay_row_to_array(JSON.parse(row), settings))
            .toEqual(new Int8Array(
                [
                    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            ));
    });

    test('parse_replay_row_to_array with destructor', () => {
        let row = '{"p1Units": [[], [], [[0, 0, 75, "32"]], [], [], [], [], []], "p2Units": [[], [], [[0, 1, 45, "33"]], [], [], [], [], []]}';
        let settings = mu.generate_settings(2);

        expect(mu.parse_replay_row_to_array(JSON.parse(row), settings))
            .toEqual(new Int8Array(
                [
                    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 60, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            ));
    });

    test('parse_replay_row_to_array with ping', () => {
        let row = '{"p1Units": [[], [], [], [[0, 0, 60, "32"]], [], [], [], []], "p2Units": [[], [], [], [[0, 1, 60, "33"]], [], [], [], []]}';
        let settings = mu.generate_settings(2);

        expect(mu.parse_replay_row_to_array(JSON.parse(row), settings))
            .toEqual(new Int8Array(
                [
                    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            ));
    });

    test('parse_replay_row_to_array with emp', () => {
        let row = '{"p1Units": [[], [], [], [], [[0, 0, 60, "32"]], [], [], []], "p2Units": [[], [], [], [], [[0, 1, 60, "33"]], [], [], []]}';
        let settings = mu.generate_settings(2);

        expect(mu.parse_replay_row_to_array(JSON.parse(row), settings))
            .toEqual(new Int8Array(
                [
                    0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            ));
    });

    test('parse_replay_row_to_array with scrambler', () => {
        let row = '{"p1Units": [[], [], [], [], [], [[0, 0, 60, "32"]], [], []], "p2Units": [[], [], [], [], [], [[0, 1, 60, "33"]], [], []]}';
        let settings = mu.generate_settings(2);

        expect(mu.parse_replay_row_to_array(JSON.parse(row), settings))
            .toEqual(new Int8Array(
                [
                    0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            ));
    });

    test('parse_replay_row_to_array with removals', () => {
        let row = '{"p1Units": [[], [], [], [], [], [], [[0, 0, 60, "32"]], []], "p2Units": [[], [], [], [], [], [], [[0, 1, 60, "33"]], []]}';
        let settings = mu.generate_settings(2);

        expect(mu.parse_replay_row_to_array(JSON.parse(row), settings))
            .toEqual(new Int8Array(
                [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            ));
    });

    test('parse_replay_row_to_array with upgrades', () => {
        let row = '{"p1Units": [[], [], [], [], [], [], [], [[0, 0, 60, "32"]]], "p2Units": [[], [], [], [], [], [], [], [[0, 1, 60, "33"]]]}';
        let settings = mu.generate_settings(2);

        expect(mu.parse_replay_row_to_array(JSON.parse(row), settings))
            .toEqual(new Int8Array(
                [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            ));
    });

    test('parse_replay_row_to_array with multiple units on same location', () => {
        let row = '{"p1Units": [[], [], [], [[0, 0], [0, 0]], [], [], [], []], "p2Units": [[], [], [], [], [[0, 0]], [[0, 0]], [], []]}';
        let settings = mu.generate_settings(2);

        expect(mu.parse_replay_row_to_array(JSON.parse(row), settings))
            .toEqual(new Int8Array(
                [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 4,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
            ));
    });

});



