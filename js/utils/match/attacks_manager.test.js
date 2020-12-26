const AttacksManager = require("./attacks_manager");
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

afterEach(() => {
    jest.clearAllMocks();
});

it('should be creatable', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
});

it('should recieve set_attacks event and send first one 1', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['first p0']
        ],
        [
            ['first p1']
        ],
    ];
    attacks_manager.set_attacks(attacks);
    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_actions', ['first p0']);
});

it('should recieve set_attacks event and send first one 2', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['second p0']
        ],
        [
            ['second p1']
        ],
    ];
    attacks_manager.set_attacks(attacks);
    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_actions', ['second p0']);
});

it('should recieve set_attacks event and send first one 1 switched', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['first p0']
        ],
        [
            ['first p1']
        ],
    ];
    attacks_manager.switch_view();
    attacks_manager.set_attacks(attacks);
    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_actions', ['first p1']);
});

it('should recieve set_attacks event and send first one 2 switched', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['second p0']
        ],
        [
            ['second p1']
        ],
    ];
    attacks_manager.switch_view();
    attacks_manager.set_attacks(attacks);
    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_actions', ['second p1']);
});

it('should do nothing when next attack is called and there is no next attack', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['second p0']
        ],
        [
            ['second p1']
        ],
    ];
    attacks_manager.set_attacks(attacks);
    jest.clearAllMocks();
    attacks_manager.next_attack();
    expect(mockActionEventSystem.release_event).not.toHaveBeenCalled();
});

it('should send set_actions event when next attack is called and there is one', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['first p0'],
            ['second p0'],
        ],
        [
            ['second p1']
        ],
    ];
    attacks_manager.set_attacks(attacks);
    jest.clearAllMocks();
    attacks_manager.next_attack();
    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_actions', ['second p0']);
});

it('should send set_actions event when next attack is called and there is one switched', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['first p0'],
            ['second p0'],
        ],
        [
            ['first p1'],
            ['second p1'],
        ],
    ];
    attacks_manager.set_attacks(attacks);
    attacks_manager.switch_view();
    jest.clearAllMocks();
    attacks_manager.next_attack();
    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_actions', ['second p1']);
});

it('should do nothing when previous attack is called and there is no previous attack', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['second p0']
        ],
        [
            ['second p1']
        ],
    ];
    attacks_manager.set_attacks(attacks);
    jest.clearAllMocks();
    attacks_manager.previous_attack();
    expect(mockActionEventSystem.release_event).not.toHaveBeenCalled();
});

it('should do nothing when previous attack is called and there is no previous attack switched', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['second p0']
        ],
        [
            ['second p1']
        ],
    ];
    attacks_manager.set_attacks(attacks);
    attacks_manager.switch_view();
    jest.clearAllMocks();
    attacks_manager.previous_attack();
    expect(mockActionEventSystem.release_event).not.toHaveBeenCalled();
});

it('should send set_actions event when previous attack is called and there is one', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['first p0'],
            ['second p0'],
        ],
        [
            ['first p1'],
            ['second p1'],
        ],
    ];
    attacks_manager.set_attacks(attacks);
    attacks_manager.next_attack();
    jest.clearAllMocks();
    attacks_manager.previous_attack();
    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_actions', ['first p0']);
});

it('should send set_actions event of first attack when switch view is called', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['first p0'],
            ['second p0'],
        ],
        [
            ['first p1'],
            ['second p1'],
        ],
    ];
    attacks_manager.set_attacks(attacks);
    attacks_manager.next_attack();
    jest.clearAllMocks();
    attacks_manager.switch_view();
    expect(mockActionEventSystem.release_event)
        .toHaveBeenCalledWith('set_actions', ['first p1']);
});

it('should replace the actions on the current spot when set_actions is called', () => {
    let attacks_manager = new AttacksManager(mockActionEventSystem);
    let attacks = [
        [
            ['first p0'],
            ['second p0'],
        ],
        [
            ['first p1'],
            ['second p1'],
        ],
    ];
    attacks_manager.set_attacks(attacks);
    expect(attacks_manager.get_attacks()).toEqual([
        ['first p0'],
        ['second p0'],
    ]);
    attacks_manager.set_actions(['new first p0']);
    expect(attacks_manager.get_attacks()).toEqual([
        ['new first p0'],
        ['second p0'],
    ]);
    attacks_manager.next_attack();
    attacks_manager.set_actions(['new first p0']);
    expect(attacks_manager.get_attacks()).toEqual([
        ['new first p0'],
        ['new first p0'],
    ]);
});
