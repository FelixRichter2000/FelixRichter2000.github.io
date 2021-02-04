class FirewallActionManager {
    constructor(actionEventSystem, enabled = true) {
        this.actionEventSystem = actionEventSystem;
        this.action_mode = 0;
        this.switched = false;
        this.information_units = [3, 4, 5];
        this.removal_mode = false;
        this.enabled = enabled;
        this.firewalls = {
            p0: [],
            p1: [],
            frame: -1,
        }
        this.action_mode_converter = {
            'FF': 0,
            'EF': 1,
            'DF': 2,
            'PI': 3,
            'EI': 4,
            'SI': 5,
            'RM': 6,
            'UP': 7,
        }
    }

    set_mode(mode) {
        this.enabled = mode == 'layout';
    }

    update_frame_data(actions) {
        this.firewalls = JSON.parse(JSON.stringify(actions));
        this.index = this.firewalls.frame;
    }

    set_action_mode(action_mode) {
        this.action_mode = this.action_mode_converter[action_mode];
    }

    switch_view() {
        this.switched = !this.switched;
    }

    set_removal_mode() {
        this.removal_mode = true;
    }

    unset_removal_mode() {
        this.removal_mode = false;
    }

    click_on_location(location) {
        if (!this.enabled) return;

        this.player = +this.switched;
        console.log(location)
        if (location[1] > 13)
            this.player = (this.player + 1) % 2;

        location = this._switch_location_if_needed(location);

        let new_action = [location, this.action_mode, '', +this.player];

        let index = this._get_index_of_action(new_action);
        let action_exists = index != -1;

        if (this.removal_mode) {
            if (action_exists)
                this._remove_action(index);
        } else {
            if (!action_exists || !this.complete_match)
                this._insert_action(new_action);
        }

        this._release_set_actions_event();
    }

    _insert_action(new_action) {
        this.firewalls[`p${+this.player}`].splice(this.index, 0, new_action);
        this.firewalls.frame += 1;
    }

    _remove_action(index) {
        if (this.firewalls[`p${+this.player}`][index][3] > 1)
            this.firewalls[`p${+this.player}`][index][3] -= 1;
        else
            this.firewalls[`p${+this.player}`].splice(index, 1);
        this.firewalls.frame -= 1;
    }

    _switch_location_if_needed(location) {
        if (this.switched)
            location = [27 - location[0], 27 - location[1]];
        return location;
    }

    _get_index_of_action(new_action) {
        let index = this.firewalls[`p${+this.player}`].findIndex(e => JSON.stringify(e.slice(0, 2)) == JSON.stringify(new_action.slice(0, 2)));
        this.complete_match = true;
        if (index == -1) {
            index = this.firewalls[`p${+this.player}`].findIndex(e => JSON.stringify(e.slice(0, 1)) == JSON.stringify(new_action.slice(0, 1)));
            this.complete_match = false;
        }
        return index;
    }

    _calculate_action_index(action) {
        let action_index = action[2] > 13 ? 2 : 0;
        if (this._is_information_mode(action[0]))
            action_index++;
        return action_index;
    }

    _is_information_mode(action_mode = this.action_mode) {
        return this.information_units.includes(action_mode);
    }

    _release_set_actions_event() {
        this.actionEventSystem.release_event('set_firewalls', this._get_formatted_actions());
        this.actionEventSystem.release_event('set_frame', this.firewalls.frame);
    }

    _get_formatted_actions() {
        let arr = [this.firewalls.p0, this.firewalls.p1];
        return arr;
    }
}


if (typeof process !== 'undefined')
    module.exports = FirewallActionManager;