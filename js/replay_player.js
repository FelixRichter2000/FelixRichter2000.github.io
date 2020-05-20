(function () {

    //public viewer methods
    let viewer = {
        show_frame: function (frame) {
            load_frame(frame);
            viewer.stop_play();
        },
        next_frame: function () {
            load_frame(frame + 1);
            viewer.stop_play();
        },
        previous_frame: function () {
            load_frame(frame - 1);
            viewer.stop_play();
        },
        next_turn: function () {
            load_frame(reader.get_next_turn(frame));
        },
        previous_turn: function () {
            load_frame(reader.get_previous_turn(frame));
            viewer.stop_play();
        },
        switch_view: function () {
            if (!reader.is_ready()) return;
            match_utils.switch_view(frame, reader.fast_frame_data, viewer_elements, switched);
            switched = !switched;

            update_static_stats();
            update_turn_stats();
            update_hover_info();
        },
        toggle_play: function () {
            match_utils.toggle_hidden(play_button_images);
            play = !play;
        },
        start_play: function () {
            play = true;
        },
        stop_play: function () {
            if (play)
                viewer.toggle_play();
        },
        set_match_speed: function (fps) {
            current_fps = match_utils.put_value_in_range(fps, { min: 4, max: 60 });

            //$fps_input.val(current_fps);

            if (timer)
                clearInterval(timer);
            timer = setInterval(tick, 1000 / current_fps);
        },
        faster_playback: function () {
            viewer.set_match_speed(current_fps + 4 - current_fps % 4);
        },
        slower_playback: function () {
            viewer.set_match_speed(current_fps - 4 - current_fps % 4);
        },
        show_field_info: function (x, y) {
            if (x === hover_x && y === hover_y) return;
            hover_x = x;
            hover_y = y;
            update_hover_info();
        },
        download: function () {
            let filename = `${reader.user_data[switched ? 1 : 0].name}_${reader.user_data[switched ? 0 : 1].name}_${match_id}.replay`;
            let text = reader.get_replay_text(switched);
            download_current_file(filename, text);
        },
        //Temporary
        get_reader: function () {
            return reader;
        },
        watch_on_terminal: function () {
            var win = window.open(`https://terminal.c1games.com/watch/${match_id}`, '_blank');
            win.focus();
        }
    };

    //Match_Utils
    match_utils = new match_utils_ctor(match_utils_config, match_utils_functions);
    match_utils_flat = new match_utils_ctor({
        arena_settings: {
            size: 28,
            half: 14
        },
        group_size: 1,
    }, {
        update_function: function (group, switched_index, current_element, value) {
            current_element.hidden = value == 0;
        },
    });

    //Variables
    let turn = 0;
    let frame = 0;
    let max_frame = 0;
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

    //Create replay reader
    let reader = new ReplayReader(match_id);

    //Init table
    const watch_table = document.getElementById('watch_table');
    watch_table.innerHTML = match_utils.generate_terminal_trs();

    //Init references to images
    const viewer_elements = match_utils.get_all_changeable_elements_flat(watch_table);
    const viewer_elements_length = viewer_elements.length;

    //Set all to hidden
    for (var i = 0; i < viewer_elements_length; i++) {
        viewer_elements[i].hidden = true;
    }

    //Get Highlight elements
    const highlight_elements = document.getElementsByClassName('highlight');

    //Set all to hidden
    for (var i = 0; i < highlight_elements.length; i++) {
        highlight_elements[i].hidden = true;
    }

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
        slide: function (event, ui) {
            viewer.show_frame(ui.value);
        },
    });

    //Set initial speed
    viewer.set_match_speed(12); // TODO: replace 12 with settings default value

    //Private methods
    function tick() {
        if (first_time && reader.is_ready()) {
            first_time = false;

            update_static_stats();

            viewer.toggle_play();
        }

        if (!play) return;

        update_to_next_frame();
    }

    ////visual stat updater
    function update_static_stats() {
        let players = document.getElementsByName('player');
        let algos = document.getElementsByName('algo');
        let data = reader.user_data;
        for (var i = 0; i < data.length; i++) {
            let toggled_index = match_utils.flip_player_if_switched(i, switched);
            players[toggled_index].innerHTML = data[i].user;
            algos[toggled_index].innerHTML = data[i].name;
        }
        document.getElementById('grid_overlay').hidden = false;
        $slider.slider('option', { min: 0, max: reader.fast_frame_data.length - 1 });
    }
    function update_turn_stats() {
        let data = reader.raw_frame_data[frame];
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
        turn_frame_number.innerHTML = reader.get_turn_frame_number(frame);
        $slider.slider('value', frame);
    }
    function update_hover_info() {
        if (!reader.is_ready()) return;

        //Setup empty
        let position_text = "";
        let stability_text = "";
        let new_hover_range_data = match_utils_flat.create_new_array();

        if (match_utils.is_in_arena_bounds(hover_x, hover_y)) {
            position_text = `${hover_x}, ${hover_y}`;

            let location = [hover_x, hover_y];
            let current_frame_data = reader.fast_frame_data[frame];

            let health_left = match_utils.get_custome_value_at(location, switched, 13, current_frame_data);
            let unit_type = match_utils.get_custome_value_at(location, switched, 14, current_frame_data);
            let upgraded = match_utils.get_custome_value_at(location, switched, 10, current_frame_data);

            if (unit_type >= 100) {
                //Set stability text
                stability_text = health_left;

                //Get range
                let range = reader.get_range(unit_type, upgraded);

                //Generate flat array of locations in range
                new_hover_range_data = match_utils_flat.get_locations_in_range(location, range);
            }
        }

        //Update 
        position_span.innerHTML = position_text;
        stability_span.innerHTML = stability_text;
        match_utils_flat.update_changes(0, 1, [hover_range_data, new_hover_range_data], highlight_elements, false);

        //Update hover_range_data
        hover_range_data = new_hover_range_data;
    }
    function update_to_next_frame() {
        //Check if data is already there
        if (reader.raw_frame_data.length == 0) {
            viewer.stop_play();
            return;
        }

        load_frame(frame + 1);
    }
    function load_frame(new_frame) {
        if (!reader.is_ready()) return;

        new_frame = match_utils.put_value_in_range(new_frame, { min: 0, max: reader.count - 1 });
        if (frame == new_frame) return;

        match_utils.update_changes(frame, new_frame, reader.fast_frame_data, viewer_elements, switched);
        frame = new_frame;

        update_turn_stats();
        update_hover_info();

        console.log(`Frame: ${frame}`, reader.raw_frame_data[frame]);
    }
    function download_current_file(filename, text) {
        var el = document.createElement('a');
        el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        el.setAttribute('download', filename);
        el.style.display = 'none';
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    }

    //mouse move listener
    window.addEventListener('mousemove', (e) => {
        let tile_size = Math.min(window.innerWidth, window.innerHeight) / 28;

        const round = (pixel) => Math.round((pixel - tile_size / 2) / tile_size);

        let x = round(e.clientX);
        let y = 27 - round(e.clientY);

        if (typeof viewer != 'undefined')
            viewer.show_field_info(x, y);
    });

    // Keyboard Control Config
    let keybord_controls = [
        {
            code: "ArrowRight",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: viewer.next_frame,
        },
        {
            code: "ArrowLeft",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: viewer.previous_frame,
        },
        {
            code: "ArrowRight",
            ctrlKey: true,
            shiftKey: false,
            altKey: false,
            callback: viewer.next_turn,
        },
        {
            code: "ArrowLeft",
            ctrlKey: true,
            shiftKey: false,
            altKey: false,
            callback: viewer.previous_turn,
        },
        {
            code: "ArrowUp",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: viewer.faster_playback,
        },
        {
            code: "ArrowDown",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: viewer.slower_playback,
        },
        {
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: viewer.toggle_play,
        },
        {
            code: "KeyX",
            ctrlKey: false,
            shiftKey: false,
            altKey: true,
            callback: viewer.switch_view,
        }
    ];

    register_key_controls(keybord_controls);


    if (!window.viewer) {
        window.viewer = viewer;
    }
})();