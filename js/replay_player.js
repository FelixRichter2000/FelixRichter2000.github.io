(function () {

    //public viewer methods
    let viewer = {
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
        //Temporary
        get_reader: function () {
            return reader;
        },
        watch_on_terminal: function () {
            var win = window.open(`https://terminal.c1games.com/watch/${match_id}`, '_blank');
            win.focus();
        }
    };


    //Variables
    let turn = 0;
    let frame = 0;
    let max_frame = 0;
    let play = true;
    let timer = null;
    let switched = false;
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

    //Reusable references to html elements
    let healths = document.getElementsByName('health');
    let cores = document.getElementsByName('core');
    let bits = document.getElementsByName('bit');
    let play_button_images = document.getElementsByName('play_button_img');
    let turn_number = document.getElementById('turn_number');
    let frame_number = document.getElementById('frame_number');


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
            let toggled_index = match_utils.toggle_player_index(i, switched);
            players[toggled_index].innerHTML = data[i].user;
            algos[toggled_index].innerHTML = data[i].name;
        }
        document.getElementById('grid_overlay').hidden = false;
    }
    function update_turn_stats() {
        let healths = document.getElementsByName('health');
        let cores = document.getElementsByName('core');
        let bits = document.getElementsByName('bit');

        let data = reader.raw_frame_data[frame];
        let combined = [data.p1Stats, data.p2Stats];
        for (var i = 0; i < combined.length; i++) {
            let toggled_index = match_utils.toggle_player_index(i, switched);

            healths[toggled_index].innerHTML = combined[i][0];
            cores[toggled_index].innerHTML = combined[i][1];
            bits[toggled_index].innerHTML = combined[i][2];

            //For the health bars
            document.documentElement.style.setProperty(`--p${toggled_index + 1}-health`, `${Math.max(combined[i][0] / .3, 0)}%`);
        }

        //Turn & Frame
        turn_number.innerHTML = data.turnInfo[1];
        frame_number.innerHTML = frame;
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
    }



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