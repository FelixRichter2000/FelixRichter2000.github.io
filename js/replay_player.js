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
            load_frame(reader.get_next_turn(frame));
        },
        go_to_previous_turn: function () {
            load_frame(reader.get_previous_turn(frame));
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
        },
        get_reader: function () {
            return reader;
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
    let healths = document.getElementsByName('health');
    let cores = document.getElementsByName('core');
    let bits = document.getElementsByName('bit');


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
        if (first_time && reader.is_ready()) {
            first_time = false;

            update_static_stats();
        }

        if (!play) return;

        update_to_next_frame();
    }

    ////visual stat updater
    function update_all_visual_stats() {
        //update_replay_range_slider();
        //update_player_stats();
        //update_turn_stats();
    }
    function update_replay_range_slider() {
        //$replay_range.val(frame);
    }
    function update_static_stats() {
        let players = document.getElementsByName('player');
        let algos = document.getElementsByName('algo');
        let data = reader.user_data;
        for (var i = 0; i < data.length; i++) {
            players[i].innerHTML = data[i].user;
            algos[i].innerHTML = data[i].name;
        }
    }
    function update_turn_stats() {
        let healths = document.getElementsByName('health');
        let cores = document.getElementsByName('core');
        let bits = document.getElementsByName('bit');

        let data = reader.raw_frame_data[frame];
        let combined = [data.p1Stats, data.p2Stats];
        for (var i = 0; i < combined.length; i++) {
            healths[i].innerHTML = combined[i][0];
            cores[i].innerHTML = combined[i][1];
            bits[i].innerHTML = combined[i][2];
        }

        //For the health bars
        document.documentElement.style.setProperty('--p1-health', `${Math.max(combined[0][0] / .3, 0)}%`);
        document.documentElement.style.setProperty('--p2-health', `${Math.max(combined[1][0] / .3, 0)}%`);
    }
    function update_to_next_frame() {
        //Check if data is already there and in range
        if (reader.raw_frame_data.length == 0) {
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

        update_turn_stats();
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