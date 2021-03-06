const Socket = require("./socket");
const { WS } = require("jest-websocket-mock");
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();
const StartStringGenerator = require("./start_string_generator");
jest.mock("./start_string_generator");
let mockStartingStringGenerator = new StartStringGenerator();
mockStartingStringGenerator.generate.mockImplementation(_ => 'mocked_init_string');

afterEach(() => {
    jest.clearAllMocks();
});

let terminalServer;
const testing_actions = [
    ['p1_firewalls'],
    ['p1_units'],
    [
        ['p2_firewalls', 0, 0]
    ],
    [
        ['p2_units', 0, 0]
    ]
];
const action_messages = [
    'm!["p1_firewalls"]',
    'm!["p1_units"]',
    'm"[["p2_firewalls",27,27]]',
    'm"[["p2_units",27,27]]'
];
const special_game_state = {
    "p2Units": [],
    "turnInfo": [0, 12, -1, 0]
};

const default_game_state = {
    "events": { "attack": [], "breach": [], "damage": [], "death": [], "melee": [], "move": [], "selfDestruct": [], "shield": [], "spawn": [] },
    "p1Stats": [30, 40, 5, 0],
    "p1Units": [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ],
    "p2Stats": [30, 40, 5, 0],
    "p2Units": [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ],
    "turnInfo": [0, 0, -1, 0]
}


jest.setTimeout(50);
jest.useFakeTimers();

beforeEach(async() => {
    terminalServer = new WS("wss://playground.c1games.com/");
});

afterEach(() => {
    WS.clean();
    jest.clearAllMocks();
});

describe('test ws-mock', () => {
    test('client should receive message from server', async() => {
        const client = new WebSocket("wss://playground.c1games.com/");

        client.onmessage = function(event) {
            expect(event.data).toBe('server_response');
        }

        terminalServer.send("server_response");
    });

    test('server should receive messages from client', async() => {
        const client = new WebSocket("wss://playground.c1games.com/");

        terminalServer.onmessage = function(event) {
            expect(event.data).toBe('client_request');
        }

        client.send("client_request");
    });

    test('multiple clients', async() => {
        const client1 = new WebSocket("wss://playground.c1games.com/");
        const client2 = new WebSocket("wss://playground.c1games.com/");

        client1.send('one');
        client2.send('two');

        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(['one', 'two']);
    });

    test('test send message before connection is established', async() => {
        const client = new WebSocket("wss://playground.c1games.com/");
        client.send("hi");

        terminalServer.onmessage = function(event) {
            expect(event.data).toBe('hi');
        }
    });
});

describe('create socket and set starting state', () => {
    it('should create a WebSocket to the terminalServer and send the init string 3', async() => {
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state();
        expect(mockStartingStringGenerator.generate).toHaveBeenCalledWith(default_game_state);
        expect(mockStartingStringGenerator.generate).toHaveBeenCalledTimes(1);
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string"]);
    });

    it('should not restart the socket when the same gamestate gets set twice(even when the frame is different)', async() => {
        const first_game_state = {
            "p2Units": [],
            "turnInfo": [0, 12, -1, 0]
        };

        const second_game_state = {
            "p2Units": [],
            "turnInfo": [0, 12, -1, 999]
        };

        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(first_game_state);
        socket.set_simulation_game_state(second_game_state);
        expect(mockStartingStringGenerator.generate).toHaveBeenCalledWith(first_game_state);
        expect(mockStartingStringGenerator.generate).toHaveBeenCalledTimes(1);
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string"]);
    });

    it('should create a WebSocket to the terminalServer and send the init string', async() => {
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(special_game_state);
        expect(mockStartingStringGenerator.generate).toHaveBeenCalledWith(special_game_state);
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string"]);
    });

    it('should create a WebSocket to the terminalServer and send another init string', async() => {
        mockStartingStringGenerator.generate.mockReturnValueOnce('another_init_string')
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(special_game_state);
        expect(mockStartingStringGenerator.generate).toHaveBeenCalledWith(special_game_state);
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["another_init_string"]);
    });
});

describe('socket.submit_turn', () => {
    it('should not submit turn before the starting state got returned', async() => {
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(special_game_state);
        jest.runTimersToTime(10);
        socket.set_actions([]);
        socket.simulate();
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string"]);
    });

    it('should submit turn when a message containing p2Units arrived before', async() => {
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(special_game_state);
        terminalServer.send('a [{"make_move_1":33,"make_move_2":34},{}]');
        terminalServer.send('m {"debug":"lots of data"}');
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        socket.set_actions(testing_actions);
        socket.simulate();
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string", ...action_messages]);
    });

    it('should not submit turn when no message containing p2Units arrived before', async() => {
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(special_game_state);
        terminalServer.send('a [{"make_move_1":33,"make_move_2":34},{}]');
        terminalServer.send('m {"debug":"lots of data"}');
        terminalServer.send('m {"p6Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        socket.set_actions(testing_actions);
        socket.simulate();
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string"]);
    });

    it('should wait with submit turn until message containing p2Units arrived', async() => {
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(special_game_state);
        jest.runTimersToTime(10);
        socket.set_actions(testing_actions);
        socket.simulate();
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string", ...action_messages]);
    });

    it('should return an array of all replay frames (deserialized) in object form', async() => {
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(special_game_state);
        jest.runTimersToTime(10);
        socket.set_actions(testing_actions);
        socket.simulate();
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,0,0]}'); //frames 0, 1, 2, 3, ...
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,1,0]}');
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,2,0]}');
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,3,0]}');
        terminalServer.send('m {"p2Units":[],"turnInfo":[0,13,-1,0]}'); //end_state -1
        jest.runTimersToTime(10);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('add_simulation_result', [{
            "p2Units": [],
            "turnInfo": [0, 12, -1, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 12, 0, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 12, 1, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 12, 2, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 12, 3, 0]
        }, {
            "p2Units": [],
            "turnInfo": [0, 13, -1, 0]
        }]);
    });

    it('should return an array of all replay frames (deserialized) in object form when one message arrives that has a turnInfo[2] of -1', async() => {
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(special_game_state);
        jest.runTimersToTime(10);
        socket.set_actions(testing_actions);
        socket.simulate();
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,0,0]}'); //frames 0, 1, 2, 3, ...
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,1,0]}');
        terminalServer.send('m {"p2Units":[],"turnInfo":[0,13,-1,0]}'); //end_state -1
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,2,0]}'); //ignore following...
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,3,0]}');
        jest.runTimersToTime(10);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('add_simulation_result', [{
            "p2Units": [],
            "turnInfo": [0, 12, -1, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 12, 0, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 12, 1, 0]
        }, {
            "p2Units": [],
            "turnInfo": [0, 13, -1, 0]
        }]);
    });

    it('should close and reopen the socket after all turn messages were received', async() => {
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(special_game_state);
        jest.runTimersToTime(10);
        socket.set_actions(testing_actions);
        socket.simulate();
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,0,0]}'); //frames 0, 1, 2, 3, ...
        terminalServer.send('m {"p2Units":[],"turnInfo":[0,13,-1,0]}'); //end_state -1
        jest.runTimersToTime(10);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('add_simulation_result', [{
            "p2Units": [],
            "turnInfo": [0, 12, -1, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 12, 0, 0]
        }, {
            "p2Units": [],
            "turnInfo": [0, 13, -1, 0]
        }]);
        expect(terminalServer.messages).toEqual(["mocked_init_string", ...action_messages, "mocked_init_string"]);
    });

    it('submit actions multiple times', async() => {
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(special_game_state);
        jest.runTimersToTime(10);
        socket.set_actions(testing_actions);
        socket.simulate();
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,0,0]}'); //frames 0, 1, 2, 3, ...
        terminalServer.send('m {"p2Units":[],"turnInfo":[0,13,-1,0]}'); //end_state -1
        jest.runTimersToTime(10);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('add_simulation_result', [{
            "p2Units": [],
            "turnInfo": [0, 12, -1, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 12, 0, 0]
        }, {
            "p2Units": [],
            "turnInfo": [0, 13, -1, 0]
        }]);

        let second_retured_actions = socket.set_actions(testing_actions);
        socket.simulate();
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,15,0,0]}'); //frames 0, 1, 2, 3, ...
        terminalServer.send('m {"p2Units":[],"turnInfo":[0,16,-1,0]}'); //end_state -1
        jest.runTimersToTime(10);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('add_simulation_result', [{
            "p2Units": [],
            "turnInfo": [0, 12, -1, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 15, 0, 0]
        }, {
            "p2Units": [],
            "turnInfo": [0, 16, -1, 0]
        }]);
        expect(terminalServer.messages).toEqual(["mocked_init_string", ...action_messages, "mocked_init_string", ...action_messages, "mocked_init_string"]);
    });

    it('should stop waiting when the endStats were sent', () => {
        let socket = new Socket(mockActionEventSystem, mockStartingStringGenerator);
        socket.set_simulation_game_state(special_game_state);
        jest.runTimersToTime(10);
        socket.set_actions(testing_actions);
        socket.simulate();
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,0,0]}'); //frames 0, 1
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,1,0]}'); //
        terminalServer.send('m {"p2Units":[],"turnInfo":[2,12,1,0], "endStats":{}}'); //endStats
        jest.runTimersToTime(10);
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith('add_simulation_result', [{
            "p2Units": [],
            "turnInfo": [0, 12, -1, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 12, 0, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 12, 1, 0]
        }, {
            "p2Units": [],
            "turnInfo": [0, 13, -1, 0],
            "endStats": {}
        }]);
        expect(terminalServer.messages).toEqual(["mocked_init_string", ...action_messages, "mocked_init_string"]);
    });
});