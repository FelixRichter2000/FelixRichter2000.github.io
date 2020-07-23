class Socket {
    constructor(init_string) {
        let self = this;
        this.socket = new WebSocket("wss://playground.c1games.com/");
        this.socket.onopen = function() {
            self.socket.send(init_string);
        };
        this.socket.onmessage = function(message) {
            if (message.data[0] === 'm') {
                let parsed = JSON.parse(message.data.substring(2));
                if (parsed.p2Units) {
                    self.flag = true;
                    self._try_submit();
                }
            }
        };
    }

    submit_actions(actions) {
        this.actions = actions;
        this._try_submit();
    }

    _try_submit() {
        if (this.flag && this.actions)
            this.socket.send(this.actions);
    }
}


if (typeof process !== 'undefined')
    module.exports = Socket;