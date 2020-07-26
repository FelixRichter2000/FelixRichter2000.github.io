class ActionEventSystem {
    constructor() {
        this.listeners = [];
        this.followUpMap = {};
    }

    register(listener) {
        if (!this.listeners.includes(listener))
            this.listeners.push(listener);
    }

    registerFollowUpEvent(triggerEvent, followUpEvent) {
        this.followUpMap[triggerEvent] = followUpEvent;
    }

    release_event(name, parameter) {
        // console.log(name, parameter);
        this.listeners
            .filter(listener => listener[name])
            .forEach(listener => listener[name](parameter));

        this._releaseFollowUpEventIfExists(name, parameter);
    }

    _releaseFollowUpEventIfExists(name, parameter) {
        if (this.followUpMap[name])
            this.release_event(this.followUpMap[name], parameter);
    }
}


if (typeof process !== 'undefined')
    module.exports = ActionEventSystem;