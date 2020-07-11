class Controller {
    constructor(matchViewer) {
        this.matchViewer = matchViewer;
        this.replayData = [];
    }

    setReplayData(replayData) {
        this.replayData = replayData;
    }

    showFrame(frame) {
        if (this._isFrameValid(frame))
            return this._showFrameUsingMatchViewer(frame);
    }

    _showFrameUsingMatchViewer(frame) {
        return this.matchViewer.show_data(this.replayData[frame]);
    }

    _isFrameValid(frame) {
        return frame >= 0 && frame < this.replayData.length;
    }
}

if (typeof process !== 'undefined') {
    module.exports = Controller;
}