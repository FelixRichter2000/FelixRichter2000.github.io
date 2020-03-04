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

        default_img: "images/EmptyField.svg"
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
        array[final_index] += value;
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

    mu.parse_replay_row_to_array = (row, settings) => {
        let frame_data_array = mu.create_new_array(settings);
        let map = mu.generate_location_to_index_map(settings);

        let parsed = JSON.parse(row);

        let grouped = [parsed.p1Units[0], parsed.p2Units[0]];

        for (let group_index in grouped) {
            for (let location of grouped[group_index]) {
                let index = mu.location_to_index(location, map, settings);
                mu.set_value(frame_data_array, index, group_index, 1, settings);
            }
        }

        return grouped;
    };



    if (!global.match_utils) {
        global.match_utils = mu;
    }
}(window);

try {
    module.exports = window.match_utils;
} catch{ }
