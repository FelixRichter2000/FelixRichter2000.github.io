+function (global) {
    let match_utils = {
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

    if (!global.match_utils) {
        global.match_utils = match_utils;
    }
}(window);

try {
    module.exports = window.match_utils;
} catch{ }
