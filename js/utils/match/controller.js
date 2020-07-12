class Controller {
    constructor(matchViewer) {
        this.matchViewer = matchViewer;
        this.replayData = [];
        this.frame = 0;
    }

    set_replay_data(replayData) {
        this.replayData = replayData;
    }

    set_frame(frame) {
        if (this._is_frame_valid(frame))
            return this._show_frame_using_matchViewer(frame);
    }

    next_frame() {
        this.set_frame(this.frame + 1);
    }

    previous_frame() {
        this.set_frame(this.frame - 1);
    }

    next_turn() {
        this.set_frame(this._get_next_turn());
    }

    previous_turn() {
        this.set_frame(this._get_previous_turn());
    }

    _show_frame_using_matchViewer(frame) {
        this.frame = frame;
        return this.matchViewer.show_data(this.replayData[frame]);
    }

    _is_frame_valid(frame) {
        return frame >= 0 && frame < this.replayData.length;
    }

    _get_next_turn(frame = this.frame) {
        frame++;
        while (frame < this.replayData.length && this.replayData[frame].turnInfo[0] !== 0) {
            frame++;
        }
        return frame + 1;
    }

    _get_previous_turn(frame = this.frame) {
        frame -= 2;
        while (frame > 0 && this.replayData[frame].turnInfo[0] !== 0) {
            frame--;
        }
        return frame + 1;
    }
}

if (typeof process !== 'undefined')
    module.exports = Controller;