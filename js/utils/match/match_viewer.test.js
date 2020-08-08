const MatchViewer = require('./match_viewer');
const MatchUtils = require('./match_utils');
jest.mock('./match_utils');
const mockMatchUtils = new MatchUtils();
const mockedParsedArray = 1;
const mockedEmptyArray = 2;
const mockedViewerElements = 3;

mockMatchUtils.create_new_array.mockImplementation(() => mockedEmptyArray);
mockMatchUtils.parse_single_object_to_array.mockImplementation(() => mockedParsedArray);

afterEach(() => {
    jest.clearAllMocks();
});

describe('Mocking matchUtils tests', function() {
    test('mock parse_single_object_to_array returns mockViewerElements1', () => {
        expect(mockMatchUtils.parse_single_object_to_array()).toEqual(mockedParsedArray);
    });
});

describe('MatchViewer test', function() {
    test('create MatchViewer', () => {
        const matchViewer = new MatchViewer(mockMatchUtils, mockedViewerElements);
    });
    test('show data', () => {
        const matchViewer = new MatchViewer(mockMatchUtils, mockedViewerElements);
        matchViewer.update_data([]);
        expect(mockMatchUtils.update_changes)
            .toHaveBeenCalledWith(mockedEmptyArray, mockedParsedArray, mockedViewerElements, false);
    });
    test('switch_view without show data before', () => {
        const matchViewer = new MatchViewer(mockMatchUtils, mockedViewerElements);
        jest.clearAllMocks();

        matchViewer.switch_view();

        expect(mockMatchUtils.update_changes)
            .toHaveBeenCalledWith(mockedEmptyArray, mockedEmptyArray, mockedViewerElements, false);
        expect(mockMatchUtils.update_changes)
            .toHaveBeenCalledWith(mockedEmptyArray, mockedEmptyArray, mockedViewerElements, true);
    });

    test('switch_view', () => {
        const matchViewer = new MatchViewer(mockMatchUtils, mockedViewerElements);
        matchViewer.update_data([]);
        jest.clearAllMocks();

        matchViewer.switch_view();

        expect(mockMatchUtils.update_changes)
            .toHaveBeenCalledWith(mockedParsedArray, mockedEmptyArray, mockedViewerElements, false);
        expect(mockMatchUtils.update_changes)
            .toHaveBeenCalledWith(mockedEmptyArray, mockedParsedArray, mockedViewerElements, true);
    });

    test('get_value_at calles matchUtils with correct parameters', () => {
        const matchViewer = new MatchViewer(mockMatchUtils, mockedViewerElements);
        matchViewer.get_value_at('location', 'group');
        expect(mockMatchUtils.get_custome_value_at)
            .toHaveBeenCalledWith('location', false, 'group', mockedEmptyArray);
    });

    test('get_value_at after show data calles matchUtils with correct parameters', () => {
        const matchViewer = new MatchViewer(mockMatchUtils, mockedViewerElements);
        matchViewer.update_data([]);
        matchViewer.get_value_at('location', 'group');
        expect(mockMatchUtils.get_custome_value_at)
            .toHaveBeenCalledWith('location', false, 'group', mockedParsedArray);
    });

    test('get_value_at after switch_view calles matchUtils with correct parameters', () => {
        const matchViewer = new MatchViewer(mockMatchUtils, mockedViewerElements);
        matchViewer.switch_view();
        matchViewer.get_value_at('location', 'group');
        expect(mockMatchUtils.get_custome_value_at)
            .toHaveBeenCalledWith('location', true, 'group', mockedEmptyArray);
    });
});