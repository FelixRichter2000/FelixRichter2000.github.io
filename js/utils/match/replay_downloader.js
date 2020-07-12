class ReplayDownloader {
    constructor(fetch_json = window.fetch_json) {
        this.fetch_json = fetch_json;
    }

    async download(match_id) {
        let request = 'https://terminal.c1games.com/api/game/replayexpanded/' + match_id;
        await this.fetch_json(request).then(result => this.handle_result(result));
        return this;
    }

    handle_result(result) {
        let allLines = this.parse_file(result);
        this.config = allLines[0];
        this.replay = allLines.slice(1, -1);
    }

    parse_file(file) {
        return file.split("\n")
            .filter(el => el)
            .map(el => JSON.parse(el));
    }
}

if (typeof process !== 'undefined') {
    module.exports = ReplayDownloader;
}