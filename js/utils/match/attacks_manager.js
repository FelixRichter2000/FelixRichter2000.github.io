class AttacksManager {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.switched = false;
        this.attack_index = 0;
        this.attacks = [[[]], [[]]];
        this.mode = 'attacks'
    }

    set_attacks(attacks) {
        this.attacks = attacks;
        this._release_set_actions_event();
    }

    set_mode(mode) {
        this.mode = mode;
    }

    create_new_attack() {
        this.attacks[+this.switched].push([]);
        this.attack_index = this.attacks[+this.switched].length - 2;
        this.next_attack();
    }

    delete_current_attack() {
        this.attacks[+this.switched].splice(this.attack_index, 1);
        this.attack_index -= 1;
        if (this.attacks[+this.switched].length == 0)
            this.create_new_attack();
        if (!this._next_possible())
            this.previous_attack();
        this.next_attack();
    }

    _release_set_actions_event() {
        this.actionEventSystem.release_event('set_actions', this.attacks[+this.switched][this.attack_index]);
        this.actionEventSystem.release_event('update_view', { attack_index: [this.attack_index] });
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
        if (this._next_possible()) {
            this.attack_index += 1;
            this._release_set_actions_event();
        }
    }

    _next_possible() {
        return this.attacks[+this.switched].length > this.attack_index + 1;
    }

    previous_attack() {
        if (this._previous_possible()) {
            this.attack_index -= 1;
            this._release_set_actions_event();
        }
    }

    _previous_possible() {
        return this.attack_index > 0;
    }

    switch_right() {
        if (this._next_possible()) {
            this._switch_attack_with(+1)
            this.next_attack();
        }
    }

    switch_left() {
        if (this._previous_possible()) {
            this._switch_attack_with(-1)
            this.previous_attack();
        }
    }

    _switch_attack_with(diff) {
        let temp = this.attacks[+this.switched][this.attack_index];
        this.attacks[+this.switched][this.attack_index] = this.attacks[+this.switched][this.attack_index + diff];
        this.attacks[+this.switched][this.attack_index + diff] = temp;
    }

    get_attacks() {
        return this.attacks[+this.switched];
    }
}


if (typeof process !== 'undefined')
    module.exports = AttacksManager;