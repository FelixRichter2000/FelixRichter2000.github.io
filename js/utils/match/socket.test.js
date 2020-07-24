const Socket = require("./socket");
const { WS } = require("jest-websocket-mock");
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

jest.setTimeout(20);
jest.useFakeTimers();

beforeEach(() => {
    terminalServer = new WS("wss://playground.c1games.com/");
});

afterEach(() => {
    terminalServer.close();
    jest.clearAllMocks();
    WS.clean();
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
});

describe('create socket', () => {
    it('should create a WebSocket to the terminalServer and send the init string', async() => {
        new Socket("init_string");
        jest.runTimersToTime(10);
        await terminalServer.nextMessage;
        expect(terminalServer.messages).toEqual(["init_string"]);
    });
});

describe('socket.submit_turn', () => {
    it('should not submit turn before the starting state got returned', async() => {
        let socket = new Socket("init_string");
        socket.submit_actions([]);
        jest.runTimersToTime(10);
        await terminalServer.nextMessage;
        expect(terminalServer.messages).toEqual(["init_string"]);
    });

    it('should submit turn when a message containing p2Units arrived before', async() => {
        let socket = new Socket("init_string");
        terminalServer.send('a [{"make_move_1":33,"make_move_2":34},{}]');
        terminalServer.send('m {"debug":"lots of data"}');
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        socket.submit_actions(testing_actions);
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["init_string", ...action_messages]);
    });

    it('should not submit turn when no message containing p2Units arrived before', async() => {
        let socket = new Socket("init_string");
        terminalServer.send('a [{"make_move_1":33,"make_move_2":34},{}]');
        terminalServer.send('m {"debug":"lots of data"}');
        terminalServer.send('m {"p6Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        socket.submit_actions(testing_actions);
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["init_string"]);
    });

    it('should wait with submit turn until message containing p2Units arrived', async() => {
        let socket = new Socket("init_string");
        jest.runTimersToTime(10);
        socket.submit_actions(testing_actions);
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        jest.runTimersToTime(10);
        expect(terminalServer.messages).toEqual(["init_string", ...action_messages]);
    });

    it('should return an array of all replay frames (deserialized) in object form', async() => {
        let socket = new Socket("init_string");
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
        let socket = new Socket("init_string");
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
});