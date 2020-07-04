const match_utils = require('./match_utils');

const functions_config = {
    td_to_elements_converter: function(td) {
        return td.getElementsByClassName('t');
    },
    parse_row_to_single_array: function(row) {
        return [];
    },
    add_object_to_array: [],
    parse_frame_data_to_flat_array: function(self, frame_data) {
        return 0;
    },
    update_function: function(group, switched_index, current_element, value) {
        current_element.hidden = value == 0;
    },
    additional_flipping: function(self, index) {
        return index;
    }
};
const mu_size4 = new match_utils({
    field_contents: ['p1', 'p2'],
    arena_settings: { size: 4, half: 2 },
    group_size: 2,
}, functions_config);
const mu_size2 = new match_utils({
    field_contents: ['p1', 'p2'],
    arena_settings: { size: 2, half: 1 },
    group_size: 1,
}, functions_config);

describe('Test match_utils no params', function() {
    test('new match_utils() no error', () => {
        const mu_special = new match_utils();
    });
});
describe('Test flip_player_if_switched', function() {
    test('player_index: 1 switched: false => 1', () => {
        expect(mu_size2.flip_player_if_switched(1, false))
            .toBe(1);
    });
    test('player_index: 1 switched: true => 0', () => {
        expect(mu_size2.flip_player_if_switched(1, true))
            .toBe(0);
    });
});
describe('Test is_in_arena_bounds', function() {
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
describe('Test generate_terminal_trs', function() {
    test('Generate generate_terminal_trs size 4', () => {
        expect(mu_size4.generate_terminal_trs())
            .toBe("<tr><td></td><td>p2</td><td>p2</td><td></td></tr>" +
                "<tr><td>p2</td><td>p2</td><td>p2</td><td>p2</td></tr>" +
                "<tr><td>p1</td><td>p1</td><td>p1</td><td>p1</td></tr>" +
                "<tr><td></td><td>p1</td><td>p1</td><td></td></tr>");
    });
});
describe('Test get_all_changeable_elements_flat', function() {
    test('Call get_all_changeable_elements_flat', () => {
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
        let children = mu_size2.get_all_changeable_elements_flat(table);
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
describe('Test put_value_in_range', function() {
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
describe('Test spez', function() {
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
describe('Test generate_location_to_index_map', function() {
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
describe('Test location_to_index', function() {
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
describe('Test calculate_final_index', function() {
    test('index: 5 group: 3 group_size: 10 => 53', () => {
        const mu_special = new match_utils({
            group_size: 10,
        });

        expect(mu_special.calculate_final_index(5, 3))
            .toBe(53);
    });
    test('index: 2 group: 3 group_size:  5 => 13', () => {
        const mu_special = new match_utils({
            group_size: 5,
        });

        expect(mu_special.calculate_final_index(2, 3))
            .toBe(13);
    });
});
describe('Test set_value', function() {
    test('index: 2 group: 0 value: 1', () => {
        let array = [0, 0, 0, 0, 0, 0];
        mu_size4.set_value(array, 2, 0, 1)

        expect(array).toEqual([0, 0, 0, 0, 1, 0]);
    });
    test('index: 0 group: 1 value: 1', () => {
        let array = [0, 0, 0, 0, 0, 0];
        mu_size4.set_value(array, 0, 1, 1)

        expect(array).toEqual([0, 1, 0, 0, 0, 0]);
    });
});
describe('Test set_min', function() {
    test('index: 2 group: 0 value: 1 -> expect set', () => {
        let array = [0, 0, 0, 0, 0, 0];
        mu_size4.set_min(array, 2, 0, 1)

        expect(array).toEqual([0, 0, 0, 0, 1, 0]);
    });
    test('index: 2 group: 0 value: 1 -> expect reduced', () => {
        let array = [0, 0, 0, 0, 2, 0];
        mu_size4.set_min(array, 2, 0, 1)

        expect(array).toEqual([0, 0, 0, 0, 1, 0]);
    });
    test('index: 2 group: 0 value: 6 -> expect stay same', () => {
        let array = [0, 0, 0, 0, 2, 0];
        mu_size4.set_min(array, 2, 0, 6)

        expect(array).toEqual([0, 0, 0, 0, 2, 0]);
    });
});
describe('Test add_one', function() {
    test('index: 2 group: 0', () => {
        let array = [0, 0, 0, 0, 0, 0];
        mu_size4.add_one(array, 2, 0, 1)

        expect(array).toEqual([0, 0, 0, 0, 1, 0]);
    });
    test('index: 0 group: 1', () => {
        let array = [0, 2, 0, 0, 0, 0];
        mu_size4.add_one(array, 0, 1, 1)

        expect(array).toEqual([0, 3, 0, 0, 0, 0]);
    });
});
describe('Test calculate_array_size', function() {
    test('arena_settings: { size: 2, half: 1 }, group_size: 2 => 8', () => {
        const mu_special = new match_utils({
            arena_settings: { size: 2, half: 1 },
            group_size: 2,
        });

        expect(mu_special.calculate_array_size())
            .toBe(8);
    });
    test('arena_settings: { size: 4, half: 2 }, group_size: 8 => 96', () => {
        const mu_special = new match_utils({
            arena_settings: { size: 4, half: 2 },
            group_size: 8,
        });

        expect(mu_special.calculate_array_size())
            .toBe(96);
    });
});
describe('Test create_new_array', function() {
    test('arena_settings: { size: 2, half: 1 }, group_size: 2 => Int8Array(8)', () => {
        const mu_special = new match_utils({
            arena_settings: { size: 2, half: 1 },
            group_size: 2,
        });

        expect(mu_special.create_new_array())
            .toEqual(new Int8Array(8));
    });
    test('arena_settings: { size: 4, half: 2 }, group_size: 8 => Int8Array(96)', () => {
        const mu_special = new match_utils({
            arena_settings: { size: 4, half: 2 },
            group_size: 8,
        });

        expect(mu_special.create_new_array())
            .toEqual(new Int8Array(96));
    });
});
describe('Test parse_file_to_raw_array', function() {
    test('Parse {"v1": 1}\\n{"v2": 2}\\n\\n\\n{"v3": 3} to [{ v1: 1 }, { v2: 2 }, { v3: 3 }]', () => {
        const mu_special = new match_utils({}, {
            parse_frame_data_to_flat_array: function(self, frame_data) {
                return frame_data * 2;
            },
        });

        let file = '{"v1": 1}\n{"v2": 2}\n\n\n{"v3": 3}';

        expect(mu_special.parse_file_to_raw_array(file))
            .toEqual([{ v1: 1 }, { v2: 2 }, { v3: 3 }]);
    });
});
describe('Test parse_objects_to_arrays', function() {
    test('Parse [1, 2, 3] => [2, 4, 6]', () => {
        const mu_special = new match_utils({}, {
            parse_frame_data_to_flat_array: function(self, frame_data) {
                return frame_data * 2;
            },
        });

        expect(mu_special.parse_objects_to_arrays([1, 2, 3]))
            .toEqual([2, 4, 6]);
    });
});
describe('Test calculate_switched_index', function() {
    test('index: 2, switched: true => 1', () => {
        const mu_special = new match_utils({
            arena_settings: { size: 2, half: 1 },
            group_size: 1,
        }, {
            additional_flipping: function(self, index) {
                return index;
            }
        });

        expect(mu_special.calculate_switched_index(2, true))
            .toBe(1);
    });
    test('index: 2, switched: true, additional if 1 then 99 => 99', () => {
        const mu_special = new match_utils({
            arena_settings: { size: 2, half: 1 },
            group_size: 1,
        }, {
            additional_flipping: function(self, index) {
                if (index === 1) return 99;
                return index;
            }
        });

        expect(mu_special.calculate_switched_index(2, true))
            .toBe(99);
    });
    test('index: 0, switched: true => 3', () => {
        const mu_special = new match_utils({
            arena_settings: { size: 2, half: 1 },
            group_size: 1,
        }, {
            additional_flipping: function(self, index) {
                return index;
            }
        });

        expect(mu_special.calculate_switched_index(0, true))
            .toBe(3);
    });
    test('index: 0, switched: false => 0', () => {
        const mu_special = new match_utils({
            arena_settings: { size: 2, half: 1 },
            group_size: 1,
        }, {
            additional_flipping: function(self, index) {
                return index;
            }
        });

        expect(mu_special.calculate_switched_index(0, false))
            .toBe(0);
    });
});
describe('Test toggle_hidden', function() {
    test('test false, true, false => true, false, true', () => {
        let array = [{ hidden: false }, { hidden: true }, { hidden: false }];

        mu_size2.toggle_hidden(array);

        expect(array)
            .toEqual([{ hidden: true }, { hidden: false }, { hidden: true }]);
    });
});
describe('Test update_changes', function() {
    test('update_changes(0, 1, data, images, false)', () => {
        const mu_special = new match_utils({
            arena_settings: { size: 2, half: 1 },
            group_size: 1,
        }, {
            update_function: function(group, switched_index, current_element, value) {
                current_element.hidden = value == 0;
            }
        });

        let images = [{ hidden: true }, { hidden: true }, { hidden: true }, { hidden: true }];
        let data = [
            [0, 0, 0, 0],
            [0, 1, 1, 0]
        ];

        mu_special.update_changes(0, 1, data, images, false);

        expect(images)
            .toEqual([{ hidden: true }, { hidden: false }, { hidden: false }, { hidden: true }]);
    });
    test('update_changes(1, 0, data, images, false)', () => {
        const mu_special = new match_utils({
            arena_settings: { size: 2, half: 1 },
            group_size: 1,
        }, {
            update_function: function(group, switched_index, current_element, value) {
                current_element.hidden = value == 0;
            }
        });

        let images = [{ hidden: true }, { hidden: false }, { hidden: true }, { hidden: true }];
        let data = [
            [0, 0, 1, 0],
            [0, 5, 0, 0]
        ];

        mu_special.update_changes(1, 0, data, images, false);

        expect(images)
            .toEqual([{ hidden: true }, { hidden: true }, { hidden: false }, { hidden: true }]);
    });
});
describe('Test switch_view', function() {
    test('switch_view(1, data, images, false)', () => {
        const mu_special = new match_utils({
            arena_settings: { size: 2, half: 1 },
            group_size: 1,
        }, {
            update_function: function(group, switched_index, current_element, value) {
                current_element.hidden = value == 0;
            },
            additional_flipping: function(self, index) {
                return index;
            }
        });

        let images = [{ hidden: true }, { hidden: true }, { hidden: false }, { hidden: false }];
        let data = [
            [0, 0, 0, 0],
            [0, 0, 1, 1]
        ];

        mu_special.switch_view(1, data, images, false);

        expect(images)
            .toEqual([{ hidden: false }, { hidden: false }, { hidden: true }, { hidden: true }]);
    });
});
describe('Test get_custome_value_at', function() {
    test('location: [0, 0], flipped: false, group: 0, data: [1, 2, 3, 4] =>  3', () => {
        expect(mu_size2.get_custome_value_at([0, 0], false, 0, [1, 2, 3, 4]))
            .toBe(3);
    });
    test('location: [0, 0], flipped: true,  group: 0, data: [1, 2, 3, 4] =>  2', () => {
        expect(mu_size2.get_custome_value_at([0, 0], true, 0, [1, 2, 3, 4]))
            .toBe(2);
    });
    test('location: [0, 1], flipped: false, group: 0, data: [1, 2, 3, 4] =>  1', () => {
        expect(mu_size2.get_custome_value_at([0, 1], false, 0, [1, 2, 3, 4]))
            .toBe(1);
    });
    test('location: [0, 1], flipped: false, group: 1, data: [1, 2 ...24] => 14', () => {
        expect(mu_size4.get_custome_value_at([0, 1], false, 1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]))
            .toBe(14);
    });
});
describe('Test get_locations_in_range', function() {
    test('size: 2, location: [0, 0], range: 1 => [1, 0, 1, 1]', () => {
        mu_special = new match_utils({
            arena_settings: {
                size: 2,
                half: 1
            },
            group_size: 1,
        });
        expect(mu_special.get_locations_in_range([0, 0], 1))
            .toEqual(new Int8Array([1, 0, 1, 1]));
    });
});

//Functions config tests, should be moved to another file
//describe('Test parse_frame_data_to_flat_array', function () {
//    test('parse_frame_data_to_flat_array with filters', () => {
//        let row = '{"p1Units": [[[0, 0, 60, "32"]], [], [], [], [], [], [], []], "p2Units": [[[0, 1, 30, "33"]], [], [], [], [], [], [], []]}';

//        expect(mu_size2.config.parse_frame_data_to_flat_array(mu_size2, JSON.parse(row)))
//            .toEqual(new Int8Array(
//                [
//                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                ]
//            ));
//    });
//    test('parse_frame_data_to_flat_array with encryptors', () => {
//        let row = '{"p1Units": [[], [[0, 0, 30, "32"]], [], [], [], [], [], []], "p2Units": [[], [[0, 1, 15, "33"]], [], [], [], [], [], []]}';

//        expect(mu_size2.config.parse_frame_data_to_flat_array(mu_size2, JSON.parse(row)))
//            .toEqual(new Int8Array(
//                [
//                    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                    0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                ]
//            ));
//    });
//    test('parse_frame_data_to_flat_array with destructor', () => {
//        let row = '{"p1Units": [[], [], [[0, 0, 75, "32"]], [], [], [], [], []], "p2Units": [[], [], [[0, 1, 45, "33"]], [], [], [], [], []]}';

//        expect(mu_size2.config.parse_frame_data_to_flat_array(mu_size2, JSON.parse(row)))
//            .toEqual(new Int8Array(
//                [
//                    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 60, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 100, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                ]
//            ));
//    });
//    test('parse_frame_data_to_flat_array with ping', () => {
//        let row = '{"p1Units": [[], [], [], [[0, 0, 60, "32"]], [], [], [], []], "p2Units": [[], [], [], [[0, 1, 60, "33"]], [], [], [], []]}';

//        expect(mu_size2.config.parse_frame_data_to_flat_array(mu_size2, JSON.parse(row)))
//            .toEqual(new Int8Array(
//                [
//                    0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                    0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                ]
//            ));
//    });
//    test('parse_frame_data_to_flat_array with emp', () => {
//        let row = '{"p1Units": [[], [], [], [], [[0, 0, 60, "32"]], [], [], []], "p2Units": [[], [], [], [], [[0, 1, 60, "33"]], [], [], []]}';

//        expect(mu_size2.config.parse_frame_data_to_flat_array(mu_size2, JSON.parse(row)))
//            .toEqual(new Int8Array(
//                [
//                    0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                    0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                ]
//            ));
//    });
//    test('parse_frame_data_to_flat_array with scrambler', () => {
//        let row = '{"p1Units": [[], [], [], [], [], [[0, 0, 60, "32"]], [], []], "p2Units": [[], [], [], [], [], [[0, 1, 60, "33"]], [], []]}';

//        expect(mu_size2.config.parse_frame_data_to_flat_array(mu_size2, JSON.parse(row)))
//            .toEqual(new Int8Array(
//                [
//                    0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                ]
//            ));
//    });
//    test('parse_frame_data_to_flat_array with removals', () => {
//        let row = '{"p1Units": [[], [], [], [], [], [], [[0, 0, 60, "32"]], []], "p2Units": [[], [], [], [], [], [], [[0, 1, 60, "33"]], []]}';

//        expect(mu_size2.config.parse_frame_data_to_flat_array(mu_size2, JSON.parse(row)))
//            .toEqual(new Int8Array(
//                [
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                ]
//            ));
//    });
//    test('parse_frame_data_to_flat_array with upgrades', () => {
//        let row = '{"p1Units": [[], [], [], [], [], [], [], [[0, 0, 60, "32"]]], "p2Units": [[], [], [], [], [], [], [], [[0, 1, 60, "33"]]]}';

//        expect(mu_size2.config.parse_frame_data_to_flat_array(mu_size2, JSON.parse(row)))
//            .toEqual(new Int8Array(
//                [
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                ]
//            ));
//    });
//    test('parse_frame_data_to_flat_array with multiple units on same location', () => {
//        let row = '{"p1Units": [[], [], [], [[0, 0], [0, 0]], [], [], [], []], "p2Units": [[], [], [], [], [[0, 0]], [[0, 0]], [], []]}';

//        expect(mu_size2.config.parse_frame_data_to_flat_array(mu_size2, JSON.parse(row)))
//            .toEqual(new Int8Array(
//                [
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                    0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 4,
//                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//                ]
//            ));
//    });
//});
//describe('Test parse_row_to_single_array', function () {
//    test('parse_row_to_single_array ', () => {
//        let row = '{"p1Units": [[1, 1], [2], [3], [4], [5], [6], [7, 77], [8, 88]], "p2Units": [[10], [20, 21], [30], [40], [50], [60], [70, 71], [80, 81]]}';

//        expect(mu_default.config.parse_row_to_single_array(JSON.parse(row)))
//            .toEqual([[1, 1, 10], [2, 20, 21], [3, 30], [4], [5], [6], [40], [50], [60], [7, 77, 70, 71], [8, 88, 80, 81]]);
//    });
//});