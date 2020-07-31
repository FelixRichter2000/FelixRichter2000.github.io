class ChangeDetector {
    constructor() {
        this.shorthands = ['FF', 'DF', 'EF', 'PI', 'EI', 'SI', 'RM', 'UP'];
        this.firewalls = ['FF', 'DF', 'EF', 'RM', 'UP'];
    }

    detect_changes(game_state_before, game_state_after) {

        let firewalls = this._get_changes_in_range(game_state_before, 0, 3, game_state_after);
        let modifiers = this._get_changes_in_range(game_state_before, 6, 8, game_state_after);
        let firewalls_flat = this._flatten([...firewalls, ...modifiers]);

        let information = this._get_changes_in_range(game_state_before, 3, 6, game_state_after);
        let information_flat = this._flatten(information);


        if (game_state_before != game_state_after)
            return [
                firewalls_flat, information_flat, [],
                []
            ];
        return [
            [],
            [],
            [],
            []
        ];
    }

    _get_changes_in_range(game_state_before, begin, end, game_state_after) {
        let before_existing_units = this._take_flat(game_state_before.p1Units, begin, end)
            .map(e => e[3]);
        let firewalls = game_state_after.p1Units
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