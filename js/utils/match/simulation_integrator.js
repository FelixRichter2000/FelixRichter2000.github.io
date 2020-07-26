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
    }

    _merge_with_simulation_result(simulation_result) {
        let insertion_index = this._get_insertion_index(simulation_result);
        this._insert(insertion_index, simulation_result);
        this._fix_frame_numbers();
    }

    _fix_frame_numbers() {
        this.replay_data = this.replay_data.map((e, i) => { e.turnInfo[3] = i; return e; });
    }

    _insert(insertion_index, simulation_result) {
        if (this.replay_data.length)
            if (insertion_index === this.replay_data.length - 1)
                simulation_result.splice(0, 1);
            else
                simulation_result.splice(-1, 1);
        this.replay_data.splice(insertion_index + 1, 0, ...simulation_result);
    }

    _get_insertion_index(simulation_result) {
        let turn_number = simulation_result[0].turnInfo[1];
        let turn_data = this.replay_data
            .filter(e => e.turnInfo[1] == turn_number)
            .slice(-1)[0];
        let insertion_index = turn_data ? turn_data.turnInfo[3] : this.replay_data.length - 1;
        return insertion_index;
    }
}

if (typeof process !== 'undefined')
    module.exports = SimulationIntegrator;