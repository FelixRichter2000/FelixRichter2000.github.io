class Socket {

    constructor(actionEventSystem, startingStringGenerator) {
        this.actionEventSystem = actionEventSystem;
        this.startingStringGenerator = startingStringGenerator;
        this.prefixes = ['m!', 'm!', 'm"', 'm"'];
        this.all_messages = [];
        this.default_game_state = {
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
            "turnInfo": [0, 0, -1, 0],
            "p1Stats": [30.0, 40.0, 5.0, 0],
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
            "p2Stats": [30.0, 40.0, 5.0, 0],
            "events": { "selfDestruct": [], "breach": [], "damage": [], "shield": [], "move": [], "spawn": [], "death": [], "attack": [], "melee": [] }
        };
    }

    set_simulation_game_state(game_state) {
        let starting_string = this.startingStringGenerator.generate(game_state || this.default_game_state);
        this._open_socket(starting_string);
    }

    submit_actions(actions) {
        this.actions = actions;
        this._submit_if_possible();
    }

    _open_socket(init_string) {
        this.init_string = init_string || this.init_string;
        if (this.socket)
            this.socket.close();
        this.socket = new WebSocket("wss://playground.c1games.com/");
        this.socket.onopen = (_ => this.socket.send(this.init_string)).bind(this);
        this.socket.onmessage = (message => this._handle_message(message)).bind(this);
    }

    _handle_message(message) {
        if (this._is_message_relevant(message))
            this._use_message(message);
    }

    _use_message(message) {
        let parsed_message = this._parse_message(message);

        if (!this.has_submitted)
            this._handle_early_message(parsed_message);
        else
            this._handle_turn_message(parsed_message);
    }

    _handle_early_message(parsed_message) {
        if (this._is_message_starting_state(parsed_message))
            this._enable_any_try_to_submit();
    }

    _enable_any_try_to_submit() {
        this.submit_enabled = true;
        this._submit_if_possible();
    }

    _is_message_starting_state(parsed_message) {
        return parsed_message.p2Units && parsed_message.turnInfo[0] === 0;
    }

    _handle_turn_message(parsed_message) {
        this._add_to_all_messages(parsed_message);
        if (this._is_end_of_turn(parsed_message))
            this._resolve_promise();
    }

    _parse_message(message) {
        return JSON.parse(message.data.substring(2));
    }

    _add_to_all_messages(parsed) {
        this.all_messages.push(parsed);
    }

    _is_message_relevant(message) {
        return message.data[0] === 'm';
    }

    _resolve_promise() {
        this.actionEventSystem.release_event('add_simulation_result', JSON.parse(JSON.stringify(this.all_messages)))
        this._reset_properties();
        this._open_socket();
    }

    _reset_properties() {
        this.all_messages = [];
        this.submit_enabled = false;
        this.has_submitted = false;
        this.actions = null;
    }

    _is_end_of_turn(parsed) {
        return parsed.turnInfo[2] == -1;
    }

    _submit_if_possible() {
        if (this._can_submit())
            this._submit();
    }

    _submit() {
        this._create_messages()
            .forEach(e => this.socket.send(e));
        this.has_submitted = true;
    }

    _create_messages() {
        return this.prefixes.map((prefix, i) => prefix + JSON.stringify(this.actions[i]));
    }

    _can_submit() {
        return this.submit_enabled && this.actions;
    }
}


if (typeof process !== 'undefined')
    module.exports = Socket;