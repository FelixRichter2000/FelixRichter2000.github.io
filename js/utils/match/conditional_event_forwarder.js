class ConditionalEventForwarder {
    constructor(actionEventSystem, eventListeningOn, condition_function, eventToRaise) {
        this[eventListeningOn] = function(data) {
            if (condition_function(data))
                actionEventSystem.release_event(eventToRaise, data);
        };
    }
}


if (typeof process !== 'undefined')
    module.exports = ConditionalEventForwarder;