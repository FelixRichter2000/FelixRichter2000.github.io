class Controller {
    constructor(matchViewer) {
        this.matchViewer = matchViewer;
        this.replayData = [];
    }

    setReplayData(replayData) {
        this.replayData = replayData;
    }

    showFrame(frame) {
        if (this.isFrameValid(frame))
            return this.showFrameUsingMatchViewer(frame);
    }

    showFrameUsingMatchViewer(frame) {
        return this.matchViewer.show_data(this.replayData[frame]);
    }

    isFrameValid(frame) {
        return frame >= 0 && frame < this.replayData.length;
    }
}

if (typeof process !== 'undefined') {
    module.exports = Controller;
}