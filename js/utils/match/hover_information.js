class HoverInformation {
    constructor(matchViewer, flatMatchViewer, configTools, actionEventSystem) {
        this.matchViewer = matchViewer;
        this.flatMatchViewer = flatMatchViewer;
        this.configTools = configTools;
        this.actionEventSystem = actionEventSystem;
        this.last_location = [0, 0];
    }

    show_field_info(location) {
        this.last_location = location;
        this.update_hover();
    }

    update_hover() {
        let hover_health = this.matchViewer.get_value_at(this.last_location, 12);
        let unit_type = this.matchViewer.get_value_at(this.last_location, 14);
        let upgraded = this.matchViewer.get_value_at(this.last_location, 10);
        let range = this.configTools.getRange(unit_type, upgraded);

        this.flatMatchViewer.update_frame_data({ location: this.last_location, range });
        this.actionEventSystem.release_event('update_view', { hover_health, hover_location: this._getLocationFormatted() })
    }

    _getLocationFormatted() {
        return `${this.last_location[0]}, ${this.last_location[1]}`;
    }
}


if (typeof process !== 'undefined')
    module.exports = HoverInformation;