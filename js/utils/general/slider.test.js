const Slider = require("./slider");
let mockSliderElement = { slider: jest.fn() };
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

let slider = new Slider(mockSliderElement, mockActionEventSystem);

afterEach(() => {
    jest.clearAllMocks();
});

describe('test Slider', () => {
    test('create Slider', () => {
        jest.clearAllMocks();
        new Slider(mockSliderElement, mockActionEventSystem);
        expect(mockSliderElement.slider).toHaveBeenCalledWith({
            range: "min",
            animate: true,
            value: 0,
            min: 0,
            max: 0,
            step: 1,
            slide: expect.any(Function),
        });
    });

    test('invoke mockSliderElement slide', () => {
        let mockFunctioningSlider = { slider: (args) => { this.args = args; }, slide: (event, slider) => this.args.slide(event, slider) };
        new Slider(mockFunctioningSlider, mockActionEventSystem);
        mockFunctioningSlider.slide({}, { value: 5 });
        expect(mockActionEventSystem.release_event).toHaveBeenCalledWith(5);
    });

    test('set current value outside of range should set to max_range', () => {
        slider.set_current_value(12);
        expect(mockSliderElement.slider).toHaveBeenCalledWith({ value: 0 });
    });

    test('set max value to -1 should set max_value to 0', () => {
        slider.set_max_value(-1);
        expect(mockSliderElement.slider).toHaveBeenCalledWith({ max: 0 });
    });

    test('set max value to valid value (12)', () => {
        slider.set_max_value(12);
        expect(mockSliderElement.slider).toHaveBeenCalledWith({ max: 12 });
    });

    test('set current value somewhere in range', () => {
        slider.set_max_value(12);
        jest.clearAllMocks();

        slider.set_current_value(4);
        expect(mockSliderElement.slider).toHaveBeenCalledWith({ value: 4 });
    });

    test('set current value higher than max value in range', () => {
        slider.set_max_value(12);
        jest.clearAllMocks();

        slider.set_current_value(13);
        expect(mockSliderElement.slider).toHaveBeenCalledWith({ value: 12 });
    });
});