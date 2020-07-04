+ function(global) {

    let match_utils = function(new_config, new_functions, terminal_config) {
        this.config = {};
        Object.assign(this.config, new_config || {});
        Object.assign(this.config, new_functions || {});

        this.terminal_config = terminal_config;

        //Init
        if (typeof(this.config.arena_settings) != "undefined") {
            this.location_to_index_map = this.generate_location_to_index_map();
            this.array_size = this.calculate_array_size();
        }
    };
    let proto = match_utils.prototype;

    proto.flip_player_if_switched = function(player_index, switched) {
        return switched ? (player_index + 1) % 2 : player_index;
    };
    proto.is_in_arena_bounds = function(x, y) {
        const half = this.config.arena_settings.half;

        return Math.abs(x - half + .5) + Math.abs(y - half + .5) < (half + 1);
    };
    proto.generate_terminal_trs = function() {
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
    proto.get_all_changeable_elements_flat = function(table) {
        let converter = this.config.td_to_elements_converter;
        return [...table.getElementsByTagName('td')]
            .reduce((a, v) => [...a, ...converter(v)], []);
    };
    proto.put_value_in_range = function(value, range) {
        if (value < range.min)
            return range.min;
        if (value > range.max)
            return range.max;
        return value;
    };
    proto.spez = function(x, y) {
        const settings = this.config.arena_settings;
        return x + y * settings.size;
    };
    proto.generate_location_to_index_map = function() {
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
    proto.location_to_index = function(location) {
        let x = location[0];
        let y = location[1];
        return this.location_to_index_map[this.spez(x, y)];
    };
    proto.calculate_final_index = function(index, group_index) {
        return index * this.config.group_size + group_index;
    };
    proto.set_value = function(array, index, group_index, value) {
        let final_index = this.calculate_final_index(index, group_index);
        array[final_index] = value;
    };
    proto.set_min = function(array, index, group_index, value) {
        let final_index = this.calculate_final_index(index, group_index);
        let current_value = array[final_index];
        array[final_index] = current_value ? Math.min(current_value, value) : value;
    };
    proto.add_one = function(array, index, group_index) {
        let final_index = this.calculate_final_index(index, group_index);
        array[final_index]++;
    };
    proto.calculate_array_size = function() {
        const size = this.config.arena_settings.size;
        return (size * size / 2 + size) * this.config.group_size;
    };
    proto.create_new_array = function() {
        return new Int8Array(this.array_size);
    };
    proto.parse_file_to_raw_array = function(file) {
        return file.split("\n")
            .filter(el => el)
            .map(el => JSON.parse(el));
    };
    proto.parse_objects_to_arrays = function(objects) {
        return objects.map(o => this.parse_single_object_to_array(o));
    };
    proto.parse_single_object_to_array = function(object) {
        return this.config.parse_frame_data_to_flat_array(this, object);
    }
    proto.calculate_switched_index = function(index, switched) {
        if (!switched) return index;

        const switched_index = this.array_size - index - 1;
        let final_index = switched_index - 2 * (switched_index % this.config.group_size) + this.config.group_size - 1;

        return this.config.additional_flipping(this, final_index);
    };
    proto.toggle_hidden = function(elements) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].hidden = !elements[i].hidden;
        }
    };
    proto.update_changes = function(i_previous, i_current, data, images, switched) {
        const updater = this.config.update_function;

        const data_previous = data[i_previous];
        const data_current = data[i_current];
        const data_length = data_previous.length;
        const images_length = images.length;

        for (let i = 0; i < data_length; i++) {
            if (data_previous[i] != data_current[i]) {
                const switched_index = this.calculate_switched_index(i, switched, images_length);
                let current_element = images[switched_index];
                let value = data_current[i];
                let group = i % this.config.group_size;

                updater(group, switched_index, current_element, value);
            }
        }
    };
    proto.update_changes_better = function(data_previous, data_current, images, switched) {
        const updater = this.config.update_function;

        const data_length = data_previous.length;
        const images_length = images.length;

        for (let i = 0; i < data_length; i++) {
            if (data_previous[i] != data_current[i]) {
                const switched_index = this.calculate_switched_index(i, switched, images_length);
                let current_element = images[switched_index];
                let value = data_current[i];
                let group = i % this.config.group_size;

                updater(group, switched_index, current_element, value);
            }
        }
    };
    proto.switch_view = function(i_current, data, images, switched) {
        this.update_changes(i_current, 0, data, images, switched);
        this.update_changes(0, i_current, data, images, !switched);
    };
    proto.get_custome_value_at = function(location, switched, group, current_frame_data) {
        let index = this.location_to_index(location);
        let final_index = this.calculate_final_index(index, group);
        let switched_index = this.calculate_switched_index(final_index, switched);
        return current_frame_data[switched_index];
    };
    proto.get_locations_in_range = function(location, range) {
        let array = this.create_new_array();

        const center_x = location[0];
        const center_y = location[1];

        const int_range = parseInt(range);

        for (var y = center_y - int_range; y <= center_y + int_range; y++) {
            for (var x = center_x - int_range; x <= center_x + int_range; x++) {
                if (this.is_in_arena_bounds(x, y)) {
                    if (Math.sqrt((y - center_y) ** 2 + (x - center_x) ** 2) <= range) {
                        this.set_value(array, this.location_to_index([x, y]), 0, 1);
                    }
                }
            }
        }

        return array;
    }

    if (typeof process !== 'undefined') {
        module.exports = match_utils;
    } else {
        if (!global.match_utils_ctor) {
            global.match_utils_ctor = match_utils;
        }
    }
}(window);