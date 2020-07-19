class UserDataDownloader {
    constructor(actionEventSystem, fetch_json = window.fetch_json) {
        this.actionEventSystem = actionEventSystem;
        this.fetch_json = fetch_json;
    }

    async download(match_id) {
        let request = `https://terminal.c1games.com/api/game/match/${match_id}/algos`;
        await this.fetch_json(request).then(result => this.handle_result(result));
        return this;
    }

    handle_result(result) {
        let userData = this._transformUserData(result);
        this.actionEventSystem.release_event('update_view', userData);
    }

    _transformUserData(result) {
        let names = Object.getOwnPropertyNames(result.data.algos[0]);
        return names
            .map(element => result.data.algos
                .reduce((a, algo) => [...a, algo[element]], []))
            .reduce((a, values, index) => ({...a, [names[index]]: values }), {});
    }
}

if (typeof process !== 'undefined')
    module.exports = UserDataDownloader;