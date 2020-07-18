class AttributeToggler {
    constructor(elements, attribute_name) {
        this.elements = elements || [];
        this.attribute_name = attribute_name;
    }

    toggle_attributes() {
        if (this.attribute_name)
            [...this.elements].forEach(e => {
                e[this.attribute_name] = !e[this.attribute_name];
            });
    }
}


if (typeof process !== 'undefined')
    module.exports = AttributeToggler;