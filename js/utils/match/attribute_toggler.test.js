const AttributeToggler = require("./attribute_toggler");

describe('test AttributeToggler', () => {
    test('create', () => {
        new AttributeToggler();
    });

    test('toggle without providing elements', () => {
        let attributeToggler = new AttributeToggler();
        attributeToggler.toggle_attributes();
    });

    test('provide elements and toggle them', () => {
        let elements = [{ hidden: false }, { hidden: true }];
        let attributeToggler = new AttributeToggler(elements);

        attributeToggler.toggle_attributes();

        expect(elements).toEqual([{ hidden: false }, { hidden: true }]);
    });

    test('provide attribute name and elements and toggle them', () => {
        let elements = [{ hidden: false }, { hidden: true }];
        let attributeToggler = new AttributeToggler(elements, 'hidden');

        attributeToggler.toggle_attributes();

        expect(elements).toEqual([{ hidden: true }, { hidden: false }]);
    });

});