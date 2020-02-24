(function () {
    let replayManager = function () {
        this.init();
    }
    let proto = replayManager.prototype;

    proto.DEPLOY_PHASE = 0;
    proto.ACTION_PHASE = 1;
    proto.END_GAME = 2;

    proto.init = function () {
        this.frame_information = {};
        this.turn_information = {};
        this.total_frames = -1;
        this.frame_to_turn_frame_info = {};
        this.turn_number_to_first_frame = {};
        this.highest_turn_number = -1;
    }
    proto.set_match_id = function (match_id) {
        this.match = match_id;
        this.load_user_data();
        this.load_data();
    }
    proto.load = function (data) {
        this.init();

        let splittet = data.split("\n").slice(3, -1);

        for (let split of splittet) {
            //parse split
            let parsed = JSON.parse(split);

            let turnInfo = parsed.turnInfo;

            let phase = turnInfo[0]; //0 = Deploy Phase, 1 = Action Phase, 2 = End Game.
            let turn_number = turnInfo[1];
            let action_phase_frame_number = turnInfo[2]; //starts with 0 every action phase, is -1 when a turn frame since not in action phase.

            if (phase === this.DEPLOY_PHASE) {
                this.turn_information[turn_number] = new TurnInformation(parsed);
            }
            else if (phase === this.ACTION_PHASE) {
                this.turn_information[turn_number].add_frame(parsed);
            }

            this.total_frames += 1;

            this.frame_information[this.total_frames] = parsed;
            this.frame_to_turn_frame_info[this.total_frames] = [turn_number, this.turn_information[turn_number].last_frame];

            if (turn_number > this.highest_turn_number) {
                this.highest_turn_number = turn_number;
                this.turn_number_to_first_frame[turn_number] = this.total_frames;
            }

        }

        //Quickfix
        this.frame_to_turn_frame_info[this.total_frames + 1] = this.frame_to_turn_frame_info[this.total_frames];

        window.viewer.on_replay_changed();
    }
    proto.get_next_turn_first_frame = function (frame) {
        let frame_info = this.frame_to_turn_frame_info[frame];
        let turn_number = frame_info[0];

        do {
            turn_number += 1;
            if (turn_number >= this.highest_turn_number)
                return this.turn_number_to_first_frame[this.highest_turn_number];

        } while (!this.turn_information[turn_number].has_action());

        let first_frame = this.turn_number_to_first_frame[turn_number];
        return first_frame;
    }
    proto.get_previous_turn_first_frame = function (frame) {
        let frame_info = this.frame_to_turn_frame_info[frame];
        let turn_number = frame_info[0];
        let turn_frame = frame_info[1];

        if (turn_frame != 2)
            turn_number += 1;

        do {
            turn_number -= 1;
            if (turn_number <= 0) return 0;

        } while (!this.turn_information[turn_number].has_action());

        let first_frame = this.turn_number_to_first_frame[turn_number];
        return first_frame;
    }
    proto.get = function (key) {
        return this.turn_information[key];
    }
    proto.should_flip = function () {

    }
    proto.get_max_frame = function () {
        return this.total_frames;
    }
    proto.get_events_for = function (frame) {
        let frame_info = this.frame_to_turn_frame_info[frame];
        let turn_number = frame_info[0];
        let turn_frame = frame_info[1];

        let events = this.turn_information[turn_number].get_events_for(turn_frame);
        return events;
    }
    proto.get_turn_info_for = function (frame) {
        let frame_info = this.frame_to_turn_frame_info[frame];
        let turn_number = frame_info[0];
        let turn_frame = frame_info[1];

        let frame_zero_units = this.turn_information[turn_number].get_frame_zero_units();
        return frame_zero_units;
    }
    proto.get_turn = function (frame) {
        let frame_info = this.frame_to_turn_frame_info[frame];
        let turn_number = frame_info[0];
        return turn_number;
    }
    proto.get_first_frame_of_turn = function (frame) {
        let frame_info = this.frame_to_turn_frame_info[frame];
        let turn_frame = frame_info[1];
        return frame - turn_frame;
    }
    proto.load_data = function () {
        let self = this;
        $.ajax({
            url: "https://terminal.c1games.com/api/game/replayexpanded/" + this.match
        }).done(function (response) {
            self.load(response);
        });
    }
    proto.load_user_data = function () {
        let self = this;
        $.ajax({
            url: "https://terminal.c1games.com/api/game/match/" + this.match + "/algos"
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

        window.viewer.on_user_data_loaded();
    }
    proto.get_user_data = function () {
        return this.user_data;
    }
    proto.get_match_id = function () {
        return this.match;
    }
    proto.get_user_state_data = function (frame) {
        if (frame < 0)
            frame = 0;

        let data = {
            0: [],
            1: [],
            2: [],
            3: [],
        }

        let frame_info = this.frame_information[frame];
        let p1 = frame_info.p1Stats;
        let p2 = frame_info.p2Stats;
        for (var i = 0; i < 4; i++) {
            data[i].push(p1[i]);
            data[i].push(p2[i]);
        }

        return data;
    }

    if (!window.ReplayManager) {
        window.ReplayManager = new replayManager();
    }
})();