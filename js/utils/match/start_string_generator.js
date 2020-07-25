class StartStringGenerator {
    constructor() {
        this.startString = 'n[{"game_to_client":0,"player_1_err":1,"player_2_err":2,"game_over":3,"notification":4},{"algo_zip":0},"';
        this.endString = '"]';
    }

    generate(game_state) {
        let gameStateString = this._createGameStateString(game_state);
        return this.startString + gameStateString + this.endString;
    }

    _createGameStateString(game_state) {
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
}


if (typeof process !== 'undefined')
    module.exports = StartStringGenerator;