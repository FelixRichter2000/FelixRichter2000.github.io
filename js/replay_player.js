(function () {

    //public viewer methods
    let viewer = {
        next_frame: function () {
            load_frame(frame + 1);
        },
        previous_frame: function () {
            load_frame(frame - 1);
        },
        go_to_next_turn: function () {
            load_frame(frame + 8);
        },
        go_to_previous_turn: function () {
            load_frame(frame - 8);
        },
        on_replay_changed: function () {
            //$match_id_label.html(reader.get_match_id());
            //$replay_range.attr('max', reader.get_max_frame() - 1);
            //$replay_range.val(0);
            //turn = 0;
            //frame = 0;
            //resetReplayTable();
            //load_frame(0);
            //viewer.start_play();
            //max_frame = reader.get_max_frame();
        },
        on_user_data_loaded: function () {
            //user_data = reader.get_user_data();

            ////Check whether flip is necessary
            //flipp = selected_user === user_data[0][1];

            //for (let i = 0; i < constant_stat_names.length; i++) {
            //    let elements = $('[name=' + constant_stat_names[i] + ']');
            //    for (var j = 0; j < elements.length; j++) {
            //        let element = elements[j];
            //        element.innerHTML = user_data[i][flipp ? (j + 1) % 2 : j];
            //    }
            //}
        },
        toggle_play: function () {
            //$playButton.toggleClass("paused");
            if (play) {
                viewer.stop_play();
            }
            else {
                viewer.start_play();
            }
        },
        start_play: function () {
            play = true;
            //$playButton.addClass("paused");
        },
        stop_play: function () {
            play = false;
            //$playButton.removeClass("paused");
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
        }
    };


    //Variables
    let turn = 0;
    let frame = 0;
    let max_frame = 0;
    let play = true;
    let timer = null;
    let flipp = false;
    let current_fps = 12;
    let first_time = true;

    //Get match id from query
    let urlParams = new URLSearchParams(window.location.search);
    let match_id = urlParams.get('id') || 5979377;

    //Create replay reader
    let reader = new ReplayReader(match_id);

    //Init table
    const watch_table = document.getElementById('watch_table');
    watch_table.innerHTML = match_utils.create_viewer();

    //Init references to images
    const viewer_elements = match_utils.get_images_one_dimensional(watch_table);
    const viewer_elements_length = viewer_elements.length;

    //Set all to hidden
    for (var i = 0; i < viewer_elements_length; i++) {
        viewer_elements[i].hidden = true;
    }

    //Jquery
    //let $match_id_label = $('#match_id_label');
    //let $replay_table = $('#match_table');
    //let $replay_range = $('#match_range');
    //let $watch_on_terminal = $('#watch_on_terminal');
    //let $playButton = $(".togglePlay");
    //let $skip_foreward_button = $("#skip_foreward");
    //let $skip_backward_button = $("#skip_backward");
    //let $one_foreward_button = $("#one_foreward");
    //let $one_backward_button = $("#one_backward");
    //let $fps_input = $("#FPS");

    //Player stats
    //let constant_stat_names = ["User", "Algo"];
    //let stat_names = ["Health", "Cores", "Bits", "Milliseconds"];
    //let turn_labels = ["Turn", "Frame"];

    //Set initial speed
    viewer.set_match_speed(12); // TODO: replace 12 with settings default value

    //Init Play/Pause Button
    //$playButton.toggleClass("paused");

    //$playButton.click(function () {
    //    viewer.toggle_play();
    //});

    //Init Slider input events
    //$replay_range.on('input', function () {
    //    load_frame(parseInt(this.value));
    //});

    //$fps_input.on('change', function () {
    //    let val = parseInt(this.value);
    //    if (val) {
    //        set_match_speed(val);
    //    }
    //});

    // Navigate button handlers
    //$skip_foreward_button.on('click', () => viewer.go_to_next_turn());
    //$skip_backward_button.on('click', () => viewer.go_to_previous_turn());
    //$one_foreward_button.on('click', () => viewer.next_frame());
    //$one_backward_button.on('click', () => viewer.previous_frame());




    //Private methods
    function tick() {
        if (!play) return;

        if (frame >= reader.fast_frame_data.length) {
            viewer.stop_play();
            return;
        }

        update_to_next_frame();
    }
    function resetReplayTable() {
        //$replay_images.attr('src', emptyImage);
        //$replay_labels.html('');
    }
    //function set_img(location, path) {
    //    let x = location[0];
    //    let y = location[1];

    //    if (flipp) {
    //        y = 27 - y;
    //        x = 27 - x;
    //    }

    //    let td = $replay_tds[(27 - y) * 28 + x];
    //    let img = $(td).find('img')[0];
    //    img.src = path;
    //}
    //function set_amont(location, amount) {
    //    let x = location[0];
    //    let y = location[1];

    //    if (flipp) {
    //        y = 27 - y;
    //        x = 27 - x;
    //    }

    //    let td = $replay_tds[(27 - y) * 28 + x];

    //    let label = $(td).find('label')[0];
    //    label.innerHTML = amount;
    //}
    //function flip_player_if_necessary(player) {
    //    return flipp ? (player + 1) % 2 : player;
    //}
    //function get_image(player, type) {
    //    player = flip_player_if_necessary(player);
    //    return playerImages[player][type];
    //}

    ////visual stat updater
    function update_all_visual_stats() {
        //update_replay_range_slider();
        //update_player_stats();
        //update_turn_stats();
    }
    function update_replay_range_slider() {
        //$replay_range.val(frame);
    }
    function update_player_stats() {
        //state_data = reader.get_user_state_data(frame - 1);

        //for (var i = 0; i < stat_names.length; i++) {
        //    let elements = $('[name=' + stat_names[i] + ']');
        //    for (var j = 0; j < elements.length; j++) {
        //        let element = elements[j];
        //        element.innerHTML = state_data[i][flipp ? (j + 1) % 2 : j];
        //    }
        //}
    }
    function update_turn_stats() {
        //state_data = reader.get_user_state_data(frame - 1);

        //let data = [reader.get_turn(frame), frame];

        //for (var i = 0; i < turn_labels.length; i++) {
        //    let elements = $('[name=' + turn_labels[i] + ']');
        //    for (var j = 0; j < elements.length; j++) {
        //        let element = elements[j];
        //        element.innerHTML = data[i];
        //    }
        //}
    }

    function show_turns_first_frame() {
        //let info = reader.get_turn_info_for(frame);

        //let units = [info.p1Units, info.p2Units];

        //for (let playerIndex = 0; playerIndex < units.length; playerIndex++) {
        //    let playerUnits = units[playerIndex];
        //    let images = playerImages[flipp ? (playerIndex + 1) % 2 : playerIndex];

        //    for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        //        let currentUnits = playerUnits[imageIndex];
        //        let currentImage = images[imageIndex];

        //        let dict = {};

        //        for (let unit in currentUnits) {
        //            unit = currentUnits[unit];

        //            let x = parseInt(unit[0]);
        //            let y = parseInt(unit[1]);

        //            let loc = [x, y];

        //            set_img(loc, currentImage);
        //        }
        //    }
        //}

        //update_all_visual_stats();
    }
    function update_to_next_frame() {
        //Check if data is already there and in range
        if (reader.raw_frame_data.length == 0
            || frame >= reader.raw_frame_data.length) {
            viewer.stop_play();
            return;
        }

        load_frame(frame + 1);
    }
    function load_frame(new_frame) {
        new_frame = match_utils.put_value_in_range(new_frame, { min: 0, max: reader.count - 1 });
        if (frame == new_frame) return;

        match_utils.update_changes(frame, new_frame, reader.fast_frame_data, viewer_elements);
        frame = new_frame;
    }



    // Keyboard Control Config
    let callbacks = [
        {
            code: "ArrowRight",
            ctrlKey: false,
            shiftKey: false,
            callback: viewer.next_frame,
        },
        {
            code: "ArrowLeft",
            ctrlKey: false,
            shiftKey: false,
            callback: viewer.previous_frame,
        },
        {
            code: "ArrowRight",
            ctrlKey: true,
            shiftKey: false,
            callback: viewer.go_to_next_turn,
        },
        {
            code: "ArrowLeft",
            ctrlKey: true,
            shiftKey: false,
            callback: viewer.go_to_previous_turn,
        },
        {
            code: "ArrowUp",
            ctrlKey: false,
            shiftKey: false,
            callback: viewer.faster_playback,
        },
        {
            code: "ArrowDown",
            ctrlKey: false,
            shiftKey: false,
            callback: viewer.slower_playback,
        },
        {
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            callback: viewer.toggle_play,
        }
    ];

    register_key_controls(callbacks);


    if (!window.viewer) {
        window.viewer = viewer;
    }
})();