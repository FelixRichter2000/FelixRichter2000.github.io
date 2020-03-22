+function (global) {

    //General
    const quantity_label = '<label class="quantity"></label>';
    const empty_field_img = '<img class="match-default-img" src="images/EmptyField.svg">';
    const damage_bar_svg = '<svg preserveAspectRatio="xMinYMin meet" viewBox="0 0 30 30"><circle class="damage-bar" cx="15" cy="15" r="16"></circle></svg >';
    const remove_img = '<img class="match-changing-img" src="images/Remove.svg">';
    const upgrade_img = '<img class="match-changing-img" src="images/Upgrade.svg">';

    //P1
    const filter1_img = '<img class="match-changing-img" src="images/Filter1.svg">';
    const encryptor1_img = '<img class="match-changing-img" src="images/Encryptor1.svg">';
    const destructor1_img = '<img class="match-changing-img" src="images/Destructor1.svg">';
    const ping1_img = '<img class="match-changing-img" src="images/Ping1.svg">';
    const emp1_img = '<img class="match-changing-img" src="images/Emp1.svg">';
    const scrambler1_img = '<img class="match-changing-img" src="images/Scrambler1.svg">';

    //P2
    const filter2_img = '<img class="match-changing-img" src="images/Filter2.svg">';
    const encryptor2_img = '<img class="match-changing-img" src="images/Encryptor2.svg">';
    const destructor2_img = '<img class="match-changing-img" src="images/Destructor2.svg">';
    const ping2_img = '<img class="match-changing-img" src="images/Ping2.svg">';
    const emp2_img = '<img class="match-changing-img" src="images/Emp2.svg">';
    const scrambler2_img = '<img class="match-changing-img" src="images/Scrambler2.svg">';

    const functions_config = {
        td_to_elements_converter: function (td) {
            let ims = td.getElementsByClassName('match-changing-img');
            let quantity_label = td.getElementsByClassName('quantity');
            let damage_bar = td.getElementsByClassName('damage-bar');
            return [...ims, ...damage_bar, ...quantity_label];
        },
    };

    const static_config = {

        field_contents: [
            empty_field_img + 
            filter1_img +
            encryptor1_img +
            destructor1_img +
            damage_bar_svg +
            ping1_img +
            emp1_img +
            scrambler1_img +
            ping2_img +
            emp2_img +
            scrambler2_img +
            remove_img + 
            upgrade_img +
            quantity_label,

            empty_field_img +
            filter2_img +
            encryptor2_img +
            destructor2_img +
            damage_bar_svg +
            ping1_img +
            emp1_img +
            scrambler1_img +
            ping2_img +
            emp2_img +
            scrambler2_img +
            remove_img +
            upgrade_img +
            quantity_label
        ],

        arena_settings: {
            size: 28,
            half: 14
        },

        ///Old Settings

        firewalls: [
            ["images/Filter1.svg", "images/Encryptor1.svg", "images/Destructor1.svg"],
            ["images/Filter2.svg", "images/Encryptor2.svg", "images/Destructor2.svg"],
        ],

        damage_img: "images/damage.svg",

        information: [
            "images/Ping1.svg", "images/Emp1.svg", "images/Scrambler1.svg",
            "images/Ping2.svg", "images/Emp2.svg", "images/Scrambler2.svg",
            "images/Remove.svg", "images/Upgrade.svg",
        ],

        sources: ["images/Filter1.svg", "images/Encryptor1.svg", "images/Destructor1.svg",
            "images/Ping1.svg", "images/Emp1.svg", "images/Scrambler1.svg",
            "images/Ping2.svg", "images/Emp2.svg", "images/Scrambler2.svg",
            "images/Remove.svg"],

        default_img: "images/EmptyField.svg",

        damage_svg: '<svg preserveAspectRatio="xMinYMin meet" viewBox="0 0 30 30"><circle class="damage-bar" cx="15" cy="15" r="16"></circle></svg >',

        upgrade_index: 10,
        health_index: 11,

        arena_size: 28,

        group_size: 13,

        full_health: {
            0: [60, 120],
            1: [30, 30],
            2: [75, 75],
        },
    }

    let match_utils = function (new_config, new_functions, terminal_config) {
        this.config = {};
        Object.assign(this.config, JSON.parse(JSON.stringify(static_config)));
        Object.assign(this.config, new_config || {});
        Object.assign(this.config, functions_config);
        Object.assign(this.config, new_functions || {});
        this.terminal_config = terminal_config;

        //Init
        this.location_to_index_map = this.generate_location_to_index_map();
    };
    let proto = match_utils.prototype;

    proto.is_in_arena_bounds = function (x, y) {
        const half = this.config.arena_settings.half;

        return Math.abs(x - half + .5) + Math.abs(y - half + .5) < (half + 1);
    };
    proto.generate_terminal_trs = function () {
        const settings = this.config.arena_settings;
        const field_contents = this.config.field_contents;

        let trs = '';
        for (var y = 0; y < settings.size; y++) {
            trs += '<tr>';
            for (var x = 0; x < settings.size; x++) {
                trs += '<td>';
                if (this.is_in_arena_bounds(x, y))
                    trs += field_contents[parseInt((settings.size - 1 - y) / settings.half)];
                trs += '</td>';
            }
            trs += '</tr>';
        }
        return trs;
    };
    proto.get_all_changeable_elements_flat = function (table) {
        let converter = this.config.td_to_elements_converter;
        return [...table.getElementsByTagName('td')]
            .reduce((a, v) => [...a, ...converter(v)], []);
    }
    proto.put_value_in_range = function (value, range) {
        if (value < range.min) {
            return range.min;
        }
        if (value > range.max) {
            return range.max;
        }
        return value;
    }
    proto.spez = function (x, y) {
        const settings = this.config.arena_settings;
        return x + y * settings.size;
    };
    proto.generate_location_to_index_map = function () {
        const settings = this.config.arena_settings;

        let counter = 0;
        let map = {};
        for (var y = settings.size - 1; y >= 0; y--) {
            for (var x = 0; x < settings.size; x++) {
                if (this.is_in_arena_bounds(x, y, settings)) {
                    map[this.spez(x, y)] = counter;
                    counter++;
                }
            }
        }
        return map;
    };
    proto.location_to_index = function (location, map) {
        let x = location[0];
        let y = location[1];
        return map[this.spez(x, y)];
    };
    proto.calculate_final_index = function (index, group_index) {
        return index * this.config.group_size + group_index;
    }
    proto.is_upgraded = function (array, index) {
        let final_index = this.calculate_final_index(index, static_config.upgrade_index);
        return array[final_index];
    }
    proto.set_value = function (array, index, group_index, value) {
        let final_index = this.calculate_final_index(index, group_index);
        array[final_index] = value;
    };
    proto.add_one = function (array, index, group_index) {
        let final_index = this.calculate_final_index(index, group_index);
        array[final_index]++;
    };
    proto.calculate_array_size = function () {
        const size = this.config.arena_settings.size;
        return (size * size / 2 + size) * this.config.group_size;
    }
    proto.create_new_array = function () {
        return new Int8Array(this.calculate_array_size());
    }
    proto.combine_firewalls = function (p1Units, p2Units) {
        return p1Units.slice(0, 3).map(function (p1U, i) {
            return [...p1U, ...p2Units[i]];
        });
    };
    proto.combine_removals_and_upgrades = function (p1Units, p2Units) {
        return p1Units.slice(6, 8).map(function (p1U, i) {
            return [...p1U, ...p2Units[i + 6]];
        });
    };
    proto.parse_row_to_single_array = function (row) {
        return [
            ...this.combine_firewalls(row.p1Units, row.p2Units),
            ...row.p1Units.slice(3, 6),
            ...row.p2Units.slice(3, 6),
            ...this.combine_removals_and_upgrades(row.p1Units, row.p2Units),
        ];
    };
    proto.parse_replay_row_to_array = function (row) {
        let frame_data_array = this.create_new_array();

        let all_data = this.parse_row_to_single_array(row);

        //Reverse order is there, to make sure, upgrades have been set before damage gets calculated
        for (let group_index = all_data.length - 1; group_index >= 0; group_index--) {
            for (let location of all_data[group_index]) {
                let index = this.location_to_index(location, this.location_to_index_map);
                this.set_value(frame_data_array, index, group_index, 1);

                if (group_index >= 3 && group_index <= 8) {
                    this.add_one(frame_data_array, index, this.config.group_size - 1);
                }

                if (group_index < 3) {
                    let health = location[2];
                    let is_upgraded = this.is_upgraded(frame_data_array, index);
                    let total_health = static_config.full_health[group_index][is_upgraded];
                    let percental_health_left = health / total_health * 100;
                    this.set_value(frame_data_array, index, static_config.health_index, percental_health_left);
                }
            }
        }

        return frame_data_array;
    };
    proto.parse_file_to_raw_array = function (file) {
        return file.split("\n")
            .filter(el => el)
            .map(el => JSON.parse(el));
    }

    //Test this, when mu functions can be mocked
    proto.parse_objects_to_arrays = function (objects) {
        return objects.map(o => this.parse_replay_row_to_array(o));
    }
    proto.update_changes = function (i_previous, i_current, data, images, switched) {
        const data_previous = data[i_previous];
        const data_current = data[i_current];

        if (!data_previous) return;
        if (!data_current) return;

        const data_length = data_previous.length;
        const images_length = images.length;

        if (i_current >= data_length) return;

        for (let i = 0; i < data_length; i++) {
            if (i_previous == -1 && data_current[i] > 0 || data_previous[i] != data_current[i]) {

                const switched_index = this.calculate_switched_index(i, switched, images_length);
                let current_image = images[switched_index];

                if (current_image.tagName === 'LABEL') {
                    current_image.innerHTML = data_current[i];
                }
                else if (current_image.tagName === 'circle') {
                    current_image.style.strokeDashoffset = 1.00530964915 * data_current[i];
                }
                current_image.hidden = data_current[i] == 0;
            }
        }
    }
    proto.calculate_switched_index = function (index, switched, total_length) {
        if (!switched) return index;

        const switch_range_min = 3;
        const switch_range_max = 8;

        //Formular explanation with two examples

        //index = 13
        // -> field: 0, 1, 2, 3
        // -> element: 0, 1 <-- 13 % 4

        //index = 12
        // -> element: 12 % 4 = 0

        //group_size = 4

        //total_length = 12 * 4 = 48

        // 48 - 13 = 34 -> lets call it switched_index
        // -> false element: 34 % 4 = 2
        // -> corret element: 34 - 34 % 4 (= 32) + 4 - 2 - 1            ...    = 33
        // -> general: switched_index - switched_index % group_size + group_size - switched_index % group_size - 1
        // -> simplilfied: switched_index - 2 * (switched_index % group_size) + group_size - 1


        // 48 - 12 - 1 = 35
        // -> false element: 35 % 4 = 3
        // -> correct element: 35 - 2 * (35 % 4) + 4 - 1 = 32
        // ---> element: 32 % 4 = 0

        // . 0 0 .
        // 0 X 0 0
        // 0 0 0 0
        // . 0 0 .


        const switched_index = total_length - index - 1;
        let final_index = switched_index - 2 * (switched_index % static_config.group_size) + static_config.group_size - 1;

        //without ending
        const ending = final_index % static_config.group_size;

        if (ending >= switch_range_min && ending <= switch_range_max) {
            const without_ending = final_index - ending;

            //Fix information unit indexes
            // switch following indexes
            // 4 - 6, 7 - 9

            //4 -> 7
            //7 -> 4
            //6 -> 9

            //(4 - 4 + 3 ) % 6 + 4 = 

            //fixed ending
            const fixed_ending = (ending - switch_range_min + 3) % 6 + switch_range_min;

            final_index = without_ending + fixed_ending;
        }

        return final_index;
    }
    proto.toggle_hidden = function (elements) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].hidden = !elements[i].hidden;
        }
    }
    proto.switch_view = function (i_current, data, images, switched) {
        this.update_changes(i_current, 0, data, images, switched);
        this.update_changes(0, i_current, data, images, !switched);
    }
    proto.toggle_player_index = function (player_index, switched) {
        return switched ? (player_index + 1) % 2 : player_index;
    }

    if (typeof process !== 'undefined') {
        module.exports = match_utils;
    } else {
        if (!global.match_utils) {
            global.match_utils = new match_utils();
        }
    }
}(window);
