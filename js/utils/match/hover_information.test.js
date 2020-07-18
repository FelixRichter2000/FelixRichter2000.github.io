const HoverInformation = require("./hover_information");
const MatchViewer = require('./match_viewer');
jest.mock('./match_viewer');
const mockMatchViewer = new MatchViewer();
const mockFlatMatchViewer = new MatchViewer();
const ConfigTools = require('../match/config_tools');
jest.mock('../match/config_tools');
const mockConfigTools = new ConfigTools();
const ActionEventSystem = require('../general/action_event_system');
jest.mock('../general/action_event_system');
const mockActionEventSystem = new ActionEventSystem();

const HEALTH = 12;
const UNIT_TYPE = 14;
const UPGRADED = 10;

mockMatchViewer.get_value_at.mockImplementation(() => 'returnValue');
mockConfigTools.getRange.mockImplementation(() => 'returnedRange');

const hoverInformation = new HoverInformation(mockMatchViewer, mockFlatMatchViewer, mockConfigTools, mockActionEventSystem);

afterEach(() => {
    jest.clearAllMocks();
});

describe('test hover_information', () => {
    test('create hover_information', () => {
        new HoverInformation();
    });

    test('show_field_info event', () => {
        hoverInformation.show_field_info([0, 0]);

        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], HEALTH);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], UNIT_TYPE);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], UPGRADED);

        expect(mockConfigTools.getRange).toHaveBeenCalledWith('returnValue', 'returnValue');

        expect(mockFlatMatchViewer.update_frame_data).toHaveBeenCalledWith({ location: [0, 0], range: 'returnedRange' });
    });

    test('update event first uses default location', () => {
        hoverInformation.update_hover();

        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], HEALTH);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], UNIT_TYPE);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([0, 0], UPGRADED);

        expect(mockConfigTools.getRange).toHaveBeenCalledWith('returnValue', 'returnValue');

        expect(mockFlatMatchViewer.update_frame_data).toHaveBeenCalledWith({ location: [0, 0], range: 'returnedRange' });
    });

    test('update_hover event', () => {
        hoverInformation.show_field_info([2, 3]);
        jest.clearAllMocks();

        hoverInformation.update_hover();

        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([2, 3], HEALTH);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([2, 3], UNIT_TYPE);
        expect(mockMatchViewer.get_value_at).toHaveBeenCalledWith([2, 3], UPGRADED);

        expect(mockConfigTools.getRange).toHaveBeenCalledWith('returnValue', 'returnValue');

        expect(mockFlatMatchViewer.update_frame_data).toHaveBeenCalledWith({ location: [2, 3], range: 'returnedRange' });
    });

    test('show_field_info should release_event update_view with hover_health and hover_location set', () => {
        hoverInformation.show_field_info([0, 0]);

        expect(mockActionEventSystem.release_event)
            .toHaveBeenCalledWith('update_view', { hover_health: 'returnValue', hover_location: '0, 0' });
    });
});