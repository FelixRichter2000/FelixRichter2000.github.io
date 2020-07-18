const ActionEventSystem = require('./action_event_system');

describe('test action_event_system', () => {
    test('create action_event_system ', () => {
        new ActionEventSystem();
    });

    test('register', () => {
        let eventSystem = new ActionEventSystem();
        eventSystem.register({});
    });

    test('release event', () => {
        let eventSystem = new ActionEventSystem();
        eventSystem.release_event('eventName', 'parameter');
    });

    test('register and don`t listen on wrong names', () => {
        let eventSystem = new ActionEventSystem();
        let testEventListener = jest.fn();
        eventSystem.register({ testEvent: testEventListener });
        eventSystem.release_event('unknownName', 'param');
        expect(testEventListener).not.toHaveBeenCalled();
    });

    test('register and listen on the correct name', () => {
        let eventSystem = new ActionEventSystem();
        let testEventListener = jest.fn();
        eventSystem.register({ myFunction: testEventListener });
        eventSystem.release_event('myFunction', 'param');
        expect(testEventListener).toHaveBeenCalledWith('param');
    });

    test('register multiple and listen on the correct name', () => {
        let eventSystem = new ActionEventSystem();
        let mockMyFunction = jest.fn();
        let mockMySecondFunction = jest.fn();
        eventSystem.register({ myFunction: mockMyFunction, secondFunction: mockMySecondFunction });

        eventSystem.release_event('myFunction', 'param');
        expect(mockMyFunction).toHaveBeenCalledWith('param');

        eventSystem.release_event('secondFunction', 'p2');
        expect(mockMySecondFunction).toHaveBeenCalledWith('p2');
    });

    test('prevent registering the same thing twice', () => {
        let eventSystem = new ActionEventSystem();
        let mockMyFunction = jest.fn();
        let subSystem = { myFunction: mockMyFunction };
        eventSystem.register(subSystem);
        eventSystem.register(subSystem);

        eventSystem.release_event('myFunction', 'param');
        expect(mockMyFunction).toHaveBeenCalledWith('param');
        expect(mockMyFunction).toHaveBeenCalledTimes(1);
    });

    test('register multiple different subsystems', () => {
        let eventSystem = new ActionEventSystem();

        let mockMyFunction = jest.fn();
        let mockMySecondFunction = jest.fn();
        eventSystem.register({ myFunction: mockMyFunction, secondFunction: mockMySecondFunction });

        let mockMyFunction2 = jest.fn();
        eventSystem.register({ myFunction: mockMyFunction2 });

        eventSystem.release_event('myFunction', 'param');
        expect(mockMyFunction).toHaveBeenCalledWith('param');
        expect(mockMyFunction2).toHaveBeenCalledWith('param');

        eventSystem.release_event('secondFunction', 'p2');
        expect(mockMySecondFunction).toHaveBeenCalledWith('p2');
    });

    test('register follow up event', () => {
        let eventSystem = new ActionEventSystem();

        eventSystem.registerFollowUpEvent('triggerEventName', 'followUpEventName');

        let mockMyFunction = jest.fn();
        let mockMySecondFunction = jest.fn();
        eventSystem.register({ triggerEventName: mockMyFunction, followUpEventName: mockMySecondFunction });

        eventSystem.release_event('triggerEventName', 'param');
        expect(mockMyFunction).toHaveBeenCalledWith('param');
        expect(mockMySecondFunction).toHaveBeenCalledWith('param');
    });
});