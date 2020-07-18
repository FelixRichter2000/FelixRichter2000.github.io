class Slider {
    constructor(slider_element, actionEventSystem) {
        this.slider_element = slider_element;
        this.max = 0;
        this.slider_element.slider({
            range: "min",
            animate: true,
            value: 0,
            min: 0,
            max: 0,
            step: 1,
            slide: function(event, ui) {
                actionEventSystem.release_event('set_frame', ui.value);
                actionEventSystem.release_event('pause');
            },
        });
    }

    set_current_value(current_value) {
        this.slider_element.slider({
            value: Math.min(current_value, this.max)
        });
    }

    set_max_value(max_value) {
        this.max = Math.max(max_value, 0);
        this.slider_element.slider({ max: this.max });
    }
}


if (typeof process !== 'undefined')
    module.exports = Slider;