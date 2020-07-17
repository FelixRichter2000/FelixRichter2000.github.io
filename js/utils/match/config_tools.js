class ConfigTools {
    constructor(config) {
        this.config = config;
    }

    getRange(unit_type, upgraded) {
        unit_type = this._adaptHighUnitTypes(unit_type);
        return this._getRange(unit_type, upgraded);
    }

    _getRange(unit_type, upgraded) {
        const unitInformation = this._getUnitInformation(unit_type, upgraded);
        return this._determineMaxRange(unitInformation);
    }

    _determineMaxRange(unitInformation) {
        return Object.getOwnPropertyNames(unitInformation)
            .filter(el => el.includes("Range"))
            .reduce((a, v) => Math.max(unitInformation[v], a), 0);
    }

    _getUnitInformation(unit_type, upgraded) {
        if (this._isConfigAvailableForType(unit_type)) {
            const unitInformation = JSON.parse(JSON.stringify(this.config.unitInformation[unit_type]));
            if (upgraded)
                Object.assign(unitInformation, unitInformation.upgrade);
            return unitInformation;
        }
        return {};
    }

    _isConfigAvailableForType(unit_type) {
        return this.config && this.config.unitInformation.length > unit_type;
    }

    _adaptHighUnitTypes(unit_type) {
        if (unit_type > 100)
            unit_type -= 100;
        return unit_type;
    }
}


if (typeof process !== 'undefined')
    module.exports = ConfigTools;