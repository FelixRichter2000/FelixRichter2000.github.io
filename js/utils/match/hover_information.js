class HoverInformation {
    constructor(matchViewer, flatMatchViewer, configTools) {
        this.matchViewer = matchViewer;
        this.flatMatchViewer = flatMatchViewer;
        this.configTools = configTools;
        this.last_location = [0, 0];
    }

    show_field_info(location) {
        this.last_location = location;
        this.update_hover();
    }

    update_hover() {
        let health = this.matchViewer.get_value_at(this.last_location, 12);
        let unit_type = this.matchViewer.get_value_at(this.last_location, 14);
        let upgraded = this.matchViewer.get_value_at(this.last_location, 10);

        let range = this.configTools.getRange(unit_type, upgraded);

        this.flatMatchViewer.show_data({ location: this.last_location, range });
    }
}


if (typeof process !== 'undefined')
    module.exports = HoverInformation;