class ReplayDownloader {
    constructor(actionEventSystem, fetch = window.fetch_string) {
        this.actionEventSystem = actionEventSystem;
        this._fetch = fetch;
    }

    async download(match_id) {
        let request = 'https://terminal.c1games.com/api/game/replayexpanded/' + match_id;
        await this._fetch(request)
            .then(result => this.handle_result(result));
        return this;
    }

    handle_result(result) {
        this.raw = result;
        let allLines = this.parse_file(result);
        this.config = allLines[0];
        this.replay = allLines.slice(1);

        this._fix_last_frame_turnInfo();

        this.actionEventSystem.release_event('set_replay_data_raw', this.replay);
        this.actionEventSystem.release_event('set_config', this.config);
        this.actionEventSystem.release_event('set_replay_raw', this.raw);
    }

    _fix_last_frame_turnInfo() {
        this.replay[this.replay.length - 1].turnInfo[0] = 0;
        this.replay[this.replay.length - 1].turnInfo[1] += 1;
        this.replay[this.replay.length - 1].turnInfo[2] = -1;
        this.replay[this.replay.length - 1].turnInfo[3] += 1;
    }

    parse_file(file) {
        return file.split("\n")
            .filter(el => el)
            .map(el => JSON.parse(el));
    }
}

if (typeof process !== 'undefined')
    module.exports = ReplayDownloader;