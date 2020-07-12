class MatchUtils {
    constructor(json_config, functions, terminal_config) {
        this.set_configs(json_config, functions, terminal_config);
        this.init();
    }
    set_configs(json_config, functions, terminal_config) {
        this.set_config(json_config, functions);
        this.terminal_config = terminal_config;
    }
    set_config(json_config, functions) {
        this.config = {};
        Object.assign(this.config, json_config || {});
        Object.assign(this.config, functions || {});
    }
    init() {
        if (typeof(this.config.arena_settings) != "undefined") {
            this.location_to_index_map = this.generate_location_to_index_map();
            this.array_size = this.calculate_array_size();
        }
    }
    flip_player_if_switched(player_index, switched) {
        return switched ? (player_index + 1) % 2 : player_index;
    }
    is_in_arena_bounds(x, y) {
        const half = this.config.arena_settings.half;

        return Math.abs(x - half + .5) + Math.abs(y - half + .5) < (half + 1);
    }
    generate_terminal_trs() {
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
    }
    get_all_changeable_elements_flat(table) {
        let converter = this.config.td_to_elements_converter;
        return [...table.getElementsByTagName('td')]
            .reduce((a, v) => [...a, ...converter(v)], []);
    }
    put_value_in_range(value, range) {
        if (value < range.min)
            return range.min;
        if (value > range.max)
            return range.max;
        return value;
    }
    spez(x, y) {
        const settings = this.config.arena_settings;
        return x + y * settings.size;
    }
    generate_location_to_index_map() {
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
    }
    location_to_index(location) {
        let x = location[0];
        let y = location[1];
        return this.location_to_index_map[this.spez(x, y)];
    }
    calculate_final_index(index, group_index) {
        return index * this.config.group_size + group_index;
    }
    set_value(array, index, group_index, value) {
        let final_index = this.calculate_final_index(index, group_index);
        array[final_index] = value;
    }
    set_min(array, index, group_index, value) {
        let final_index = this.calculate_final_index(index, group_index);
        let current_value = array[final_index];
        array[final_index] = current_value ? Math.min(current_value, value) : value;
    }
    add_one(array, index, group_index) {
        let final_index = this.calculate_final_index(index, group_index);
        array[final_index]++;
    }
    calculate_array_size() {
        const size = this.config.arena_settings.size;
        return (size * size / 2 + size) * this.config.group_size;
    }
    create_new_array() {
        return new Int8Array(this.array_size);
    }
    parse_file_to_raw_array(file) {
        return file.split("\n")
            .filter(el => el)
            .map(el => JSON.parse(el));
    }
    parse_objects_to_arrays(objects) {
        return objects.map(o => this.parse_single_object_to_array(o));
    }
    parse_single_object_to_array(object) {
        return this.config.parse_frame_data_to_flat_array(this, object);
    }
    calculate_switched_index(index, switched) {
        if (!switched)
            return index;

        const switched_index = this.array_size - index - 1;
        let final_index = switched_index - 2 * (switched_index % this.config.group_size) + this.config.group_size - 1;

        return this.config.additional_flipping(this, final_index);
    }
    toggle_hidden(elements) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].hidden = !elements[i].hidden;
        }
    }
    update_changes(i_previous, i_current, data, images, switched) {
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
    }
    update_changes_better(data_previous, data_current, images, switched) {
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
    }
    switch_view(i_current, data, images, switched) {
        this.update_changes(i_current, 0, data, images, switched);
        this.update_changes(0, i_current, data, images, !switched);
    }
    get_custome_value_at(location, switched, group, current_frame_data) {
        let index = this.location_to_index(location);
        let final_index = this.calculate_final_index(index, group);
        let switched_index = this.calculate_switched_index(final_index, switched);
        return current_frame_data[switched_index];
    }
    get_locations_in_range(location, range) {
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
}


if (typeof process !== 'undefined')
    module.exports = MatchUtils;