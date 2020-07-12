const FieldGenerator = require('./field_generator');
const MatchUtils = require('./match_utils');
jest.mock('./match_utils');
const mockMatchUtils = new MatchUtils();



mockMatchUtils.generate_terminal_trs.mockImplementation(() => 'fully_generated_table');
mockMatchUtils.get_all_changeable_elements_flat.mockImplementation(() => [{ hidden: false }, { hidden: false }]);

describe('test FieldGenerator', () => {
    test('should create FieldGenerator', () => {
        new FieldGenerator(mockMatchUtils);
    });

    test('should generate field', () => {
        let fieldGenerator = new FieldGenerator(mockMatchUtils);
        let mockDomElement = { innerHTML: '' };

        fieldGenerator.generate(mockDomElement);

        expect(mockDomElement.innerHTML).toBe('fully_generated_table')
    });

    test('should not provide viewerElements before calling generate', () => {
        let fieldGenerator = new FieldGenerator(mockMatchUtils);
        expect(fieldGenerator.get_viewer_elements()).toBe(null);
    });

    test('should provide viewerElements from matchUtils after calling generate', () => {
        let fieldGenerator = new FieldGenerator(mockMatchUtils);
        let mockDomElement = { innerHTML: '' };
        fieldGenerator.generate(mockDomElement);

        expect(fieldGenerator.get_viewer_elements()).toEqual([{ hidden: true }, { hidden: true }]);
    });

    test('should not return hover_elements before generate', () => {
        let fieldGenerator = new FieldGenerator(mockMatchUtils);
        expect(fieldGenerator.get_hover_elements()).toBe(null);
    });

    test('should provide hover_elements after generate', () => {
        let fieldGenerator = new FieldGenerator(mockMatchUtils);
        let mockElementsByClassName = jest.fn().mockImplementation(() => [{ hidden: false }, { hidden: false }]);
        let mockDomElement = { innerHTML: '', ownerDocument: { getElementsByClassName: mockElementsByClassName } };
        fieldGenerator.generate(mockDomElement);

        expect(fieldGenerator.get_hover_elements()).toEqual([{ hidden: true }, { hidden: true }]);
        expect(mockElementsByClassName).toHaveBeenCalledWith('highlight');
    });
});