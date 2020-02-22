
function generate_default_td_contents(src_options) {
    let content = '<label class="quantity"></label>';
    for (var i = 0; i < src_options.length; i++) {
        content += `<img src="${src_options[i]}">`;
    }
    return content;
}

function generate_settings(size) {
    return {
        size,
        half_size: size / 2,
    };
}

function is_in_arena_bounds(x, y, settings) {
    return Math.abs(x - settings.half_size + .5) + Math.abs(y - settings.half_size + .5) < (settings.half_size + 1);
}

function generate_terminal_trs(settings, td_content) {
    let trs = '';
    for (var y = 0; y < settings.size; y++) {
        trs += '<tr>';
        for (var x = 0; x < settings.size; x++) {
            trs += '<td>';
            if (is_in_arena_bounds(x, y, settings)) {
                trs += td_content;
            }
            trs += '</td>';
        }
        trs += '</tr>';
    }
    return trs;
}

module.exports = {
    generate_default_td_contents,
    generate_settings,
    is_in_arena_bounds,
    generate_terminal_trs
};