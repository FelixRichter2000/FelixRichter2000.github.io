class ChangeDetector {
    constructor() {
        this.shorthands = ['FF', 'EF', 'DF', 'PI', 'EI', 'SI', 'RM', 'UP'];
        this.firewalls = ['FF', 'EF', 'DF', 'RM', 'UP'];
        this.information_indices = [3, 4, 5];
    }

    detect_changes(events) {
        if (!events)
            return [
                [],
                [],
                [],
                []
            ];

        return [
            [false, 1],
            [true, 1],
            [false, 2],
            [true, 2]
        ].map(e => this._get_events(events, ...e));
    }

    _get_events(events, want_information_units, player) {
        return events
            .filter(e => e[3] === player)
            .filter(e => want_information_units === this.information_indices.includes(e[1]))
            .map(e => [this.shorthands[e[1]], ...e[0]])
            .map(e => player === 1 ? e : [e[0], 27 - e[1], 27 - e[2]]);
    }
}


if (typeof process !== 'undefined')
    module.exports = ChangeDetector;