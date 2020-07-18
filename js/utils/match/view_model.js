class ViewModel {
    constructor() {
        this.switched = false;
        this.data = {};
    }

    update_view(data) {
        this._updateData(data);
        Object.assign(this.data, data);
    }

    _updateData(data) {
        Object.getOwnPropertyNames(data)
            .forEach(property => this._updateFoundElements([...(document.getElementsByName(property))], data[property]));
    }

    _updateFoundElements(foundElements, dataArray) {
        if (dataArray)
            foundElements.forEach((element, index) => {
                let value = dataArray[this._calculateIndex(foundElements.length, index)];
                element.innerHTML = value || value <= 0 ? value : '';
            });
    }

    _calculateIndex(length, index) {
        return this.switched ? length - index - 1 : index;
    }

    switch_view() {
        this.switched = !this.switched;
        this._updateData(this.data);
    }
}


if (typeof process !== 'undefined')
    module.exports = ViewModel;