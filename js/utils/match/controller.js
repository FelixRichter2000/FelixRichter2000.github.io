class Controller {
    constructor(actionEventSystem, changeDetector) {
        this.actionEventSystem = actionEventSystem;
        this.changeDetector = changeDetector;
        this.replayData = [];
        this.frame = 0;
    }

    set_replay_data(replayData) {
        this.replayData = replayData;
    }

    set_frame(frame) {
        if (this._is_frame_valid(frame))
            this._release_update_frame_data_event(frame);
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

    start_of_turn() {
        if (this._is_action_phase(this.frame))
            this.set_frame(this._get_first_frame_of_current_turn());
    }

    resimulate() {
        let begin_index = this._get_first_frame_of_current_turn();
        let actions_for_submit = this.changeDetector.detect_changes(this.replayData[begin_index + 1].events.spawn);
        this.actionEventSystem.release_event('set_simulation_game_state', this.replayData[begin_index]);
        this.actionEventSystem.release_event('submit_actions', actions_for_submit);
    }

    _get_first_frame_of_current_turn() {
        let frame = this.frame;
        while (this._is_action_phase(frame))
            frame--;
        return frame;
    }

    _release_update_frame_data_event(frame) {
        this.frame = frame;
        this.actionEventSystem.release_event('update_frame_data', this.replayData[frame]);
    }

    _is_frame_valid(frame) {
        return frame >= 0 && frame < this.replayData.length;
    }

    _get_next_turn(frame = this.frame) {
        frame++;
        while (this._is_action_phase(frame))
            frame++;
        return this._isFrameInRange(frame) ? frame + 1 : frame;
    }

    _get_previous_turn(frame = this.frame) {
        frame -= 2;
        while (this._is_action_phase(frame))
            frame--;
        return frame + 1;
    }

    _is_action_phase(frame) {
        return this._isFrameInRange(frame) && this._isFrameDuringTurn(frame);
    }

    _isFrameInRange(frame) {
        return frame > 0 && frame < this.replayData.length - 1;
    }

    _isFrameDuringTurn(frame) {
        return this.replayData[frame].turnInfo[0] !== 0;
    }
}

if (typeof process !== 'undefined')
    module.exports = Controller;