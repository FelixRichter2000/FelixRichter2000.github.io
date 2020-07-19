class Downloader {
    constructor() {
        this.filename = null;
        this.content = null;
    }
    download_to_client() {
        if (this._isReadyForDownload())
            this._executeDownload();
    }

    _executeDownload() {
        var el = document.createElement('a');
        el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.content));
        el.setAttribute('download', this.filename);
        el.style.display = 'none';
        document.body.appendChild(el);
        el.click();
        document.body.removeChild(el);
    }

    _isReadyForDownload() {
        return this.filename && this.content;
    }
}

if (typeof process !== 'undefined')
    module.exports = Downloader;