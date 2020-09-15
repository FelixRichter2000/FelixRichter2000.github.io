const ConfigTools = require('./config_tools');

afterEach(() => {
    jest.clearAllMocks();
});

describe('test shortcut controller', () => {
    test('create', () => {
        let config = { unitInformation: [] }
        new ConfigTools(config);
    });

    test('get_range returns 0 when type (0) does not exist', () => {
        let config = { unitInformation: [] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_range(0, false);
        expect(result).toBe(0);
    });

    test('get_range returns 0 when type (45) does not exist', () => {
        let config = { unitInformation: [] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_range(45, true);
        expect(result).toBe(0);
    });

    test('get_range returns biggest range value when type exists', () => {
        let config = { unitInformation: [{ hitRange: 3 }] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_range(0, false);
        expect(result).toBe(3);
    });

    test('get_range returns biggest range value when type exists and multiple Ranges exist', () => {
        let config = { unitInformation: [{ hitRange: 3, otherRange: 2 }] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_range(0, false);
        expect(result).toBe(3);
    });

    test('get_range returns biggest range value when type exists and multiple Ranges exist reversed order', () => {
        let config = { unitInformation: [{ hitRange: 2, otherRange: 5 }] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_range(0, false);
        expect(result).toBe(5);
    });

    test('get_range only consider properties having Range in their name', () => {
        let config = { unitInformation: [{ hitRange: 2, otherStrange: 5 }] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_range(0, false);
        expect(result).toBe(2);
    });

    test('get_range upgrade Ranges have higher prio if second parameter is true', () => {
        let config = { unitInformation: [{ hitRange: 2, upgrade: { hitRange: 4 } }] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_range(0, true);
        expect(result).toBe(4);
    });

    test('get_range upgrade Ranges get ignored if second parameter is false', () => {
        let config = { unitInformation: [{ hitRange: 2, upgrade: { hitRange: 4 } }] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_range(0, false);
        expect(result).toBe(2);
    });

    test('get_range unitType 2 works aswell', () => {
        let config = { unitInformation: [{}, {}, { hitRange: 2, upgrade: { hitRange: 4 } }] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_range(2, false);
        expect(result).toBe(2);
    });

    test('get_range unitTypes greter than 100 are assumed to be 100 less', () => {
        let config = { unitInformation: [{}, {}, { hitRange: 2, upgrade: { hitRange: 4 } }] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_range(102, false);
        expect(result).toBe(2);
    });

    test('setConfig later', () => {
        let config = { unitInformation: [{}, {}, { hitRange: 2, upgrade: { hitRange: 4 } }] }
        let config_tools = new ConfigTools();
        config_tools.set_config(config);
        let result = config_tools.get_range(102, false);
        expect(result).toBe(2);
    });
});

describe('test get_health', () => {
    it('should return return zero when config is not existing yet', () => {
        let config_tools = new ConfigTools();
        let result = config_tools.get_start_health(2, false);
        expect(result).toBe(0);
    });

    it('should return return the normal health', () => {
        let config = { unitInformation: [{}, {}, { startHealth: 1, upgrade: { startHealth: 2 } }] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_start_health(2, false);
        expect(result).toBe(1);
    });

    it('should return return the upgraded health', () => {
        let config = { unitInformation: [{}, {}, { startHealth: 1, upgrade: { startHealth: 2 } }] }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_start_health(2, true);
        expect(result).toBe(2);
    });
});

describe('test get_starting_hp', () => {
    it('should return zero before config is set', () => {
        let config_tools = new ConfigTools();
        let result = config_tools.get_starting_hp();
        expect(result).toBe(0);
    });

    it('should return starting_hp', () => {
        let config = { resources: { startingHP: 40 } }
        let config_tools = new ConfigTools(config);
        let result = config_tools.get_starting_hp();
        expect(result).toBe(40);
    });
});