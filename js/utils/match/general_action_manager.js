class GeneralActionManager {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.actions = [];
        this.action_mode = 0;
        this.switched = false;
        this.information_units = [3, 4, 5];
        this.removal_mode = false;
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

    set_actions(actions) {
        this.actions = JSON.parse(JSON.stringify(actions));
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
        location = this._switch_location_if_needed(location);

        let new_action = [location, this.action_mode, +this.switched, 1];

        let index = this._get_index_of_action(new_action);
        let action_exists = index != -1;

        if (this.removal_mode) {
            if (action_exists)
                this._remove_action(index);
        } else {
            if (action_exists && this.complete_match) {
                if (this._is_information_mode()) {
                    this.actions[index][3] += 1;
                }
            }
            else {
                this._append_action(new_action);
            }
        }

        this._release_set_actions_event();
    }

    _append_action(new_action) {
        this.actions.push(new_action);

    }

    _remove_action(index) {
        if (this.actions[index][3] > 1)
            this.actions[index][3] -= 1;
        else
            this.actions.splice(index, 1);
    }

    _switch_location_if_needed(location) {
        if (this.switched)
            location = [27 - location[0], 27 - location[1]];
        return location;
    }

    _get_index_of_action(new_action) {
        let index = this.actions.findIndex(e => JSON.stringify(e.slice(0, 3)) == JSON.stringify(new_action.slice(0, 3)));
        this.complete_match = true;
        if (index == -1) {
            index = this.actions.findIndex(e => JSON.stringify(e.slice(0, 1)) == JSON.stringify(new_action.slice(0, 1)));
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
        this.actionEventSystem.release_event('set_actions', this._get_formatted_actions());
    }

    _get_formatted_actions() {
        return this.actions;
    }
}


if (typeof process !== 'undefined')
    module.exports = GeneralActionManager;