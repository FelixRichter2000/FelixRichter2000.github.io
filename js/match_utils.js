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

    //Group definitions:
    const FILTER = 0;
    const ENCRYPTOR = 1;
    const DESTRUCTOR = 2;
    const PING1 = 3;
    const EMP1 = 4;
    const SCRAMBLER1 = 5;
    const PING2 = 6;
    const EMP2 = 7;
    const SCRAMBLER2 = 8;
    const REMOVE = 9;
    const UPGRADE = 10;
    //Calculated values
    const DAMAGE_BAR = 11;
    const QUANTITY = 12;

    const is_upgraded = function (self, array, index) {
        let final_index = self.calculate_final_index(index, UPGRADE);
        return array[final_index];
    };

    const functions_config = {
        td_to_elements_converter: function (td) {
            let ims = td.getElementsByClassName('match-changing-img');
            let quantity_label = td.getElementsByClassName('quantity');
            let damage_bar = td.getElementsByClassName('damage-bar');
            return [...ims, ...damage_bar, ...quantity_label];
        },
        parse_row_to_single_array: function (row) {
            return [
                ...row.p1Units.slice(0, 3).map((p1U, i) => [...p1U, ...row.p2Units[i]]),
                ...row.p1Units.slice(3, 6),
                ...row.p2Units.slice(3, 6),
                ...row.p1Units.slice(6, 8).map((p1U, i) => [...p1U, ...row.p2Units[i + 6]]),
            ];
        },
        add_object_to_array: [
            function (self, group, location, index, frame_data_array) {
                ///Set flags
                //  Firewalls + Inforamtion + Removal + Upgrade
                if (group >= 0 && group <= 10) {
                    self.set_value(frame_data_array, index, group, 1);
                }

                ///Set Health
                //  Firewalls
                if (group >= 0 && group <= 2) { //TODO: Change 2 to 8 later
                    let health = location[2];
                    let upgraded = is_upgraded(self, frame_data_array, index);
                    let total_health = static_config.full_health[group][upgraded];
                    let percental_health_left = health / total_health * 100;
                    self.set_if_less(frame_data_array, index, DAMAGE_BAR, percental_health_left);

                    //let health = location[2];
                    //self.set_if_less(frame_data_array, index, group, health);
                }

                ///Add together for quantity
                //Information
                if (group >= 3 && group <= 8) {
                    self.add_one(frame_data_array, index, QUANTITY);
                }
            },
        ],
        parse_frame_data_to_flat_array: function (self, frame_data) {
            let frame_data_array = self.create_new_array();

            let all_data = self.config.parse_row_to_single_array(frame_data);

            //Reverse order is there, to make sure, upgrades have been set before damage gets calculated
            for (let group = all_data.length - 1; group >= 0; group--) {
                for (let location of all_data[group]) {
                    let index = self.location_to_index(location);
                    for (let converter of self.config.add_object_to_array) {
                        converter(self, group, location, index, frame_data_array);
                    }
                }
            }

            return frame_data_array;
        },
        update_function: function (group, switched_index, current_element, value) {
            //  Firewalls + Inforamtion + Removal + Upgrade + Quantity
            if (group >= 0 && group <= 10 || group === 12) {
                current_element.hidden = value == 0;
            }

            if (current_element.tagName === 'LABEL') {
                current_element.innerHTML = value;
            }
            else if (current_element.tagName === 'circle') {
                current_element.style.strokeDashoffset = 1.00530964915 * value;
            }
        },
        additional_flipping: function (self, index) {

            const switch_range_min = 3;
            const switch_range_max = 8;

            //without ending
            const ending = index % self.config.group_size;

            if (ending >= switch_range_min && ending <= switch_range_max) {
                const without_ending = index - ending;

                //fixed ending
                const fixed_ending = (ending - switch_range_min + 3) % 6 + switch_range_min;

                index = without_ending + fixed_ending;
            }

            return index;
        }
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

        group_size: 13,

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

        //group_size: 13,

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
        this.array_size = this.calculate_array_size();
    };
    let proto = match_utils.prototype;

    proto.flip_player_if_switched = function (player_index, switched) {
        return switched ? (player_index + 1) % 2 : player_index;
    };
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
    };
    proto.put_value_in_range = function (value, range) {
        if (value < range.min)
            return range.min;
        if (value > range.max)
            return range.max;
        return value;
    };
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
    proto.location_to_index = function (location) {
        let x = location[0];
        let y = location[1];
        return this.location_to_index_map[this.spez(x, y)];
    };
    proto.calculate_final_index = function (index, group_index) {
        return index * this.config.group_size + group_index;
    };
    proto.set_value = function (array, index, group_index, value) {
        let final_index = this.calculate_final_index(index, group_index);
        array[final_index] = value;
    };
    proto.set_if_less = function (array, index, group_index, value) {
        let final_index = this.calculate_final_index(index, group_index);
        let current_value = array[final_index];
        array[final_index] = current_value ? Math.min(current_value, value) : value;
    };
    proto.add_one = function (array, index, group_index) {
        let final_index = this.calculate_final_index(index, group_index);
        array[final_index]++;
    };
    proto.calculate_array_size = function () {
        const size = this.config.arena_settings.size;
        return (size * size / 2 + size) * this.config.group_size;
    };
    proto.create_new_array = function () {
        return new Int8Array(this.array_size);
    };
    proto.parse_file_to_raw_array = function (file) {
        return file.split("\n")
            .filter(el => el)
            .map(el => JSON.parse(el));
    };
    proto.parse_objects_to_arrays = function (objects) {
        return objects.map(o => this.config.parse_frame_data_to_flat_array(this, o));
    };


    proto.update_changes = function (i_previous, i_current, data, images, switched) {
        const updater = this.config.update_function;

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
                let current_element = images[switched_index];
                let value = data_current[i];
                let group = i % this.config.group_size;

                updater(group, switched_index, current_element, value);
            }
        }
    };
    proto.calculate_switched_index = function (index, switched) {
        if (!switched) return index;

        const switched_index = this.array_size - index - 1;
        let final_index = switched_index - 2 * (switched_index % this.config.group_size) + this.config.group_size - 1;

        return this.config.additional_flipping(this, final_index);
    };
    proto.toggle_hidden = function (elements) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].hidden = !elements[i].hidden;
        }
    };
    proto.switch_view = function (i_current, data, images, switched) {
        this.update_changes(i_current, 0, data, images, switched);
        this.update_changes(0, i_current, data, images, !switched);
    };


    if (typeof process !== 'undefined') {
        module.exports = match_utils;
    } else {
        if (!global.match_utils) {
            global.match_utils = new match_utils();
        }
    }
}(window);
