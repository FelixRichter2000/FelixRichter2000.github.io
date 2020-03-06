+function (global) {
    const config = {

        firewalls: [
            ["images/Filter1.svg", "images/Encryptor1.svg", "images/Destructor1.svg"],
            ["images/Filter2.svg", "images/Encryptor2.svg", "images/Destructor2.svg"],
        ],

        information: [
            "images/Ping1.svg", "images/Emp1.svg", "images/Scrambler1.svg",
            "images/Ping2.svg", "images/Emp2.svg", "images/Scrambler2.svg",
            "images/Remove1.svg",
        ],

        sources: ["images/Filter1.svg", "images/Encryptor1.svg", "images/Destructor1.svg",
            "images/Ping1.svg", "images/Emp1.svg", "images/Scrambler1.svg",
            "images/Ping2.svg", "images/Emp2.svg", "images/Scrambler2.svg",
            "images/Remove1.svg"],

        default_img: "images/EmptyField.svg",

        arena_size: 28,
    }

    let mu = {

        generate_default_td_contents_v2: (default_src, src_options) => {

            let content = '<label class="quantity"></label>';
            content += `<img class="match-default-img" src="${default_src}">`;

            for (var i = 0; i < src_options.length; i++) {
                content += `<img class="match-changing-img" src="${src_options[i]}">`;
            }
            return content;
        },

        generate_default_td_contents: (src_options) => {
            let content = '<label class="quantity"></label>';
            for (var i = 0; i < src_options.length; i++) {
                content += `<img src="${src_options[i]}">`;
            }
            return content;
        },

        generate_settings: (size, image_count = 12) => {
            return {
                size,
                half_size: size / 2,
                image_count: image_count,
            };
        },

        is_in_arena_bounds: (x, y, settings) => {
            return Math.abs(x - settings.half_size + .5) + Math.abs(y - settings.half_size + .5) < (settings.half_size + 1);
        },
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
        let settings = mu.generate_settings(28);
        let trs = mu.generate_terminal_trs_v2(settings, td_content_p1, td_content_p2);
        return trs;
    }

    mu.get_images = function (table) {
        //Init references to images
        const tds = table.getElementsByTagName('td');
        const images = [];
        for (let td of tds) {
            images.push(td.getElementsByClassName('match-changing-img'));
        }
        return images;
    }

    mu.get_images_one_dimensional = function (table) {
        //Init references to images
        const tds = table.getElementsByTagName('td');
        let images = [];
        for (let td of tds) {
            images = [...images, ...td.getElementsByClassName('match-changing-img')];
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
        let parsed = JSON.parse(row);

        return [
            ...mu.combine_firewalls(parsed.p1Units, parsed.p2Units),
            ...parsed.p1Units.slice(3, 6),
            ...parsed.p2Units.slice(3, 6),
            ...mu.combine_removals_and_upgrades(parsed.p1Units, parsed.p2Units),
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

    mu.parse_complete_file = (file) => {
        let rows = file.split("\n").slice(3, -1);
        let data = [];

        for (let row of rows) {
            data.push(match_utils.parse_replay_row_to_array(row));
        }
        return data;
    }

    mu.update_changes = (i1, i2, data, images) => {
        const data_i1 = data[i1];
        const data_i2 = data[i2];
        const data_length = data_i1.length;
        for (var i = 0; i < data_length; i++) {
            if (data_i1[i] != data_i2[i]) {
                images[i].hidden = data_i2[i] == 0;
            }
        }
    }



    if (!global.match_utils) {
        global.match_utils = mu;
    }
}(window);

try {
    module.exports = window.match_utils;
} catch{ }
