class ActionEventSystem {
    constructor() {
        this.listeners = [];
        this.followUpMap = {};
        this.preMap = {};
    }

    register(listener) {
        if (!this.listeners.includes(listener))
            this.listeners.push(listener);
    }

    registerFollowUpEvent(triggerEvent, followUpEvent) {
        this.followUpMap[triggerEvent] = [...(this.followUpMap[triggerEvent] || []), followUpEvent];
    }

    registerPreEvent(triggerEvent, preEvent) {
        this.followUpMap[triggerEvent] = [...(this.preMap[triggerEvent] || []), preEvent];
    }

    release_event(name, parameter) {
        console.log(name, parameter);

        this._releasePreEventIfExists(name, parameter);

        this.listeners
            .filter(listener => listener[name])
            .forEach(listener => listener[name](parameter));

        this._releaseFollowUpEventIfExists(name, parameter);
    }

    _releasePreEventIfExists(name, parameter) {
        (this.preMap[name] || []).forEach(e => this.release_event(e, parameter));
    }

    _releaseFollowUpEventIfExists(name, parameter) {
        (this.followUpMap[name] || []).forEach(e => this.release_event(e, parameter));
    }
}


if (typeof process !== 'undefined')
    module.exports = ActionEventSystem;