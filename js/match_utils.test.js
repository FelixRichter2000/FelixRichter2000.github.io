const match_utils = require('./match_utils');
const mu_default = new match_utils();

const mu_size4 = new match_utils({
    field_contents: ['p1', 'p2'],
    arena_settings: { size: 4, half: 2 },
});

const mu_size2 = new match_utils({
    field_contents: ['p1', 'p2'],
    arena_settings: { size: 2, half: 1 },
});

describe('Test is_in_arena_bounds', function () {
    test('field [0, 0] -> false', () => {
        expect(mu_size4.is_in_arena_bounds(0, 0))
            .toBe(false);
    });
    test('field [0, 3] -> false', () => {
        expect(mu_size4.is_in_arena_bounds(0, 3))
            .toBe(false);
    });
    test('field [3, 3] -> false', () => {
        expect(mu_size4.is_in_arena_bounds(3, 3))
            .toBe(false);
    });
    test('field [3, 0] -> false', () => {
        expect(mu_size4.is_in_arena_bounds(3, 0))
            .toBe(false);
    });
    test('other fields -> true', () => {
        expect(mu_size4.is_in_arena_bounds(0, 1))
            .toBe(true);

        expect(mu_size4.is_in_arena_bounds(0, 2))
            .toBe(true);

        expect(mu_size4.is_in_arena_bounds(1, 0))
            .toBe(true);

        expect(mu_size4.is_in_arena_bounds(1, 1))
            .toBe(true);

        expect(mu_size4.is_in_arena_bounds(1, 2))
            .toBe(true);

        expect(mu_size4.is_in_arena_bounds(1, 3))
            .toBe(true);

        expect(mu_size4.is_in_arena_bounds(2, 0))
            .toBe(true);

        expect(mu_size4.is_in_arena_bounds(2, 1))
            .toBe(true);

        expect(mu_size4.is_in_arena_bounds(2, 2))
            .toBe(true);

        expect(mu_size4.is_in_arena_bounds(2, 3))
            .toBe(true);

        expect(mu_size4.is_in_arena_bounds(3, 1))
            .toBe(true);

        expect(mu_size4.is_in_arena_bounds(3, 2))
            .toBe(true);
    });
});
describe('Test generate_terminal_trs', function () {
    test('Generate generate_terminal_trs size 4', () => {
        expect(mu_size4.generate_terminal_trs())
            .toBe("<tr><td></td><td>p2</td><td>p2</td><td></td></tr>" +
                "<tr><td>p2</td><td>p2</td><td>p2</td><td>p2</td></tr>" +
                "<tr><td>p1</td><td>p1</td><td>p1</td><td>p1</td></tr>" +
                "<tr><td></td><td>p1</td><td>p1</td><td></td></tr>");
    });
});
describe('Test get_all_changeable_elements_flat', function () {
    test('Call get_all_changeable_elements_flat', () => {

        const mu_spezial = new match_utils({}, {
            td_to_elements_converter: function (td) {
                return td.getElementsByClassName('t');
            }
        });

        document.body.innerHTML = "<table id='test'><tr><td>" +
            "<label class=\"t\"></label>" +
            "<img class='t'/>" +
            "<img class='t'/>" +
            "<img class='a'/></td><td>" +
            "<label class='t'></label>" +
            "<img class='t'/>" +
            "<img class='t'/>" +
            "<img class='a'/></td></tr></table>";

        let table = document.getElementById('test');
        let children = mu_spezial.get_all_changeable_elements_flat(table);

        expect(children.length)
            .toBe(6);

        expect(children[0].tagName)
            .toBe('LABEL');

        expect(children[1].tagName)
            .toBe('IMG');

        expect(children[2].tagName)
            .toBe('IMG');

        expect(children[3].tagName)
            .toBe('LABEL');

        expect(children[4].tagName)
            .toBe('IMG');

        expect(children[5].tagName)
            .toBe('IMG');
    });
});
describe('Test put_value_in_range', function () {
    test('Generate put_value_in_range -1 range(0, 4)', () => {
        expect(mu_size4.put_value_in_range(-1, { min: 0, max: 4 }))
            .toBe(0);
    });
    test('Generate put_value_in_range  1 range(0, 4)', () => {
        expect(mu_size4.put_value_in_range(1, { min: 0, max: 4 }))
            .toBe(1);
    });
    test('Generate put_value_in_range 10 range(0, 4)', () => {
        expect(mu_size4.put_value_in_range(10, { min: 0, max: 4 }))
            .toBe(4);
    });
});
describe('Test spez', function () {
    test('Generate spez [1, 0] => 1', () => {
        expect(mu_size4.spez(1, 0))
            .toBe(1);
    });
    test('Generate spez [1, 2] => 9', () => {
        expect(mu_size4.spez(1, 2))
            .toBe(9);
    });
    test('Generate spez [2, 2] => 10', () => {
        expect(mu_size4.spez(2, 2))
            .toBe(10);
    });
});
describe('Test generate_location_to_index_map', function () {
    test('Generate generate_location_to_index_map []', () => {
        expect(mu_size4.generate_location_to_index_map())
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
        let map = mu_size4.generate_location_to_index_map();
        let location = [1, 1];
        // . 0 0 .
        // 0 0 0 0
        // 0 X 0 0  => should be 7
        // . 0 0 .

        expect(mu_size4.location_to_index(location, map))
            .toBe(7);
    });
    test('Find Index with location_to_index ', () => {
        let map = mu_size4.generate_location_to_index_map();
        let location = [2, 1];
        // . 0 0 .
        // 0 0 0 0
        // 0 0 X 0  => should be 8
        // . 0 0 .

        expect(mu_size4.location_to_index(location, map))
            .toBe(8);
    });
    test('Find Index with location_to_index ', () => {
        let map = mu_size4.generate_location_to_index_map();
        let location = [2, 3];
        // . 0 X .  => should be 1
        // 0 0 0 0
        // 0 0 0 0
        // . 0 0 .

        expect(mu_size4.location_to_index(location, map))
            .toBe(1);
    });
});
describe('Test parse_row_to_single_array', function () {
    test('parse_row_to_single_array ', () => {
        let row = '{"p1Units": [[1, 1], [2], [3], [4], [5], [6], [7, 77], [8, 88]], "p2Units": [[10], [20, 21], [30], [40], [50], [60], [70, 71], [80, 81]]}';

        expect(mu_default.parse_row_to_single_array(JSON.parse(row)))
            .toEqual([[1, 1, 10], [2, 20, 21], [3, 30], [4], [5], [6], [40], [50], [60], [7, 77, 70, 71], [8, 88, 80, 81]]);
    });
});
describe('Test parse_replay_row_to_array', function () {
    test('parse_replay_row_to_array with filters', () => {
        let row = '{"p1Units": [[[0, 0, 60, "32"]], [], [], [], [], [], [], []], "p2Units": [[[0, 1, 30, "33"]], [], [], [], [], [], [], []]}';

        expect(mu_size2.parse_replay_row_to_array(JSON.parse(row)))
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

        expect(mu_size2.parse_replay_row_to_array(JSON.parse(row)))
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

        expect(mu_size2.parse_replay_row_to_array(JSON.parse(row)))
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

        expect(mu_size2.parse_replay_row_to_array(JSON.parse(row)))
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

        expect(mu_size2.parse_replay_row_to_array(JSON.parse(row)))
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

        expect(mu_size2.parse_replay_row_to_array(JSON.parse(row)))
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

        expect(mu_size2.parse_replay_row_to_array(JSON.parse(row)))
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

        expect(mu_size2.parse_replay_row_to_array(JSON.parse(row)))
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

        expect(mu_size2.parse_replay_row_to_array(JSON.parse(row)))
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
describe('Test parse_file_to_raw_array', function () {
    test('Parse all lines with content to array ', () => {
        let file = '{"v1": 1}\n{"v2": 2}\n\n\n{"v3": 3}';

        expect(mu_size2.parse_file_to_raw_array(file))
            .toEqual([{ v1: 1 }, { v2: 2 }, { v3: 3 }]);
    });
});



