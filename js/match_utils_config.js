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

    const match_utils_config = {

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

        //TO be replaced with terminal-config
        full_health: {
            0: [60, 120],
            1: [30, 30],
            2: [75, 75],
        },
    }

    if (typeof process !== 'undefined') {
        module.exports = match_utils_config;
    } else {
        if (!global.match_utils_config) {
            global.match_utils_config = match_utils_config;
        }
    }
}(window);