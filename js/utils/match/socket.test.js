const Socket = require("./socket");
const { WS } = require("jest-websocket-mock");
const StartStringGenerator = require("./start_string_generator");
jest.mock("./start_string_generator");
let mockStartingStringGenerator = new StartStringGenerator();
mockStartingStringGenerator.generate.mockImplementation(_ => 'mocked_init_string');

let terminalServer;
const testing_actions = [
    ['p1_firewalls'],
    ['p1_units'],
    ['p2_firewalls'],
    ['p2_units']
];
const action_messages = [
    'm!["p1_firewalls"]',
    'm!["p1_units"]',
    'm"["p2_firewalls"]',
    'm"["p2_units"]'
];
const default_game_state = {
    "p2Units": [],
    "turnInfo": [0, 12, -1, 0]
};


jest.setTimeout(40);
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
});

describe('create socket and set starting state', () => {
    it('should create a WebSocket to the terminalServer and send the init string', async() => {
        let socket = new Socket(mockStartingStringGenerator);
        socket.set_game_state(default_game_state);
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string"]);
    });

    it('should create a WebSocket to the terminalServer and send another init string', async() => {
        mockStartingStringGenerator.generate.mockReturnValueOnce('another_init_string')
        let socket = new Socket(mockStartingStringGenerator);
        socket.set_game_state(default_game_state);
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["another_init_string"]);
    });
});

describe('socket.submit_turn', () => {
    it('should not submit turn before the starting state got returned', async() => {
        let socket = new Socket(mockStartingStringGenerator);
        socket.set_game_state(default_game_state);
        jest.runTimersToTime(10);
        socket.submit_actions([]);
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string"]);
    });

    it('should submit turn when a message containing p2Units arrived before', async() => {
        let socket = new Socket(mockStartingStringGenerator);
        socket.set_game_state(default_game_state);
        terminalServer.send('a [{"make_move_1":33,"make_move_2":34},{}]');
        terminalServer.send('m {"debug":"lots of data"}');
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        socket.submit_actions(testing_actions);
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string", ...action_messages]);
    });

    it('should not submit turn when no message containing p2Units arrived before', async() => {
        let socket = new Socket(mockStartingStringGenerator);
        socket.set_game_state(default_game_state);
        terminalServer.send('a [{"make_move_1":33,"make_move_2":34},{}]');
        terminalServer.send('m {"debug":"lots of data"}');
        terminalServer.send('m {"p6Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        socket.submit_actions(testing_actions);
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string"]);
    });

    it('should wait with submit turn until message containing p2Units arrived', async() => {
        let socket = new Socket(mockStartingStringGenerator);
        socket.set_game_state(default_game_state);
        jest.runTimersToTime(10);
        socket.submit_actions(testing_actions);
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string", ...action_messages]);
    });

    it('should return an array of all replay frames (deserialized) in object form', async() => {
        let socket = new Socket(mockStartingStringGenerator);
        socket.set_game_state(default_game_state);
        jest.runTimersToTime(10);
        let retured_actions = socket.submit_actions(testing_actions);
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,0,0]}'); //frames 0, 1, 2, 3, ...
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,1,0]}');
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,2,0]}');
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,3,0]}');
        terminalServer.send('m {"p2Units":[],"turnInfo":[0,13,-1,0]}'); //end_state -1
        return retured_actions.then(a => expect(a).toEqual([{
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
        }]));
    });

    it('should return an array of all replay frames (deserialized) in object form when one message arrives that has a turnInfo[2] of -1', async() => {
        let socket = new Socket(mockStartingStringGenerator);
        socket.set_game_state(default_game_state);
        jest.runTimersToTime(10);
        let retured_actions = socket.submit_actions(testing_actions);
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,0,0]}'); //frames 0, 1, 2, 3, ...
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,1,0]}');
        terminalServer.send('m {"p2Units":[],"turnInfo":[0,13,-1,0]}'); //end_state -1
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,2,0]}'); //ignore following...
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,3,0]}');
        return retured_actions.then(a => expect(a).toEqual([{
            "p2Units": [],
            "turnInfo": [1, 12, 0, 0]
        }, {
            "p2Units": [],
            "turnInfo": [1, 12, 1, 0]
        }, {
            "p2Units": [],
            "turnInfo": [0, 13, -1, 0]
        }]));
    });

    it('should close and reopen the socket after all turn messages were received', async() => {
        let socket = new Socket(mockStartingStringGenerator);
        socket.set_game_state(default_game_state);
        jest.runTimersToTime(10);
        let retured_actions = socket.submit_actions(testing_actions);
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,0,0]}'); //frames 0, 1, 2, 3, ...
        terminalServer.send('m {"p2Units":[],"turnInfo":[0,13,-1,0]}'); //end_state -1
        await retured_actions.then(a => expect(a).toEqual([{
            "p2Units": [],
            "turnInfo": [1, 12, 0, 0]
        }, {
            "p2Units": [],
            "turnInfo": [0, 13, -1, 0]
        }]));
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["mocked_init_string", ...action_messages, "mocked_init_string"]);
    });

    it('submit actions multiple times', async() => {
        let socket = new Socket(mockStartingStringGenerator);
        socket.set_game_state(default_game_state);
        jest.runTimersToTime(10);
        let retured_actions = socket.submit_actions(testing_actions);
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,12,0,0]}'); //frames 0, 1, 2, 3, ...
        terminalServer.send('m {"p2Units":[],"turnInfo":[0,13,-1,0]}'); //end_state -1
        await retured_actions.then(a => expect(a).toEqual([{
            "p2Units": [],
            "turnInfo": [1, 12, 0, 0]
        }, {
            "p2Units": [],
            "turnInfo": [0, 13, -1, 0]
        }]));
        jest.runTimersToTime(10);
        retured_actions = socket.submit_actions(testing_actions);
        jest.runTimersToTime(10);
        terminalServer.send('m {"p2Units":[],"turnInfo":[1,15,0,0]}'); //frames 0, 1, 2, 3, ...
        terminalServer.send('m {"p2Units":[],"turnInfo":[0,16,-1,0]}'); //end_state -1
        await retured_actions.then(a => expect(a).toEqual([{
            "p2Units": [],
            "turnInfo": [1, 15, 0, 0]
        }, {
            "p2Units": [],
            "turnInfo": [0, 16, -1, 0]
        }]));
        expect(terminalServer.messages).toEqual(["mocked_init_string", ...action_messages, "mocked_init_string", ...action_messages]);
    });
});