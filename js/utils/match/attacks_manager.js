class AttacksManager {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.switched = false;
        this.attack_index = 0;
        this.attacks = [[[]], [[]]];
        this.replay_data = [];
        this.mode = 'attacks'
    }

    set_attacks(attacks) {
        this.attacks = attacks;
        this._release_set_actions_event();
    }

    set_replay_data(replay_data) {
        this.replay_data = replay_data;
        this._release_set_actions_event();
    }

    set_mode(mode) {
        this.mode = mode;
    }

    _release_set_actions_event() {
        this.actionEventSystem.release_event('set_actions', this.attacks[+this.switched][this.attack_index]);
    }

    set_actions(actions) {
        this.attacks[+this.switched][this.attack_index] = JSON.parse(JSON.stringify(actions));
    }

    switch_view() {
        this.switched = !this.switched;
        this.attack_index = 0;
        this._release_set_actions_event();
    }

    next_attack() {
        if (this.attacks[+this.switched].length > this.attack_index + 1) {
            this.attack_index += 1;
            this._release_set_actions_event();
        }
    }

    previous_attack() {
        if (this.attack_index > 0) {
            this.attack_index -= 1;
            this._release_set_actions_event();
        }
    }

    get_attacks() {
        return this.attacks[+this.switched];
    }
}


if (typeof process !== 'undefined')
    module.exports = AttacksManager;