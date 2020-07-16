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
        });

        document.dispatchEvent(new KeyboardEvent('keydown', {
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: "toggle_play",
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
        });

        document.dispatchEvent(new KeyboardEvent('keydown', {
            code: "KeyX",
            ctrlKey: false,
            shiftKey: false,
            altKey: true,
            callback: "switch_view",
        }));

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(1);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith("switch_view");
    });
});