(function () {
    const DEPLOY_PHASE = 0;
    const ACTION_PHASE = 1;
    const END_GAME = 2;

    var replay_reader = function (match_id) {
        this.init();
        this.set_match_id(match_id);
    }
    let proto = replay_reader.prototype;

    proto.init = function () {
        this.raw_data = [];
        this.data = [];
        this.user_data = [];
    }
    proto.set_match_id = function (match_id) {
        this.match_id = match_id;
        this.load_user_data();
        this.load_data();
    }
    proto.process_match_data = function (data) {
        this.raw_data = match_utils.parse_file_to_raw_array(data);
        this.data = match_utils.parse_complete_file(this.raw_data);
    }
    proto.load_data = function () {
        let self = this;
        $.ajax({
            url: "https://terminal.c1games.com/api/game/replayexpanded/" + this.match_id
        }).done(function (response) {
            self.process_match_data(response);
        });
    }
    proto.load_user_data = function () {
        let self = this;
        $.ajax({
            url: "https://terminal.c1games.com/api/game/match/" + this.match_id + "/algos"
        }).done(function (response) {
            self.process_user_data(response);
        });
    }
    proto.process_user_data = function (response) {
        let data = {
            0: [],
            1: [],
        };

        for (var i = 0; i < 2; i++) {
            let algo_data = response.data.algos[i];
            let user = algo_data.user;
            let algo = algo_data.name;

            data[0].push(user);
            data[1].push(algo);
        }

        this.user_data = data;
    }
    //proto.get_user_state_data = function (frame) {
    //    if (frame < 0)
    //        frame = 0;

    //    let data = {
    //        0: [],
    //        1: [],
    //        2: [],
    //        3: [],
    //    }

    //    let frame_info = this.frame_information[frame];
    //    let p1 = frame_info.p1Stats;
    //    let p2 = frame_info.p2Stats;
    //    for (var i = 0; i < 4; i++) {
    //        data[i].push(p1[i]);
    //        data[i].push(p2[i]);
    //    }

    //    return data;
    //}

    if (!window.ReplayReader) {
        window.ReplayReader = replay_reader;
    }
})();