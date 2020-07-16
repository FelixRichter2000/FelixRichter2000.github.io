class ShortcutController {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.shortCuts = [];
        this._setupEventListener();
    }

    addNewShortcut(shortcut) {
        this.shortCuts.push(shortcut);
    }

    _setupEventListener() {
        document.addEventListener('keydown', this._handleEvent.bind(this));
    }

    _handleEvent(keyEvent) {
        let match = this.shortCuts.find((e) => this._areKeyEventsEqual(e, keyEvent), this);
        if (match) {
            this.actionEventSystem.release_event(match.callback);
            this._preventDefaultBehaviours(keyEvent);
        }
    }

    _preventDefaultBehaviours(keyEvent) {
        keyEvent.preventDefault();
        let el = document.querySelector(':focus');
        if (el)
            el.blur();
    }

    _areKeyEventsEqual(e1, e2) {
        return e1.code === e2.code &&
            e1.ctrlKey === e2.ctrlKey &&
            e1.altKey === e2.altKey &&
            e1.shiftKey === e2.shiftKey;
    }
}


if (typeof process !== 'undefined')
    module.exports = ShortcutController;