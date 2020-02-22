// JavaScript source code
function generate_default_td_contents(src_options) {
    let content = '<label class="quantity">';
    for (var i = 0; i < src_options.length; i++) {
        content += `<img src="${src_options[i]}">`;
    }
    return content;
}

module.exports = {
    generate_default_td_contents
};