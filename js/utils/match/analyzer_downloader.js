class AnalyzorDownloader {
    constructor(attacks_manager) {
        this.content = null;
        this.switched = false;
        this.replay_data = [];
        this.attacks_manager = attacks_manager;
        this.replay_data = [{p0: [], p1:[]}];
    }

    switch_view() {
        this.switched = !this.switched;
    }

    set_replay_data(data) {
        this.replay_data = data;
    }

    download_layout() {
        let data = {
            firewalls: this.replay_data[0][`p${+ this.switched}`],
            attacks: this.attacks_manager.attacks[+this.switched],
        }

        if (this.switched) {
            data.firewalls.forEach(e => this._flip_location(e));
            data.attacks.forEach(a => a.forEach(e => this._flip_location(e)));
        }

        data = JSON.stringify(data);
        this._executeDownload(data, 'layout');
    }

    _flip_location(entry) {
        entry[0][0] = 27 - entry[0][0];
        entry[0][1] = 27 - entry[0][1];
    }

    _executeDownload(content, ending) {
        var el = document.createElement('a');
        el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        el.setAttribute('download', Date.now()) + '.' + ending;
        el.style.display = 'none';
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    }
}

if (typeof process !== 'undefined')
    module.exports = AnalyzorDownloader;