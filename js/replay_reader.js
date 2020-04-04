(function () {

    var replay_reader = function (match_id) {
        this.init();
        this.set_match_id(match_id);
    }
    let proto = replay_reader.prototype;

    proto.init = function () {
        this.full_frame_data = [];
        this.raw_frame_data = [];
        this.fast_frame_data = [];
        this.count = 0;
        this.user_data = [];
    }
    proto.is_ready = function () {
        return this.count > 0 && this.user_data.length > 0;
    }
    proto.set_match_id = function (match_id) {
        this.match_id = match_id;
        this.load_user_data();
        this.load_data();
    }
    proto.process_match_data = function (file) {
        this.full_frame_data = match_utils.parse_file_to_raw_array(file);
        this.raw_frame_data = this.full_frame_data.slice(1, -1);
        this.fast_frame_data = match_utils.parse_objects_to_arrays(this.raw_frame_data);
        this.count = this.fast_frame_data.length;
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
        this.user_data = response.data.algos;
    }
    proto.get_next_turn = function (frame) {
        frame++;
        while (frame < this.count && this.raw_frame_data[frame].turnInfo[0] !== 0) {
            frame++;
        }
        return frame + 1;
    }
    proto.get_previous_turn = function (frame) {
        frame -= 2;
        while (frame > 0 && this.raw_frame_data[frame].turnInfo[0] !== 0) {
            frame--;
        }
        return frame + 1;
    }
    proto.get_range = function (unit_type, upgraded) {
        let range = 0;

        const correct_unit_information = JSON.parse(JSON.stringify(this.full_frame_data[0].unitInformation[unit_type - 100]));

        if (upgraded)
            Object.assign(correct_unit_information, correct_unit_information.upgrade);

        let propertyNames = Object.getOwnPropertyNames(correct_unit_information);
        let range_names = propertyNames.filter(el => el.includes("Range"))

        for (let range_name of range_names)
            range = Math.max(correct_unit_information[range_name], range);

        return range;
    }
    proto.get_replay_text = function (switched) {
        return this.full_frame_data
            .map(e => JSON.stringify(e))
            .join("\n");
    }
    proto.get_turn_frame_number = function (frame) {
        return this.raw_frame_data[frame].turnInfo[2];
    }


    if (!window.ReplayReader) {
        window.ReplayReader = replay_reader;
    }
})();