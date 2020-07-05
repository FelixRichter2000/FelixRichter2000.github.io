class TerminalWsHandler {
    startString = 'n[{"game_to_client":0,"player_1_err":1,"player_2_err":2,"game_over":3,"notification":4},{"algo_zip":0},"';
    endString = '"]';

    get_replay_turn_actions(current_state, input_actions) {
        console.log(new Date());
        return this.socket(this.build_init_string(game_state))
    }

    build_init_string(game_state) {
        let gameStateString = this.createGameStateString(game_state);
        return this.startString + gameStateString + this.endString;
    }

    createGameStateString(game_state) {
        return encodeURIComponent(JSON.stringify({
            "player_1": "manual",
            "player_2": "manual",
            "p1_use_old_config": false,
            "p2_use_old_config": false,
            "start_string": JSON.stringify(game_state),
            "match_name": "",
            "config_id": null,
            "config_type": null
        }));
    }

    socket(init_string, timeout = 10000) {
        return new Promise((resolve, reject) => {
            let timer;

            let messages = [];

            //create socket
            let socket = new WebSocket("wss://playground.c1games.com/");

            socket.onopen = function(e) {
                socket.send(init_string)
            }

            let initialTurnMinusOne = true;

            socket.onmessage = function(event) {

                if (event.data[0] == 'm') {
                    let data = JSON.parse(event.data.substring(2));

                    if (data.turnInfo == undefined) return;

                    //console.log(data);

                    let turnInfo = data.turnInfo[2];


                    if (turnInfo == -1) {
                        if (initialTurnMinusOne) {
                            initialTurnMinusOne = false;

                            console.log(new Date());

                            //send commands for first turn
                            socket.send('m!"[]') //p1 firewalls
                            socket.send('m![["PI",4,9]]') //p1 information
                            socket.send('m"[["FF",6,7]]') //p2 firewalls
                            socket.send('m"[]') //p2 information

                        } else {
                            messages.push(data);

                            socket.onclose = function() {}; // disable onclose handler first
                            socket.close();
                            resolve(messages);
                            clearTimeout(timer);
                        }
                    } else {
                        messages.push(data);

                    }
                }
            };


            // set timeout so if a response is not received within a 
            // reasonable amount of time, the promise will reject
            timer = setTimeout(() => {
                reject(new Error("timeout waiting for msg"));

                socket.onclose = function() {}; // disable onclose handler first
                socket.close();
            }, timeout);

        });


    }

}

let game_state = {
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
    "turnInfo": [0, 12, -1, 843],
    "p1Stats": [24, 18, 6.7, 114],
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
    "p2Stats": [21, 5, 14.2, 14],
    "events": { "selfDestruct": [], "breach": [], "damage": [], "shield": [], "move": [], "spawn": [], "death": [], "attack": [], "melee": [] }
};


let input_actions = [
    'm!"[]', //p1 firewalls
    'm![["PI",4,9],["SI",11,2]]', //p1 information
    'm"[["FF",6,7]]', //p2 firewalls
    'm"[]' //p2 information
]


new TerminalWsHandler()
    .get_replay_turn_actions(game_state, input_actions)
    .then(message => {
        // you can use message here and only in here
        console.log(message)
        console.log(new Date());
    })
    .catch(e => console.log(e));