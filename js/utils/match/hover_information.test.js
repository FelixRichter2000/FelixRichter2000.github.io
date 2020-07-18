const HoverInformation = require("./hover_information");
const MatchViewer = require('./match_viewer');
jest.mock('./match_viewer');
const mockMatchViewer = new MatchViewer();
const mockFlatMatchViewer = new MatchViewer();
const ConfigTools = require('../match/config_tools');
jest.mock('../match/config_tools');
const mockConfigTools = new ConfigTools();

const HEALTH = 12;
const UNIT_TYPE = 14;
const UPGRADED = 10;

mockMatchViewer.get_value_at.mockImplementation(() => 'returnValue');
mockConfigTools.getRange.mockImplementation(() => 'returnedRange');

afterEach(() => {
    jest.clearAllMocks();
});

describe('test hover_information', () => {
    test('create hover_information', () => {
        new HoverInformation(mockMatchViewer, mockConfigTools);
    });

    test('show_field_info event', () => {
        const hoverInformation = new HoverInformation(mockMatchViewer, mockFlatMatchViewer, mockConfigTools);
        hoverInformation.show_field_info([0, 0]);

        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], HEALTH);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], UNIT_TYPE);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], UPGRADED);

        expect(mockConfigTools.getRange).toHaveBeenCalledWith('returnValue', 'returnValue');

        expect(mockFlatMatchViewer.show_data).toHaveBeenCalledWith({ location: [0, 0], range: 'returnedRange' });
    });

    test('update event first uses default location', () => {
        const hoverInformation = new HoverInformation(mockMatchViewer, mockFlatMatchViewer, mockConfigTools);
        hoverInformation.update_hover();

        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], HEALTH);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], UNIT_TYPE);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], UPGRADED);

        expect(mockConfigTools.getRange).toHaveBeenCalledWith('returnValue', 'returnValue');

        expect(mockFlatMatchViewer.show_data).toHaveBeenCalledWith({ location: [0, 0], range: 'returnedRange' });
    });

    test('update_hover event', () => {
        const hoverInformation = new HoverInformation(mockMatchViewer, mockFlatMatchViewer, mockConfigTools);
        hoverInformation.show_field_info([2, 3]);
        jest.clearAllMocks();

        hoverInformation.update_hover();

        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([2, 3], HEALTH);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([2, 3], UNIT_TYPE);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([2, 3], UPGRADED);

        expect(mockConfigTools.getRange).toHaveBeenCalledWith('returnValue', 'returnValue');

        expect(mockFlatMatchViewer.show_data).toHaveBeenCalledWith({ location: [2, 3], range: 'returnedRange' });
    });
});