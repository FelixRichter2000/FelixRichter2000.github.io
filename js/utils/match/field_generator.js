class FieldGenerator {
    constructor(matchUtils) {
        this.matchUtils = matchUtils;
    }

    generate(element) {
        this.element = element;
        element.innerHTML = this.matchUtils.generate_terminal_trs();
    }

    get_viewer_elements() {
        if (this.element)
            return this.hide_elements(this.matchUtils.get_all_changeable_elements_flat(this.element));
        return null;
    }

    get_hover_elements() {
        if (this.element)
            return this.hide_elements(this.element.ownerDocument.getElementsByClassName('highlight'));
        return null;
    }

    hide_elements(elements) {
        for (var i = 0; i < elements.length; i++)
            elements[i].hidden = true;
        return elements;
    }
}

if (typeof process !== 'undefined')
    module.exports = FieldGenerator;