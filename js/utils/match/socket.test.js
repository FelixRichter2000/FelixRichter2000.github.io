const Socket = require("./socket");
const { WS } = require("jest-websocket-mock");
let terminalServer;

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

describe('test socket', () => {
    it('should create a WebSocket to the terminalServer and send the init string', async() => {
        new Socket("init_string");
        await terminalServer.nextMessage;
        expect(terminalServer.messages).toEqual(["init_string"]);
    });

    it('should not submit turn before the starting state got returned', async() => {
        let socket = new Socket("init_string");
        socket.submit_actions([]);
        await terminalServer.nextMessage;
        expect(terminalServer.messages).toEqual(["init_string"]);
    });

    it('should submit turn when a message containing p2Units arrived before', async() => {
        let socket = new Socket("init_string");
        terminalServer.send('a [{"make_move_1":33,"make_move_2":34},{}]');
        terminalServer.send('m {"debug":"lots of data"}');
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        await terminalServer.nextMessage;
        socket.submit_actions([1, 2, 3, 4]);
        await terminalServer.nextMessage;
        expect(terminalServer.messages).toEqual(["init_string", [1, 2, 3, 4]]);
    });

    it('should not submit turn when no message containing p2Units arrived before', async() => {
        let socket = new Socket("init_string");
        terminalServer.send('a [{"make_move_1":33,"make_move_2":34},{}]');
        terminalServer.send('m {"debug":"lots of data"}');
        terminalServer.send('m {"p6Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        await terminalServer.nextMessage;
        socket.submit_actions([1, 2, 3, 4]);
        expect(terminalServer.messages).toEqual(["init_string"]);
    });

    it('should wait with submit turn until message containing p2Units arrived', async() => {
        let socket = new Socket("init_string");
        await terminalServer.nextMessage;
        socket.submit_actions([1, 2, 3, 4]);
        terminalServer.send('m {"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0]}');
        await terminalServer.nextMessage;
        expect(terminalServer.messages).toEqual(["init_string", [1, 2, 3, 4]]);
    });

    /*
n[{"game_to_client":0,"player_1_err":1,"player_2_err":2,"game_over":3,"notification":4},{"algo_zip":0},"%7B%22player_1%22%3A%22manual%22%2C%22player_2%22%3A%22manual%22%2C%22p1_use_old_config%22%3Afalse%2C%22p2_use_old_config%22%3Afalse%2C%22start_string%22%3A%22%7B%5C%22p2Units%5C%22%3A%5B%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%5D%2C%5C%22turnInfo%5C%22%3A%5B0%2C12%2C-1%2C843%5D%2C%5C%22p1Stats%5C%22%3A%5B24%2C18%2C6.7%2C114%5D%2C%5C%22p1Units%5C%22%3A%5B%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%5D%2C%5C%22p2Stats%5C%22%3A%5B21%2C5%2C14.2%2C14%5D%2C%5C%22events%5C%22%3A%7B%5C%22selfDestruct%5C%22%3A%5B%5D%2C%5C%22breach%5C%22%3A%5B%5D%2C%5C%22damage%5C%22%3A%5B%5D%2C%5C%22shield%5C%22%3A%5B%5D%2C%5C%22move%5C%22%3A%5B%5D%2C%5C%22spawn%5C%22%3A%5B%5D%2C%5C%22death%5C%22%3A%5B%5D%2C%5C%22attack%5C%22%3A%5B%5D%2C%5C%22melee%5C%22%3A%5B%5D%7D%7D%22%2C%22match_name%22%3A%22%22%2C%22config_id%22%3Anull%2C%22config_type%22%3Anull%7D"]	1000	
a[{"make_move_1":33,"make_move_2":34},{}]	41	
m{"debug":{"printMapString":false,"printTStrings":false,"printActStrings":false,"printHitStrings":false,"printPlayerInputStrings":false,"printBotErrors":true,"printPlayerGetHitStrings":false},"unitInformation":[{"turnsRequiredToRemove":1,"refundPercentage":0.75,"cost1":1.0,"getHitRadius":0.01,"upgrade":{"startHealth":120.0},"unitCategory":0,"display":"Filter","startHealth":60.0,"shorthand":"FF"},{"refundPercentage":0.75,"cost1":4.0,"upgrade":{"shieldBonusPerY":0.3,"shieldRange":7.0,"shieldPerUnit":4.0},"shieldRange":3.5,"shieldPerUnit":3.0,"display":"Encryptor","shorthand":"EF","turnsRequiredToRemove":1,"shieldBonusPerY":0.0,"getHitRadius":0.01,"unitCategory":0,"startHealth":30.0,"shieldDecay":0.0},{"attackDamageWalker":5.0,"attackRange":2.5,"turnsRequiredToRemove":1,"refundPercentage":0.75,"cost1":2.0,"getHitRadius":0.01,"upgrade":{"attackDamageWalker":16.0,"attackRange":3.5,"cost1":4.0},"unitCategory":0,"display":"Destructor","startHealth":75.0,"attackDamageTower":0.0,"shorthand":"DF"},{"attackRange":3.5,"selfDestructDamageTower":15.0,"cost2":1.0,"metalForBreach":1.0,"display":"Ping","selfDestructStepsRequired":5,"shorthand":"PI","playerBreachDamage":1.0,"speed":1.0,"attackDamageWalker":2.0,"getHitRadius":0.01,"unitCategory":1,"selfDestructDamageWalker":15.0,"startHealth":15.0,"selfDestructRange":1.5,"attackDamageTower":2.0},{"attackRange":4.5,"selfDestructDamageTower":5.0,"cost2":3.0,"metalForBreach":1.0,"display":"EMP","selfDestructStepsRequired":5,"shorthand":"EI","playerBreachDamage":1.0,"speed":0.5,"attackDamageWalker":8.0,"getHitRadius":0.01,"unitCategory":1,"selfDestructDamageWalker":5.0,"startHealth":5.0,"selfDestructRange":1.5,"attackDamageTower":8.0},{"attackRange":4.5,"selfDestructDamageTower":40.0,"cost2":1.0,"metalForBreach":1.0,"display":"Scrambler","selfDestructStepsRequired":5,"shorthand":"SI","playerBreachDamage":1.0,"speed":0.25,"attackDamageWalker":20.0,"getHitRadius":0.01,"unitCategory":1,"selfDestructDamageWalker":40.0,"startHealth":40.0,"selfDestructRange":1.5,"attackDamageTower":0.0},{"display":"Remove","shorthand":"RM"},{"display":"Upgrade","shorthand":"UP"}],"timingAndReplay":{"playReplaySave":0,"waitTimeBotMax":40000,"waitTimeManual":1820000,"waitForever":false,"playWaitTimeBotSoft":10000,"waitTimeEndGame":3000,"waitTimeBotSoft":10000,"playWaitTimeBotMax":40000,"replaySave":0,"storeBotTimes":true,"waitTimeStartGame":3000},"resources":{"bitsPerRound":5.0,"coresPerRound":5.0,"startingBits":5.0,"turnIntervalForBitCapSchedule":10,"turnIntervalForBitSchedule":10,"bitRampBitCapGrowthRate":5.0,"bitDecayPerRound":0.25,"roundStartBitRamp":10,"bitGrowthRate":1.0,"startingHP":30.0,"startingCores":40.0,"maxBits":150.0},"seasonCompatibilityModeP2":5,"seasonCompatibilityModeP1":5}	2745	
m{"p2Units":[[],[],[],[],[],[],[],[]],"turnInfo":[0,12,-1,0],"p1Stats":[24.0,18.0,6.7,0],"p1Units":[[],[],[],[],[],[],[],[]],"p2Stats":[21.0,5.0,14.2,0],"events":{"selfDestruct":[],"breach":[],"damage":[],"shield":[],"move":[],"spawn":[],"death":[],"attack":[],"melee":[]}}	275	
m!"[]	5	
m![["PI",4,9]]	14	
m"[["FF",6,7]]	14	
m"[]	4	
m{"p2Units":[[[21,20,60.0,"1"]],[],[],[],[],[],[],[]],"turnInfo":[1,12,0,1],"p1Stats":[24.0,18.0,5.7,271],"p1Units":[[],[],[],[[4,10,15.0,"2"]],[],[],[],[]],"p2Stats":[21.0,4.0,14.2,271],"events":{"selfDestruct":[],"breach":[],"damage":[],"shield":[],"move":[[[4,9],[4,10],[0,0],3,"2",1]],"spawn":[[[21,20],0,"1",2],[[4,9],3,"2",1]],"death":[],"attack":[],"melee":[]}}	370	
m{"p2Units":[[[21,20,60.0,"1"]],[],[],[]
    */
});