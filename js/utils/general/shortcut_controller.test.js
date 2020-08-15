const ShortcutController = require('./shortcut_controller');
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

afterEach(() => {
    jest.clearAllMocks();
});

describe('test shortcut controller', () => {
    test('create', () => {
        new ShortcutController(mockActionEventSystem);
    });

    test('add new shortcut with space should toggle_play', () => {
        let shortcutController = new ShortcutController(mockActionEventSystem);
        shortcutController.addNewShortcut({
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: "toggle_play",
            type: "keydown",
        });

        document.dispatchEvent(new KeyboardEvent('keydown', {
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
        }));

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(1);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith("toggle_play");
    });

    test('add new shortcut with KeyX should switch_view', () => {
        let shortcutController = new ShortcutController(mockActionEventSystem);
        shortcutController.addNewShortcut({
            code: "KeyX",
            ctrlKey: false,
            shiftKey: false,
            altKey: true,
            callback: "switch_view",
            type: "keydown",
        });

        document.dispatchEvent(new KeyboardEvent('keydown', {
            code: "KeyX",
            ctrlKey: false,
            shiftKey: false,
            altKey: true,
        }));

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(1);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith("switch_view");
    });

    test('any shortcut should remove focus from any element', () => {
        document.body.innerHTML = '<button id="button1"/>';
        document.getElementById('button1').focus();

        let shortcutController = new ShortcutController(mockActionEventSystem);
        shortcutController.addNewShortcut({
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: "toggle_play",
            type: "keydown",
        });

        document.dispatchEvent(new KeyboardEvent('keydown', {
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
        }));

        expect(document.querySelector(':focus')).toBe(null);
    });

    test('another type of event', () => {
        document.body.innerHTML = '<button id="button1"/>';
        document.getElementById('button1').focus();

        let shortcutController = new ShortcutController(mockActionEventSystem);
        shortcutController.addNewShortcut({
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: "toggle_play",
            type: "keyup",
        });

        document.dispatchEvent(new KeyboardEvent('keyup', {
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
        }));

        expect(document.querySelector(':focus')).toBe(null);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(1);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith("toggle_play");
    });

    test('another type of event should not trigger', () => {
        let shortcutController = new ShortcutController(mockActionEventSystem);
        shortcutController.addNewShortcut({
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: "toggle_play",
            type: "a",
        });

        document.dispatchEvent(new KeyboardEvent('b', {
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
        }));

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(0);
    });
});