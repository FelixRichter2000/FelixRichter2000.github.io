class ActionManager {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.actions = [
            [],
            [],
            [],
            []
        ];
        this.action_mode = 'FF';
    }

    set_actions(actions) {
        this.actions = actions;
    }

    set_action_mode(action_mode) {
        this.action_mode = action_mode;
    }

    switch_view() {

    }

    click_on_location(location) {
        let action_index = location[1] > 13 ? 2 : 0;

        let new_action = [this.action_mode, ...location];

        if (this.actions[action_index].filter(e => JSON.stringify(e) == JSON.stringify(new_action)).length == 0) {
            this.actions[action_index].push(new_action);
            this._release_set_actions_event();
        }
    }

    _release_set_actions_event() {
        this.actionEventSystem.release_event('set_actions', this.actions);
    }
}


if (typeof process !== 'undefined')
    module.exports = ActionManager;