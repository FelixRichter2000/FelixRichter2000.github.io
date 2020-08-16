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
        this.current_game_state = null;
        this.should_submit = false;
    }

    set_simulation_game_state(game_state) {
        let new_game_state = game_state || this.default_game_state;
        if (this._is_new_game_state_different(new_game_state)) {
            this.current_game_state = new_game_state;
            this._restart_socket();
        }
    }

    set_actions(actions) {
        this.actions = actions.map((e, i) => {
            if (i > 1) {
                return e.map(a => [a[0], 27 - a[1], 27 - a[2]]);
            }
            return e;
        });
    }

    simulate() {
        this.should_submit = true;
        this._submit_if_possible();
    }

    _is_new_game_state_different(new_game_state) {
        if (!this.current_game_state)
            return true;
        return this._deep_comparison_excluding_turnInfo_frame(new_game_state);
    }

    _deep_comparison_excluding_turnInfo_frame(new_game_state) {
        let cloned_states = [JSON.parse(JSON.stringify(this.current_game_state)), JSON.parse(JSON.stringify(new_game_state))];
        cloned_states.forEach(e => e.turnInfo[3] = 0);
        return JSON.stringify(cloned_states[0]) !== JSON.stringify(cloned_states[1]);
    }

    _restart_socket() {
        this._reset_properties();
        let starting_string = this.startingStringGenerator.generate(this.current_game_state);
        this._open_socket(starting_string);
    }

    _open_socket(init_string) {
        this.init_string = init_string || this.init_string;
        if (this.socket)
            this.socket.close();
        this.socket = new WebSocket("wss://playground.c1games.com/");
        this.socket.onopen = (_ => this._initialize_socket()).bind(this);
        this.socket.onmessage = (message => this._handle_message(message)).bind(this);
    }

    _initialize_socket() {
        this.connected = true;
        return this.socket.send(this.init_string);
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
        if (this._is_endStats(parsed_message))
            this._fix_last_frame_turnInfo(parsed_message)
        this._add_to_all_messages(parsed_message);
        if (this._is_end_of_turn(parsed_message) || this._is_endStats(parsed_message))
            this._resolve_promise();
    }

    _fix_last_frame_turnInfo(last_frame) {
        last_frame.turnInfo[0] = 0;
        last_frame.turnInfo[1] += 1;
        last_frame.turnInfo[2] = -1;
    }

    _is_endStats(parsed_message) {
        return parsed_message.endStats;
    }

    _parse_message(message) {
        return JSON.parse(message.data.substring(2));
    }

    _add_to_all_messages(parsed) {
        this.all_messages.push(parsed);
    }

    _is_message_relevant(message) {
        return message.data[0] === 'm' && message.data[4] !== 'd';
    }

    _resolve_promise() {
        const complete_turn_data = [JSON.parse(JSON.stringify(this.current_game_state)), ...JSON.parse(JSON.stringify(this.all_messages))];
        this.actionEventSystem.release_event('add_simulation_result', complete_turn_data);
        this._reset_properties();
        this._open_socket();
    }

    _reset_properties() {
        this.all_messages = [];
        this.submit_enabled = false;
        this.has_submitted = false;
        this.connected = false;
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
        this.actions = null;
        this.should_submit = false;
    }

    _create_messages() {
        return this.prefixes.map((prefix, i) => prefix + JSON.stringify(this.actions[i]));
    }

    _can_submit() {
        return this.submit_enabled && this.actions && this.connected && this.should_submit;
    }
}


if (typeof process !== 'undefined')
    module.exports = Socket;