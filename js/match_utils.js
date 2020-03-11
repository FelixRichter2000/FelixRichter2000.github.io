+function (global) {
    const config = {

        firewalls: [
            ["images/Filter1.svg", "images/Encryptor1.svg", "images/Destructor1.svg"],
            ["images/Filter2.svg", "images/Encryptor2.svg", "images/Destructor2.svg"],
        ],

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

        arena_size: 28,

        group_size: 12,
    }

    let mu = {};

    mu.generate_default_td_contents_v2 = (default_src, src_options) => {

        let content = '<label class="quantity"></label>';
        content += `<img class="match-default-img" src="${default_src}">`;

        for (var i = 0; i < src_options.length; i++) {
            content += `<img class="match-changing-img" src="${src_options[i]}">`;
        }
        return content;
    };

    mu.generate_default_td_contents = (src_options) => {
        let content = '<label class="quantity"></label>';
        for (var i = 0; i < src_options.length; i++) {
            content += `<img src="${src_options[i]}">`;
        }
        return content;
    };

    mu.generate_settings = (size, image_count = 12) => {
        return {
            size,
            half_size: size / 2,
            image_count: image_count,
        };
    };

    mu.is_in_arena_bounds = (x, y, settings) => {
        return Math.abs(x - settings.half_size + .5) + Math.abs(y - settings.half_size + .5) < (settings.half_size + 1);
    };

    mu.generate_terminal_trs_v2 = (settings, p1_td_content, p2_td_content) => {
        let trs = '';
        for (var y = 0; y < settings.size; y++) {
            trs += '<tr>';
            for (var x = 0; x < settings.size; x++) {
                trs += '<td>';
                if (mu.is_in_arena_bounds(x, y, settings)) {
                    trs += y >= settings.half_size ? p1_td_content : p2_td_content;
                }
                trs += '</td>';
            }
            trs += '</tr>';
        }
        return trs;
    };

    mu.generate_terminal_trs = (settings, td_content) => {
        let trs = '';
        for (var y = 0; y < settings.size; y++) {
            trs += '<tr>';
            for (var x = 0; x < settings.size; x++) {
                trs += '<td>';
                if (mu.is_in_arena_bounds(x, y, settings)) {
                    trs += td_content;
                }
                trs += '</td>';
            }
            trs += '</tr>';
        }
        return trs;
    };

    mu.create_viewer = function () {
        let td_content_p1 = mu.generate_default_td_contents_v2(config.default_img, [...config.firewalls[0], ...config.information]);
        let td_content_p2 = mu.generate_default_td_contents_v2(config.default_img, [...config.firewalls[1], ...config.information]);
        let settings = mu.generate_settings(config.arena_size);
        let trs = mu.generate_terminal_trs_v2(settings, td_content_p1, td_content_p2);
        return trs;
    }

    mu.get_images = function (table) {
        const tds = table.getElementsByTagName('td');
        const images = [];
        for (let td of tds) {
            images.push(td.getElementsByClassName('match-changing-img'));
        }
        return images;
    }

    mu.get_images_one_dimensional = function (table) {
        const tds = table.getElementsByTagName('td');
        let images = [];
        for (let td of tds) {
            let ims = td.getElementsByClassName('match-changing-img');
            if (ims.length > 0) {
                let quantity_label = td.getElementsByClassName('quantity');
                images = [...images, ...ims, ...quantity_label];
            }
        }
        return images;
    }

    mu.put_value_in_range = function (value, range) {
        if (value < range.min) {
            return range.min;
        }
        if (value > range.max) {
            return range.max;
        }
        return value;
    }


    mu.spez = (x, y, settings) => {
        return x + y * settings.size;
    };

    mu.generate_location_to_index_map = (settings) => {
        let counter = 0;
        let map = {};
        for (var y = settings.size - 1; y >= 0; y--) {
            for (var x = 0; x < settings.size; x++) {
                if (mu.is_in_arena_bounds(x, y, settings)) {
                    map[mu.spez(x, y, settings)] = counter;
                    counter++;
                }
            }
        }
        return map;
    };

    mu.location_to_index = (location, map, settings) => {
        let x = location[0];
        let y = location[1];
        let spez_location = mu.spez(x, y, settings);
        return map[spez_location];
    };

    mu.calculate_final_index = (index, group_index, settings) => {
        return index * settings.image_count + group_index;
    }

    mu.set_value = (array, index, group_index, value, settings) => {
        let final_index = mu.calculate_final_index(index, group_index, settings);
        array[final_index] = value;
    };

    mu.add_one = (array, index, group_index, settings) => {
        let final_index = mu.calculate_final_index(index, group_index, settings);
        array[final_index]++;
    };

    mu.calculate_array_size = (settings) => {
        return (settings.size * settings.size / 2 + settings.size) * settings.image_count;
    }

    mu.create_new_array = (settings) => {
        let size = mu.calculate_array_size(settings);
        return new Int8Array(size);
    }

    mu.combine_firewalls = (p1Units, p2Units) => {
        return p1Units.slice(0, 3).map(function (p1U, i) {
            return [...p1U, ...p2Units[i]];
        });
    };

    mu.combine_removals_and_upgrades = (p1Units, p2Units) => {
        return p1Units.slice(6, 8).map(function (p1U, i) {
            return [...p1U, ...p2Units[i + 6]];
        });
    };

    mu.parse_row_to_single_array = (row) => {
        return [
            ...mu.combine_firewalls(row.p1Units, row.p2Units),
            ...row.p1Units.slice(3, 6),
            ...row.p2Units.slice(3, 6),
            ...mu.combine_removals_and_upgrades(row.p1Units, row.p2Units),
        ];
    };

    mu.parse_replay_row_to_array = (row, settings) => {
        settings = settings || mu.generate_settings(config.arena_size);
        let frame_data_array = mu.create_new_array(settings);
        let map = mu.generate_location_to_index_map(settings);

        let all_data = mu.parse_row_to_single_array(row);

        for (let group_index = 0; group_index < all_data.length; group_index++) {
            for (let location of all_data[group_index]) {
                let index = mu.location_to_index(location, map, settings);
                mu.set_value(frame_data_array, index, group_index, 1, settings);

                if (group_index >= 3 && group_index <= 8) {
                    mu.add_one(frame_data_array, index, settings.image_count - 1, settings);
                }
            }
        }

        return frame_data_array;
    };

    mu.parse_file_to_raw_array = (file) => {
        let data = [];
        let rows = file.split("\n").slice(3, -1);
        for (let row of rows)
            data.push(JSON.parse(row));
        return data;
    }

    mu.parse_complete_file = (rows) => {
        let data = [];
        for (let row of rows)
            data.push(mu.parse_replay_row_to_array(row));
        return data;
    }

    mu.update_changes = (i_previous, i_current, data, images, switched) => {
        const data_previous = data[i_previous];
        const data_current = data[i_current];

        if (!data_previous) return;
        if (!data_current) return;

        const data_length = data_previous.length;
        const images_length = images.length;

        if (i_current >= data_length) return;

        for (let i = 0; i < data_length; i++) {
            if (i_previous == -1 && data_current[i] > 0 || data_previous[i] != data_current[i]) {

                const switched_index = mu.calculate_switched_index(i, switched, images_length);
                let current_image = images[switched_index];

                if (current_image.tagName === 'LABEL') {
                    current_image.innerHTML = data_current[i];
                }
                current_image.hidden = data_current[i] == 0;
            }
        }
    }

    mu.calculate_switched_index = (index, switched, total_length) => {
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
        let final_index = switched_index - 2 * (switched_index % config.group_size) + config.group_size - 1;

        //without ending
        const ending = final_index % config.group_size;

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

    mu.toggle_hidden = (elements) => {
        for (var i = 0; i < elements.length; i++) {
            elements[i].hidden = !elements[i].hidden;
        }
    }

    mu.switch_view = (i_current, data, images, switched) => {
        mu.update_changes(i_current, 0, data, images, switched);
        mu.update_changes(0, i_current, data, images, !switched);
    }



    if (!global.match_utils) {
        global.match_utils = mu;
    }
}(window);

try {
    module.exports = window.match_utils;
} catch{ }
