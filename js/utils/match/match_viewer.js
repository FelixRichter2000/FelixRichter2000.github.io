class MatchViewer {
    constructor(match_utils, viewer_elements) {
        this.match_utils = match_utils;
        this.viewer_elements = viewer_elements;
        this.previous_state = this.match_utils.create_new_array();
        this.empty_state = this.match_utils.create_new_array();
        this.switched = false;
    }

    show_data(data) {
        let new_state = this.match_utils.parse_single_object_to_array(data);
        this.match_utils.update_changes_better(this.previous_state, new_state, this.viewer_elements, this.switched);
        this.previous_state = new_state;
    }

    switch () {
        this.match_utils.update_changes_better(this.previous_state, this.empty_state, this.viewer_elements, this.switched);
        this.switched = !this.switched;
        this.match_utils.update_changes_better(this.empty_state, this.previous_state, this.viewer_elements, this.switched);
    }

    get_value_at(location, group) {
        return this.match_utils.get_custome_value_at(location, this.switched, group, this.previous_state);
    }
}

if (typeof process !== 'undefined') {
    module.exports = MatchViewer;
}