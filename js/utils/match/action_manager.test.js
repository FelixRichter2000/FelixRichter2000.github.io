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

    it('should switch location around', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.switch_view();
        actionManager.click_on_location([0, 0]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [],
            [],
            [
                ['FF', 27, 27]
            ],
            []
        ]);
    });

    it('should switch location twice around', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.switch_view();
        actionManager.click_on_location([0, 0]);
        actionManager.switch_view();
        actionManager.click_on_location([1, 1]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [
                ['FF', 1, 1]
            ],
            [],
            [
                ['FF', 27, 27]
            ],
            []
        ]);
    });
});

describe('click_on_location with firewall units', () => {
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

    it('should add a Encryptor to the actions on the clicked location [0, 0]', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('EF');
        actionManager.click_on_location([0, 0]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [
                ['EF', 0, 0]
            ],
            [],
            [],
            []
        ]);
    });

    it('should add a Destructor to the actions on the clicked location [0, 0]', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('DF');
        actionManager.click_on_location([0, 0]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [
                ['DF', 0, 0]
            ],
            [],
            [],
            []
        ]);
    });

    it('should add a Filter in third array when the location is on the upper half of the board', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('FF');
        actionManager.click_on_location([0, 14]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [],
            [],
            [
                ['FF', 0, 14]
            ],
            []
        ]);
    });

    it('should add a Encryptor in third array when the location is on the upper half of the board', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('EF');
        actionManager.click_on_location([0, 14]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [],
            [],
            [
                ['EF', 0, 14]
            ],
            []
        ]);
    });

    it('should add a Destructor in third array when the location is on the upper half of the board', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('DF');
        actionManager.click_on_location([0, 14]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [],
            [],
            [
                ['DF', 0, 14]
            ],
            []
        ]);
    });
});

describe('click_on_location with information units', () => {
    it('should add a Ping in third array when the location is on the upper half of the board', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('DF');
        actionManager.click_on_location([0, 14]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [],
            [],
            [
                ['DF', 0, 14]
            ],
            []
        ]);
    });

    it('should add a Ping to the actions on the clicked location [0, 0]', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('PI');
        actionManager.click_on_location([0, 0]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [],
            [
                ['PI', 0, 0]
            ],
            [],
            []
        ]);
    });

    it('should add two Pings to the actions on the clicked location [0, 0]', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('PI');
        actionManager.click_on_location([0, 0]);
        actionManager.click_on_location([0, 0]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [],
            [
                ['PI', 0, 0],
                ['PI', 0, 0],
            ],
            [],
            []
        ]);
    });

    it('should add two Emps to the actions on the clicked location [0, 0]', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('EI');
        actionManager.click_on_location([0, 0]);
        actionManager.click_on_location([0, 0]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [],
            [
                ['EI', 0, 0],
                ['EI', 0, 0],
            ],
            [],
            []
        ]);
    });

    it('should add two Scramblers to the actions on the clicked location [0, 0]', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_action_mode('SI');
        actionManager.click_on_location([0, 0]);
        actionManager.click_on_location([0, 0]);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [],
            [
                ['SI', 0, 0],
                ['SI', 0, 0],
            ],
            [],
            []
        ]);
    });
});

describe('set_removal_mode', () => {
    it('should remove the filter', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_actions([
            [
                ['FF', 0, 0],
            ],
            [],
            [],
            []
        ]);
        actionManager.set_removal_mode();
        actionManager.click_on_location([0, 0]);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [],
            [],
            [],
            []
        ]);
    });

    it('should not remove the other filter', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_actions([
            [
                ['FF', 1, 1],
            ],
            [],
            [],
            []
        ]);
        actionManager.set_removal_mode();
        actionManager.click_on_location([0, 0]);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(0);
    });

    it('should remove one Ping', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_actions([
            [],
            [
                ['PI', 0, 0],
                ['PI', 0, 0],
            ],
            [],
            []
        ]);
        actionManager.set_action_mode('PI');
        actionManager.set_removal_mode();
        actionManager.click_on_location([0, 0]);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_actions', [
            [],
            [
                ['PI', 0, 0],
            ],
            [],
            []
        ]);
    });
});


describe('unset removal mode', () => {
    it('should be normal again', () => {
        let actionManager = new ActionManager(mockActionEventSystem);
        actionManager.set_removal_mode();
        actionManager.unset_removal_mode();
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
});