const SimulationIntegrator = require("./simulation_integrator");
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

afterEach(() => {
    jest.clearAllMocks();
});

describe('create SimulationIntegrator', () => {
    test('should be created', () => {
        new SimulationIntegrator(mockActionEventSystem);
    });
});

describe('SimulationIntegrator.set_replay_data', () => {
    test('should save it internally', () => {
        let simulationIntegrator = new SimulationIntegrator(mockActionEventSystem);
        simulationIntegrator.set_replay_data([1, 2, 3]);
    });
});

describe('SimulationIntegrator.add_simulation_result', () => {
    test('should append everything if the state was empty before', () => {
        let starting_state = [];

        let additinal_state = [{
            "turnInfo": [0, 0, -1, 0]
        }, {
            "turnInfo": [1, 0, 0, 1]
        }, {
            "origin": "additinal_state",
            "turnInfo": [0, 1, -1, 2]
        }];

        let complete_state = [{
            "turnInfo": [0, 0, -1, 0]
        }, {
            "turnInfo": [1, 0, 0, 1]
        }, {
            "origin": "additinal_state",
            "turnInfo": [0, 1, -1, 2]
        }];

        let simulationIntegrator = new SimulationIntegrator(mockActionEventSystem);
        simulationIntegrator.set_replay_data(starting_state);
        simulationIntegrator.add_simulation_result(additinal_state);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_replay_data', complete_state);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_frame', Number.MAX_VALUE);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('play');
    });

    test('should insert addtional_state without the last frame before everything else in the same turn', () => {
        let starting_state = [{
            "turnInfo": [0, 0, -1, 0]
        }, {
            "turnInfo": [1, 0, 0, 1]
        }, {
            "origin": "starting_state",
            "turnInfo": [0, 1, -1, 2]
        }];

        let additinal_state = [{
            "origin": "additinal_state",
            "turnInfo": [0, 0, -1, 0]
        }, {
            "origin": "additinal_state",
            "turnInfo": [1, 0, 0, 1]
        }, {
            "turnInfo": [0, 1, -1, 2]
        }];

        let complete_state = [{
            "origin": "additinal_state",
            "turnInfo": [0, 0, -1, 0]
        }, {
            "origin": "additinal_state",
            "turnInfo": [1, 0, 0, 1]
        }, {
            "turnInfo": [0, 0, -1, 2]
        }, {
            "turnInfo": [1, 0, 0, 3]
        }, {
            "origin": "starting_state",
            "turnInfo": [0, 1, -1, 4]
        }];

        let simulationIntegrator = new SimulationIntegrator(mockActionEventSystem);
        simulationIntegrator.set_replay_data(starting_state);
        simulationIntegrator.add_simulation_result(additinal_state);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_replay_data', complete_state);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_frame', 0);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('play');
    });

    test('should append addtional_state without the first frame after the last frame from the starting_state', () => {
        let starting_state = [{
            "turnInfo": [0, 0, -1, 0]
        }, {
            "turnInfo": [1, 0, 0, 1]
        }, {
            "origin": "starting_state",
            "turnInfo": [0, 1, -1, 2]
        }];

        let additinal_state = [{
            "turnInfo": [0, 1, -1, 0]
        }, {
            "turnInfo": [1, 1, 0, 1]
        }, {
            "origin": "additinal_state",
            "turnInfo": [0, 2, -1, 2]
        }];

        let complete_state = [{
            "turnInfo": [0, 0, -1, 0]
        }, {
            "turnInfo": [1, 0, 0, 1]
        }, {
            "origin": "starting_state",
            "turnInfo": [0, 1, -1, 2]
        }, {
            "turnInfo": [1, 1, 0, 3]
        }, {
            "origin": "additinal_state",
            "turnInfo": [0, 2, -1, 4]
        }];

        let simulationIntegrator = new SimulationIntegrator(mockActionEventSystem);
        simulationIntegrator.set_replay_data(starting_state);
        simulationIntegrator.add_simulation_result(additinal_state);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('set_replay_data', complete_state);
    });
});