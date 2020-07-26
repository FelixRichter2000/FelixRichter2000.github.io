const ConditionalEventForwarder = require("./conditional_event_forwarder");
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

afterEach(() => {
    jest.clearAllMocks();
});

describe('ConditionalEventForwarder', () => {
    it('should forward the event when the condition is true', () => {
        let condition = event => event.valid;
        let conditionalEventForwarder = new ConditionalEventForwarder(mockActionEventSystem, 'doIt', condition, 'doItAfter');

        let data = { valid: true };
        conditionalEventForwarder.doIt(data);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('doItAfter', data);
    });

    it('should not forward the event when the condition is false', () => {
        let condition = event => event.valid;
        let conditionalEventForwarder = new ConditionalEventForwarder(mockActionEventSystem, 'doIt', condition, 'doItAfter');

        let data = { valid: false };
        conditionalEventForwarder.doIt(data);

        expect(mockActionEventSystem.release_event).toHaveBeenCalledTimes(0);
    });
});