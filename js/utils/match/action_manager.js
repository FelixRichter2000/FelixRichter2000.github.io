class ActionManager {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.actions = [
            [],
            [],
            [],
            []
        ];
        this.information_units = ['PI', 'EI', 'SI']
        this.action_mode = 'FF';
        this.switched = false;
        this.removal_mode = false;
    }

    set_actions(actions) {
        this.actions = actions;
    }

    set_action_mode(action_mode) {
        this.action_mode = action_mode;
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

        let action_index = this._calculate_action_index(location);

        let new_action = [this.action_mode, ...location];

        let index = this._get_index_of_action(action_index, new_action);
        let action_exists = index != -1;

        if (this.removal_mode) {
            if (action_exists)
                this._remove_action(action_index, index);
        } else if (!action_exists || this._is_information_mode())
            this._append_action(action_index, new_action);
    }

    _append_action(action_index, new_action) {
        this.actions[action_index].push(new_action);
        this._release_set_actions_event();
    }

    _remove_action(action_index, index) {
        this.actions[action_index].splice(index, 1);
        this._release_set_actions_event();
    }

    _switch_location_if_needed(location) {
        if (this.switched)
            location = [27 - location[0], 27 - location[1]];
        return location;
    }

    _get_index_of_action(action_index, new_action) {
        let index = this.actions[action_index].findIndex(e => JSON.stringify(e) == JSON.stringify(new_action));
        if (index == -1)
            index = this.actions[action_index].findIndex(e => e[1] == new_action[1] && e[2] == new_action[2]);
        return index;
    }

    _calculate_action_index(location) {
        let action_index = location[1] > 13 ? 2 : 0;
        if (this._is_information_mode())
            action_index++;
        return action_index;
    }

    _is_information_mode() {
        return this.information_units.includes(this.action_mode);
    }

    _release_set_actions_event() {
        this.actionEventSystem.release_event('set_actions', this.actions);
    }
}


if (typeof process !== 'undefined')
    module.exports = ActionManager;