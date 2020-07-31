class ChangeDetector {
    constructor() {
        this.shorthands = ['FF', 'DF', 'EF', 'PI', 'EI', 'SI', 'RM', 'UP'];
        this.firewalls = ['FF', 'DF', 'EF', 'RM', 'UP'];
    }

    detect_changes(game_state_before, game_state_after) {

        let p1_data = this._get_changes(game_state_before.p1Units, game_state_after.p1Units);
        let p2_data = this._get_changes(game_state_before.p2Units, game_state_after.p2Units);

        p2_data = p2_data.map(e => e = e.map(f => [f[0], 27 - f[1], 27 - f[2]]));


        if (game_state_before != game_state_after)
            return [
                ...p1_data, ...p2_data
            ];
        return [
            [],
            [],
            [],
            []
        ];
    }

    _get_changes(units_before, units_after) {
        let firewalls = this._get_changes_in_range(units_before, 0, 3, units_after);
        let modifiers = this._get_changes_in_range(units_before, 6, 8, units_after);
        let p1_firewalls_flat = this._flatten([...firewalls, ...modifiers]);

        let information = this._get_changes_in_range(units_before, 3, 6, units_after);
        let p1_information_flat = this._flatten(information);

        return [p1_firewalls_flat, p1_information_flat];
    }

    _get_changes_in_range(unit_before, begin, end, units_after) {
        let before_existing_units = this._take_flat(unit_before, begin, end)
            .map(e => e[3]);
        let firewalls = units_after
            .slice(begin, end)
            .map((units, unit_index) => units
                .filter(unit => !before_existing_units.includes(unit[3]))
                .map(unit => [this.shorthands[unit_index + begin], ...unit.slice(0, 2)]));
        return firewalls;
    }

    _flatten(all_data) {
        return [].concat(...all_data);
    }

    _take_flat(all_data, first, last) {
        return this._flatten(all_data.slice(first, last));
    }
}


if (typeof process !== 'undefined')
    module.exports = ChangeDetector;