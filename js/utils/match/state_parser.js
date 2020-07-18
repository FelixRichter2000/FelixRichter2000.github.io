class StateParser {

    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.stat_names = ['health', 'core', 'bit', 'ms'];
        this.turn_names = ['turn_type', 'turn_number', 'action_phase_frame_number', 'total_frame_number'];
    }

    update_frame_data(data) {
        let stats = [data.p1Stats, data.p2Stats];
        let turn_values = data.turnInfo;

        let transformed = this._createObjectWithStats(stats);
        transformed = this._addTurnProperties(transformed, turn_values);

        this.actionEventSystem.release_event('update_view', transformed);
    }

    _addTurnProperties(transformed, turn_values) {
        transformed = this.turn_names
            .reduce((a, turn_name, index) => ({...a, [turn_name]: turn_values[index] }), transformed);
        return transformed;
    }

    _createObjectWithStats(stats) {
        return this.stat_names
            .map(this._getValuesFromGivenStatName(stats))
            .reduce(this._addStatProperty(), {});
    }

    _addStatProperty() {
        return (a, values, index) => ({...a, [this.stat_names[index]]: values });
    }

    _getValuesFromGivenStatName(stats) {
        return (_, index) => stats
            .reduce((a, stat) => [...a, stat[index]], []);
    }
}


if (typeof process !== 'undefined')
    module.exports = StateParser;