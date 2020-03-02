+function (global) {
    const config = {

        firewalls: [
            ["images/Filter1.svg", "images/Encryptor1.svg", "images/Destructor1.svg"],
            ["images/Filter2.svg", "images/Encryptor2.svg", "images/Destructor2.svg"],
        ],

        information: [
            "images/Ping1.svg", "images/Emp1.svg", "images/Scrambler1.svg",
            "images/Ping2.svg", "images/Emp2.svg", "images/Scrambler2.svg",
        ],

        sources: ["images/Filter1.svg", "images/Encryptor1.svg", "images/Destructor1.svg",
            "images/Ping1.svg", "images/Emp1.svg", "images/Scrambler1.svg",
            "images/Ping2.svg", "images/Emp2.svg", "images/Scrambler2.svg",
            "images/Remove1.svg"],

        default_img: "images/EmptyField.svg"
    }

    let match_utils = {

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

        generate_settings: (size) => {
            return {
                size,
                half_size: size / 2,
            };
        },

        is_in_arena_bounds: (x, y, settings) => {
            return Math.abs(x - settings.half_size + .5) + Math.abs(y - settings.half_size + .5) < (settings.half_size + 1);
        },
    };

    match_utils.generate_terminal_trs_v2 = (settings, p1_td_content, p2_td_content) => {
        let trs = '';
        for (var y = 0; y < settings.size; y++) {
            trs += '<tr>';
            for (var x = 0; x < settings.size; x++) {
                trs += '<td>';
                if (match_utils.is_in_arena_bounds(x, y, settings)) {
                    trs += y >= settings.half_size ? p1_td_content : p2_td_content;
                }
                trs += '</td>';
            }
            trs += '</tr>';
        }
        return trs;
    };

    match_utils.generate_terminal_trs = (settings, td_content) => {
        let trs = '';
        for (var y = 0; y < settings.size; y++) {
            trs += '<tr>';
            for (var x = 0; x < settings.size; x++) {
                trs += '<td>';
                if (match_utils.is_in_arena_bounds(x, y, settings)) {
                    trs += td_content;
                }
                trs += '</td>';
            }
            trs += '</tr>';
        }
        return trs;
    };

    match_utils.create_viewer = function () {
        let td_content_p1 = match_utils.generate_default_td_contents_v2(config.default_img, [...config.firewalls[0], ...config.information]);
        let td_content_p2 = match_utils.generate_default_td_contents_v2(config.default_img, [...config.firewalls[1], ...config.information]);
        let settings = match_utils.generate_settings(28);
        let trs = match_utils.generate_terminal_trs_v2(settings, td_content_p1, td_content_p2);
        return trs;
    }

    match_utils.get_images = function (table) {
        //Init references to images
        const tds = table.getElementsByTagName('td');
        const images = [];
        for (let td of tds) {
            images.push(td.getElementsByClassName('match-changing-img'));
        }
        return images;
    }

    match_utils.put_value_in_range = function (value, range) {
        if (value < range.min) {
            return range.min;
        }
        if (value > range.max) {
            return range.max;
        }
        return value;
    }

    if (!global.match_utils) {
        global.match_utils = match_utils;
    }
}(window);

try {
    module.exports = window.match_utils;
} catch{ }
