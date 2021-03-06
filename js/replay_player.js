﻿(function() {

    //public viewer methods
    let viewer = {
        show_frame: function(frame) {
            load_frame(frame);
            viewer.stop_play();
        },
        next_frame: function() {
            load_frame(frame + 1);
            viewer.stop_play();
        },
        previous_frame: function() {
            load_frame(frame - 1);
            viewer.stop_play();
        },
        next_turn: function() {
            load_frame(get_next_turn(frame));
        },
        previous_turn: function() {
            load_frame(get_previous_turn(frame));
            viewer.stop_play();
        },
        switch_view: function() {
            if (!is_ready()) return;

            match_viewer.switch();
            switched = !switched;

            update_static_stats();
            update_turn_stats();
            update_hover_info();
        },
        toggle_play: function() {
            match_utils.toggle_hidden(play_button_images);
            play = !play;
        },
        start_play: function() {
            play = true;
        },
        stop_play: function() {
            if (play)
                viewer.toggle_play();
        },
        set_match_speed: function(fps) {
            current_fps = match_utils.put_value_in_range(fps, { min: 4, max: 60 });

            //$fps_input.val(current_fps);

            if (timer)
                clearInterval(timer);
            timer = setInterval(tick, 1000 / current_fps);
        },
        faster_playback: function() {
            viewer.set_match_speed(current_fps + 4 - current_fps % 4);
        },
        slower_playback: function() {
            viewer.set_match_speed(current_fps - 4 - current_fps % 4);
        },
        show_field_info: function(x, y) {
            if (x === hover_x && y === hover_y) return;
            hover_x = x;
            hover_y = y;
            update_hover_info();
        },
        download: function() {
            let filename = `${user_data_algos[0].name}_${user_data_algos[1].name}_${match_id}.replay`;
            download_text(filename, raw_replay);
        },
        watch_on_terminal: function() {
            var win = window.open(`https://terminal.c1games.com/watch/${match_id}`, '_blank');
            win.focus();
        }
    };

    //Match_Utils
    match_utils = new MatchUtils(match_utils_config, match_utils_functions);
    match_utils_flat = new MatchUtils({
        arena_settings: {
            size: 28,
            half: 14
        },
        group_size: 1,
    }, {
        update_function: function(group, switched_index, current_element, value) {
            current_element.hidden = value == 0;
        },
    });

    //Variables
    let frame = 0;
    let play = true;
    let timer = null;
    let switched = false;
    let current_fps = 12;
    let first_time = true;
    let hover_x = -1;
    let hover_y = -1;

    //Setup hover array
    let hover_range_data = match_utils_flat.create_new_array();

    //Get match id from query
    let urlParams = new URLSearchParams(window.location.search);
    let match_id = urlParams.get('id') || 5979377;

    //ReplayReaderVariables
    let config = null;
    let replay = [];
    let raw_replay = '';
    let user_data_algos = null;

    //TODO: Move ReplayDownloader and UserDataDownloader outside of this file and set the Variables using Methods
    new ReplayDownloader()
        .download(match_id)
        .then((result) => {
            config = result.config;
            replay = result.replay;
            raw_replay = result.raw;
        });
    new UserDataDownloader()
        .download(match_id)
        .then((result) => {
            user_data_algos = result.algos;
        });

    //FieldGenerator
    const watch_table = document.getElementById('watch_table');
    let fieldGenerator = new FieldGenerator(match_utils);
    fieldGenerator.generate(watch_table);
    const viewer_elements = fieldGenerator.get_viewer_elements();
    const highlight_elements = fieldGenerator.get_hover_elements();

    //Create MatchViewer
    let match_viewer = new MatchViewer(match_utils, viewer_elements)

    //Reusable references to html elements
    let healths = document.getElementsByName('health');
    let cores = document.getElementsByName('core');
    let bits = document.getElementsByName('bit');
    let ms = document.getElementsByName('ms');
    let play_button_images = document.getElementsByName('play_button_img');
    let turn_number = document.getElementById('turn_number');
    let frame_number = document.getElementById('frame_number');
    let turn_frame_number = document.getElementById('turn_frame_number');
    let position_span = document.getElementById('position');
    let stability_span = document.getElementById('stability');

    //Init Slider
    var $slider = $('.slider');
    $slider.slider({
        range: "min",
        animate: true,
        value: 0,
        min: 0,
        max: 0,
        step: 1,
        slide: function(event, ui) {
            viewer.show_frame(ui.value);
        },
    });

    //Set initial speed
    viewer.set_match_speed(12); // TODO: replace 12 with settings default value

    //Private methods
    function tick() {
        if (first_time && is_ready()) {
            first_time = false;

            update_static_stats();
        }

        if (!play) return;

        load_frame(frame + 1);
    }

    ////visual stat updater
    function update_static_stats() {
        let players = document.getElementsByName('player');
        let algos = document.getElementsByName('algo');
        for (var i = 0; i < user_data_algos.length; i++) {
            let toggled_index = match_utils.flip_player_if_switched(i, switched);
            if (players.length == 2)
                players[toggled_index].innerHTML = user_data_algos[i].user;
            if (algos.length == 2)
                algos[toggled_index].innerHTML = user_data_algos[i].name;
        }
        document.getElementById('grid_overlay').hidden = false;
        $slider.slider('option', { min: 0, max: replay.length - 1 });
    }

    function update_turn_stats() {
        let data = replay[frame];
        let combined = [data.p1Stats, data.p2Stats];
        for (var i = 0; i < combined.length; i++) {
            let toggled_index = match_utils.flip_player_if_switched(i, switched);

            healths[toggled_index].innerHTML = combined[i][0];
            cores[toggled_index].innerHTML = combined[i][1];
            bits[toggled_index].innerHTML = combined[i][2];
            ms[toggled_index].innerHTML = combined[i][3];

            //For the health bars
            document.documentElement.style.setProperty(`--p${toggled_index + 1}-health`, `${Math.max(combined[i][0] / .3, 0)}%`);
        }

        //Turn & Frame
        turn_number.innerHTML = data.turnInfo[1];
        frame_number.innerHTML = frame;
        turn_frame_number.innerHTML = get_turn_frame_number(frame);
        $slider.slider('value', frame);
    }

    function update_hover_info() {
        if (!is_ready()) return;

        //Setup empty
        let position_text = "";
        let stability_text = "";
        let new_hover_range_data = match_utils_flat.create_new_array();

        if (match_utils.is_in_arena_bounds(hover_x, hover_y)) {
            position_text = `${hover_x}, ${hover_y}`;

            let location = [hover_x, hover_y];

            let health_left = match_viewer.get_value_at(location, 13);
            let unit_type = match_viewer.get_value_at(location, 14);
            let upgraded = match_viewer.get_value_at(location, 10);

            if (unit_type >= 100) {
                //Set stability text
                stability_text = health_left;

                //Get range
                let range = get_range(unit_type, upgraded);

                //Generate flat array of locations in range
                new_hover_range_data = match_utils_flat.get_locations_in_range(location, range);
            }
        }

        //Update 
        position_span.innerHTML = position_text;
        stability_span.innerHTML = stability_text;
        match_utils_flat.update_changes(hover_range_data, new_hover_range_data, highlight_elements, false);

        //Update hover_range_data
        hover_range_data = new_hover_range_data;
    }

    function load_frame(new_frame) {
        if (!is_ready()) return;

        new_frame = match_utils.put_value_in_range(new_frame, { min: 0, max: replay.length - 1 });
        if (frame == new_frame) return;

        let new_state = replay[new_frame];
        match_viewer.update_frame_data(new_state);

        frame = new_frame;

        update_turn_stats();
        update_hover_info();

        //console.log(`Frame: ${frame}`, replay[frame]);
    }

    function get_next_turn(frame) {
        frame++;
        while (frame < replay.length && replay[frame].turnInfo[0] !== 0) {
            frame++;
        }
        return frame + 1;
    }

    function get_previous_turn(frame) {
        frame -= 2;
        while (frame > 0 && replay[frame].turnInfo[0] !== 0) {
            frame--;
        }
        return frame + 1;
    }

    function get_range(unit_type, upgraded) {
        let range = 0;

        if (config) {
            const correct_unit_information = JSON.parse(JSON.stringify(config.unitInformation[unit_type - 100]));

            if (upgraded)
                Object.assign(correct_unit_information, correct_unit_information.upgrade);

            let propertyNames = Object.getOwnPropertyNames(correct_unit_information);
            let range_names = propertyNames.filter(el => el.includes("Range"))

            for (let range_name of range_names)
                range = Math.max(correct_unit_information[range_name], range);
        }

        return range;
    }

    function get_turn_frame_number(frame) {
        return replay[frame].turnInfo[2];
    }

    function is_ready() {
        return replay.length > 0 && user_data_algos;
    }

    if (!window.viewer) {
        window.viewer = viewer;
    }
})();