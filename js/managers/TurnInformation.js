(function () {
    let turnInformation = function (deploy_phase_data) {
        this.init(deploy_phase_data);
    }
    let proto = turnInformation.prototype;

    proto.init = function (deploy_phase_data) {
        this.unit_stacks = {};

        this.start_frame = -1;
        this.last_frame = this.start_frame;
        this.deploy_data = deploy_phase_data;
        this.events = [];
        this.add_frame(deploy_phase_data);
    }

    proto.has_action = function () {
        return Object.keys(this.unit_stacks).length > 0;
    }

    proto.add_frame = function (action_phase_data) {
        this.last_frame += 1;
        this.events[this.last_frame] = this.parse_events(action_phase_data.events);
    }

    proto.get_frame_zero_units = function () {
        return this.deploy_data;
    }

    proto.get_events_for = function (frame) {
        return this.events[frame];
    }

    proto.add_to_fitting_stack = function (stack_info) {
        for (let i = 0; true; i++) {
            if (i in this.unit_stacks) {
                if (this.unit_stacks[i].matches(stack_info)) {
                    this.unit_stacks[i].add(stack_info);
                    return;
                }
            }
            else {
                this.unit_stacks[i] = new UnitStack(stack_info, i);
                return;
            }
        }
    }

    proto.get_stack_id = function (unique_id) {
        for (let i = 0; true; i++) {
            if (i in this.unit_stacks) {
                if (this.unit_stacks[i].is_id_in_stack(unique_id)) {
                    return i;
                }
            }
            else {
                throw "moved or killed not existing unit!";
            }
        }
    }

    proto.parse_events = function (events) {
        let new_events = {
            spawns: [],
            removals: [],
            deaths: [],
            stack_spawns: [],
            stack_moves: [],
            stack_deaths: [],
        };

        //Spawns
        let spawns = events.spawn;
        for (let spawn of spawns) {
            var type = spawn[1];

            if (type < 3) {
                new_events.spawns.push(spawn);
            }

            if (type > 2 && type < 6) {
                this.add_to_fitting_stack(spawn);
            }

            if (type === 6) {
                new_events.removals.push(spawn);
            }
        }
        if (spawns.length > 0) {
            for (let key of Object.keys(this.unit_stacks)) {
                new_events.stack_spawns.push([clone(this.unit_stacks[key].info()), this.unit_stacks[key].get_units_left()]);
            }
        }

        //Moves
        let stacks_moved = new Set();
        let moves = events.move;
        for (let move of moves) {

            let unique_id = move[4];
            let stack_id = this.get_stack_id(unique_id);

            if (!(stack_id in stacks_moved)) {
                stacks_moved.add(stack_id);

                let from = move[0];
                let to = move[1];

                let amount = this.unit_stacks[stack_id].get_units_left();

                new_events.stack_moves.push([clone(this.unit_stacks[stack_id].info()), from, to, amount]);
            }
        }

        //Deths
        let stack_deaths = new Set();
        let deaths = events.death;
        for (let death of deaths) {

            let location = death[0];
            let type = death[1];

            if (type < 3) {
                new_events.deaths.push(death);
            }

            if (type > 2 && type < 6) {
                let unique_id = death[2];
                let stack_id = this.get_stack_id(unique_id);

                stack_deaths.add(stack_id);
                this.unit_stacks[stack_id].kill_one();
                this.unit_stacks[stack_id].set_current_location(location);
            }
        }
        for (let stack_id of stack_deaths) {
            new_events.stack_deaths.push([clone(this.unit_stacks[stack_id].info()), this.unit_stacks[stack_id].get_units_left()]);
        }

        return new_events;
    }

    if (!window.TurnInformation) {
        window.TurnInformation = turnInformation;
    }
})();