+function (global) {
    //General
    const quantity_label = '<label class="quantity"></label>';
    const highlight_svg = '<img class="highlight" src="images/Highlight.svg"></img>';
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

    //DummyItem
    const dummy_div = '<div class="dummy"></div>';

    const match_utils_config = {

        field_contents: [
            empty_field_img +
            filter1_img +
            encryptor1_img +
            destructor1_img +
            ping1_img +
            emp1_img +
            scrambler1_img +
            ping2_img +
            emp2_img +
            scrambler2_img +
            damage_bar_svg +
            highlight_svg +
            remove_img +
            upgrade_img +
            quantity_label +
            dummy_div +
            dummy_div
            ,

            empty_field_img +
            filter2_img +
            encryptor2_img +
            destructor2_img +
            ping1_img +
            emp1_img +
            scrambler1_img +
            ping2_img +
            emp2_img +
            scrambler2_img +
            damage_bar_svg +
            highlight_svg +
            remove_img +
            upgrade_img +
            quantity_label +
            dummy_div +
            dummy_div
        ],

        arena_settings: {
            size: 28,
            half: 14
        },

        group_size: 15,

        //TO be replaced with terminal-config
        full_health: {
            0: [60, 120],
            1: [30, 30],
            2: [75, 75],
            3: [15, 15],
            4: [5, 5],
            5: [40, 40],
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