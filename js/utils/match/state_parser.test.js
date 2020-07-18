const StateParser = require("./state_parser");
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

describe('test StateParser', () => {
    test('create StateParser', () => {
        new StateParser(mockActionEventSystem);
    });

    test('update_data should parse the data and send an update_view event with the parsed data', () => {
        let stateParser = new StateParser(mockActionEventSystem);

        const input_data = {
            p1Stats: ['health1', 'cores1', 'bits1', 'ms1'],
            p2Stats: ['health2', 'cores2', 'bits2', 'ms2'],
            turnInfo: ['turnType', 'turnNumber', 'actionPhaseFrameNumber', 'totalFrameNumber']
        }

        const expected_output_data = {
            health: ['health1', 'health2'],
            core: ['cores1', 'cores2'],
            bit: ['bits1', 'bits2'],
            ms: ['ms1', 'ms2'],
            turn_type: ['turnType'],
            turn_number: ['turnNumber'],
            action_phase_frame_number: ['actionPhaseFrameNumber'],
            total_frame_number: ['totalFrameNumber']
        }

        stateParser.update_frame_data(input_data);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('update_view', expected_output_data);
    });
});