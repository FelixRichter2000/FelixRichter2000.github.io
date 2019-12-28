(function (replayManager) {
    let replayPlayer = function () {
        this.manager = replayManager;
        this.turn = 0;
        this.frame = 0;
        this.play = false;
        this.speed = 12;
        this.timer = null;

        //Images
        this.playerImages = [
            ['../images/Filter1.svg', '../images/Encryptor1.svg', '../images/Destructor1.svg', '../images/Ping1.svg', '../images/Emp1.svg', '../images/Scrambler1.svg', '../images/Remove1.svg'],
            ['../images/Filter2.svg', '../images/Encryptor2.svg', '../images/Destructor2.svg', '../images/Ping2.svg', '../images/Emp2.svg', '../images/Scrambler2.svg', '../images/Remove2.svg']];
        this.emptyImage = '../images/EmptyField.svg';

        //Jquery
        this.$match_id_label = $('#match_id_label');
        this.$replay_table = $('#match_table');
        this.$replay_range = $('#match_range');
        this.$watch_on_terminal = $('#watch_on_terminal');
        this.$playButton = $(".togglePlay");
        this.$skip_foreward_button = $("#skip_foreward");
        this.$skip_backward_button = $("#skip_backward");

        this.init_table();

        this.$replay_images = this.$replay_table.find('img');
        this.$replay_labels = this.$replay_table.find('label');
        this.$replay_tds = this.$replay_table.find('td');

        //Set initial Speed
        this.set_match_speed(this.speed);

        //Init Play/Pause Button
        this.$playButton.toggleClass("paused");

        self = this;
        this.$playButton.click(function () {
            self.$playButton.toggleClass("paused");
            if (self.$playButton.hasClass("paused")) {
                self.start_play();
            }
            else {
                self.stop_play();
            }
        });

        //Init Slider input events
        this.$replay_range.on('input', function () {
            self.load_frame(parseInt(this.value));
        });

        this.$skip_foreward_button.on('click', function () {
            self.go_to_next_turn();
        });

        this.$skip_backward_button.on('click', function () {
            self.go_to_previous_turn();
        });
    }
    let proto = replayPlayer.prototype;

    proto.go_to_next_turn = function () {
        let frame = replayManager.get_next_turn_first_frame(this.frame);
        this.load_frame(frame + 2);
        this.update_replay_range_slider();
    }
    proto.go_to_previous_turn = function () {
        let frame = replayManager.get_previous_turn_first_frame(this.frame);
        this.load_frame(frame + 2);
        this.update_replay_range_slider();
    }
    proto.init_table = function () {
        for (var y = 0; y < 28; y++) {
            var new_row = $('<tr>');
            for (var x = 0; x < 28; x++) {
                var new_td = $('<td>');

                if (Math.abs(x - 13.5) + Math.abs(y - 13.5) < 15) {
                    new_td
                        .append($('<label>')
                            .addClass('IULabel'));

                    new_td.append($('<img>')
                        .attr('id', (27 - y) * 1000 + x)
                        .attr('src', this.emptyImage));
                }
                new_row
                    .append(new_td);
            }
            this.$replay_table
                .append(new_row);
        }
    }
    proto.start_play = function () {
        this.play = true;
        this.$playButton.addClass("paused");
    }
    proto.stop_play = function () {
        this.play = false;
        this.$playButton.removeClass("paused");
    }
    proto.on_replay_changed = function () {
        this.$match_id_label.html(replayManager.get_match_id());
        this.$replay_range.attr('max', replayManager.get_max_frame() - 1);
        this.$replay_range.val(0);
        this.turn = 0;
        this.frame = 0;
        this.load_frame(0);
        this.start_play();
        this.max_frame = replayManager.get_max_frame();
    }
    proto.set_match_speed = function (fps) {
        this.speed = fps;
        self = this;
        if (this.timer)
            clearInterval(this.timer);
        this.timer = setInterval(self.tick.bind(self), 1000 / fps);
    }
    proto.tick = function () {
        if (!this.play) return;

        if (this.frame >= this.max_frame) {
            this.stop_play();
            return;
        }

        this.update_to_next_frame();
        this.update_replay_range_slider();
    }
    proto.load_frame = function (frame) {
        this.stop_play();

        if (frame < this.frame) {
            this.frame = replayManager.get_first_frame_of_turn(frame);
            this.resetReplayTable();
            this.show_turns_first_frame();
        }
        
        while (this.frame < frame) {
            this.update_to_next_frame();
        }
    }
    proto.resetReplayTable = function () {
        this.$replay_images.attr('src', this.emptyImage);
        this.$replay_labels.html('');
    }
    proto.show_turns_first_frame = function () {
        let info = replayManager.get_turn_info_for(this.frame);

        var units = [info.p1Units, info.p2Units];

        for (var playerIndex = 0; playerIndex < units.length; playerIndex++) {
            var playerUnits = units[playerIndex];
            var images = this.playerImages[playerIndex];

            for (var imageIndex = 0; imageIndex < images.length; imageIndex++) {
                var currentUnits = playerUnits[imageIndex];
                var currentImage = images[imageIndex];

                var dict = {};

                for (var unit in currentUnits) {
                    unit = currentUnits[unit];
                    var x = parseInt(unit[0]);
                    var y = parseInt(unit[1]);

                    var location = (27 - y) * 28 + x;

                    dict[location] = (location in dict ? dict[location] : 0) + 1;

                    var td = this.$replay_tds[location];
                    var img = $(td).find('img')[0];
                    var label = $(td).find('label')[0];

                    img.src = currentImage;

                    if (imageIndex > 2 && imageIndex < 6) {
                        label.innerHTML = dict[location];
                    }
                }
            }
        }
    }
    proto.set_img = function (location, path) {
        let x = location[0];
        let y = location[1];
        let td = this.$replay_tds[(27 - y) * 28 + x];
        let img = $(td).find('img')[0];
        img.src = path;
    }
    proto.set_amont = function (location, amount) {
        let x = location[0];
        let y = location[1];
        let td = this.$replay_tds[(27 - y) * 28 + x];

        let label = $(td).find('label')[0];
        label.innerHTML = amount;
    }
    proto.update_replay_range_slider = function () {
        this.$replay_range.val(this.frame);
    }
    proto.update_to_next_frame = function () {
        if (this.frame > replayManager.get_max_frame) return;
        let events = replayManager.get_events_for(this.frame);

        events.spawns.forEach(spawn => {
            var at = spawn[0];
            var type = spawn[1];
            var player = spawn[3] - 1;

            var currentImage = this.playerImages[player][type];

            this.set_img(at, currentImage);
        });

        events.deaths.forEach(death => {
            var at = death[0];
            var type = death[1];
            var player = death[3] - 1;

            this.set_img(at, this.emptyImage);
        });

        events.stack_spawns.forEach(stack_spawn => {
            let info = stack_spawn[0];
            let units_spawned = stack_spawn[1];

            var at = info[0];
            var type = info[1];
            var player = info[3] - 1;

            var currentImage = this.playerImages[player][type];

            this.set_img(at, currentImage);
            this.set_amont(at, units_spawned);
        });

        events.stack_moves.forEach(stack_move => {
            let info = stack_move[0];
            let type = info[1];
            let player = info[3] - 1;

            let from = stack_move[1];
            let to = stack_move[2];
            let amount = stack_move[3];

            let currentImage = this.playerImages[player][type];

            this.set_img(from, this.emptyImage);
            this.set_amont(from, null);
            this.set_img(to, currentImage);
            this.set_amont(to, amount);
        });

        events.stack_deaths.forEach(stack_death => {
            let info = stack_death[0];
            let location = info[0];
            let type = info[1];
            let player = info[3] - 1;

            let units_left = stack_death[1];

            if (units_left === 0) {
                this.set_img(location, this.emptyImage);
                this.set_amont(location, null);
            }
            else {
                this.set_amont(location, units_left);
            }
        });

        this.frame += 1;
    }

    if (!window.ReplayPlayer) {
        window.ReplayPlayer = replayPlayer;
    }
})(ReplayManager);