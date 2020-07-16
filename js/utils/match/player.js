class Player {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.playing = true;
        this.current_fps = 12;
        this.set_playback_speed();
    }

    play() {
        this.playing = true;
    }

    pause() {
        this.playing = false;
    }

    toggle_play() {
        this.playing = !this.playing;
    }

    set_playback_speed(fps = this.current_fps) {
        this._updateFpsIfValid(fps);
        this._updateInterval();
    }

    _updateFpsIfValid(fps) {
        if (fps >= 0 && fps <= 60)
            this.current_fps = fps;
    }

    _updateInterval() {
        if (this.timer)
            clearInterval(this.timer);
        this.timer = setInterval(this._tick.bind(this), 1000 / this.current_fps);
    }

    _tick() {
        if (this.playing)
            this.actionEventSystem.release_event('next_frame');
    }
}


if (typeof process !== 'undefined')
    module.exports = Player;