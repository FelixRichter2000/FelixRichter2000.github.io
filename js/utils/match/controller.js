class Controller {
    constructor(matchViewer) {
        this.matchViewer = matchViewer;
        this.replayData = [];
    }

    set_replay_data(replayData) {
        this.replayData = replayData;
    }

    show_frame(frame) {
        if (this._is_frame_valid(frame))
            return this._show_frame_using_matchViewer(frame);
    }

    _show_frame_using_matchViewer(frame) {
        return this.matchViewer.show_data(this.replayData[frame]);
    }

    _is_frame_valid(frame) {
        return frame >= 0 && frame < this.replayData.length;
    }
}

if (typeof process !== 'undefined')
    module.exports = Controller;