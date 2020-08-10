const ActionManager = require("./action_manager");
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

afterEach(() => {
    jest.clearAllMocks();
});

describe('create ActionManager', () => {
    it('should be creatable', () => {
        new ActionManager(mockActionEventSystem);
    });
});

describe('receive set_actions events', () => {
    it('should store the actions internally for later', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_actions([
            [],
            [],
            [],
            []
        ]);
    });
});

describe('receive set_action_mode events', () => {
    it('should set the mode to FF', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('FF');
    });

    it('should set the mode to PI', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('PI');
    });
});

describe('receive switch_view event', () => {
    it('should remember the orientation for later', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.switch_view();
    });
});

describe('receive click_on_location events', () => {
    it('should add a Filter (default mode) to the actions on the clicked location [0, 0]', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.click_on_location([0, 0]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [
                ['FF', 0, 0]
            ],
            [],
            [],
            []
        ]);

    });

    it('should add a Filter (default mode) to the actions on the clicked location [5, 3]', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.click_on_location([5, 3]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [
                ['FF', 5, 3]
            ],
            [],
            [],
            []
        ]);
    });

    it('should not add another Filter (default mode) if there is already a filter', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_actions([
            [
                ['FF', 0, 0]
            ],
            [],
            [],
            []
        ]);
        actionManager.click_on_location([0, 0]);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(0);
    });

    it('should add filter on new location', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_actions([
            [
                ['FF', 0, 0],
                ['FF', 1, 2]
            ],
            [],
            [],
            []
        ]);
        actionManager.click_on_location([2, 3]);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [
                ['FF', 0, 0],
                ['FF', 1, 2],
                ['FF', 2, 3],
            ],
            [],
            [],
            []
        ]);
    });

    it('should not add another Filter if another filter is placed there already', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_actions([
            [
                ['FF', 1, 2],
                ['FF', 0, 0],
                ['FF', 2, 3],
            ],
            [],
            [],
            []
        ]);
        actionManager.click_on_location([0, 0]);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(0);
    });
});