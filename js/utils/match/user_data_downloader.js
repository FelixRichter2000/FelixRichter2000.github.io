class UserDataDownloader {
    constructor(fetch_json = window.fetch_json) {
        this.fetch_json = fetch_json;
    }

    async download(match_id) {
        let request = `https://terminal.c1games.com/api/game/match/${match_id}/algos`;
        await this.fetch_json(request).then(result => this.handle_result(result));
        return this;
    }

    handle_result(result) {
        this.algos = result.data.algos;
    }
}

if (typeof process !== 'undefined')
    module.exports = UserDataDownloader;