class SimulationIntegrator {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.replay_data = [];
    }

    set_replay_data(replay_data) {
        this.replay_data = replay_data;
    }

    add_simulation_result(simulation_result) {
        this._merge_with_simulation_result(simulation_result);
        this.actionEventSystem.release_event('set_replay_data', this.replay_data);
        this.actionEventSystem.release_event('set_frame', this.insertion_index);
        this.actionEventSystem.release_event('play');

    }

    _merge_with_simulation_result(simulation_result) {
        this.insertion_index = this._get_insertion_index(simulation_result);
        this._insert(simulation_result);
        this._fix_frame_numbers();
    }

    _fix_frame_numbers() {
        this.replay_data = this.replay_data.map((e, i) => { e.turnInfo[3] = i; return e; });
    }

    _insert(simulation_result) {
        if (this.insertion_index === this.replay_data.length - 1) {
            simulation_result.splice(0, 1);
            this.replay_data.splice(this.insertion_index + 1, 0, ...simulation_result);
        } else if (this.insertion_index !== Number.MAX_VALUE) {
            simulation_result.splice(-1, 1);
            this.replay_data.splice(this.insertion_index, 0, ...simulation_result);
        } else
            this.replay_data.splice(this.insertion_index, 0, ...simulation_result);
    }

    _get_insertion_index(simulation_result) {
        let turn_number = simulation_result[0].turnInfo[1];
        let first_frame = this._find_first_frame_of_turn(turn_number);
        return first_frame ? first_frame.turnInfo[3] : Number.MAX_VALUE;
    }

    _find_first_frame_of_turn(turn_number) {
        return this.replay_data
            .find(function(e) {
                return e.turnInfo[1] == turn_number;
            });
    }
}

if (typeof process !== 'undefined')
    module.exports = SimulationIntegrator;