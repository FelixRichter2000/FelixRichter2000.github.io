class ActionManager {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.actions = [
            [],
            [],
            [],
            []
        ];
    }

    set_actions(actions) {
        this.actions = actions;
    }

    set_action_mode() {

    }

    switch_view() {

    }

    click_on_location(location) {
        let new_action = ['FF', ...location];

        if (this.actions[0].filter(e => JSON.stringify(e) == JSON.stringify(new_action)).length == 0) {
            this.actions[0].push(new_action);
            this._release_set_actions_event();
        }
    }

    _release_set_actions_event() {
        this.actionEventSystem.release_event('set_actions', this.actions);
    }
}


if (typeof process !== 'undefined')
    module.exports = ActionManager;