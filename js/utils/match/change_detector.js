class ChangeDetector {
    constructor() {
        this.shorthands = ['FF', 'DF', 'EF', 'PI', 'EI', 'SI', 'RM', 'UP'];
        this.firewalls = ['FF', 'DF', 'EF', 'RM', 'UP'];
    }

    detect_changes(game_state_before, game_state_after) {
        let before_existing_units = this._take_flat(game_state_before.p1Units, 0, 6)
            .map(e => e[3]);
        let firewalls = game_state_after.p1Units
            .slice(0, 3)
            .map((units, unit_index) => units
                .filter(unit => !before_existing_units.includes(unit[3]))
                .map(unit => [this.shorthands[unit_index], ...unit.slice(0, 2)]));

        let before_existing_modifiers = this._take_flat(game_state_before.p1Units, 6, 8)
            .map(e => e[3]);
        let modifiers = game_state_after.p1Units
            .slice(6, 8)
            .map((units, unit_index) => units
                .filter(unit => !before_existing_modifiers.includes(unit[3]))
                .map(unit => [this.shorthands[unit_index + 6], ...unit.slice(0, 2)]));

        let firewalls_flat = this._flatten([...firewalls, ...modifiers]);

        if (game_state_before != game_state_after)
            return [
                firewalls_flat, [],
                [],
                []
            ];
        return [
            [],
            [],
            [],
            []
        ];
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