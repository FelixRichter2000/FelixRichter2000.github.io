class ActionEventSystem {
    constructor() {
        this.listeners = [];
    }

    register(listener) {
        if (!this.listeners.includes(listener))
            this.listeners.push(listener);
    }

    release_event(name, parameter) {
        this.listeners
            .filter(listener => listener[name])
            .forEach(listener => listener[name](parameter));
    }
}


if (typeof process !== 'undefined')
    module.exports = ActionEventSystem;