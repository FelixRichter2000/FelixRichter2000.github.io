+function (global) {

    //Group definitions:
    const FILTER = 0;
    const ENCRYPTOR = 1;
    const DESTRUCTOR = 2;
    const PING1 = 3;
    const EMP1 = 4;
    const SCRAMBLER1 = 5;
    const PING2 = 6;
    const EMP2 = 7;
    const SCRAMBLER2 = 8;
    const REMOVE = 9;
    const UPGRADE = 10;
    //Calculated values
    const DAMAGE_BAR = 11;
    const QUANTITY = 12;

    const is_upgraded = function (self, array, index) {
        let final_index = self.calculate_final_index(index, UPGRADE);
        return array[final_index];
    };

    //Functions config, should be moved to another file
    const match_utils_functions = {
        td_to_elements_converter: function (td) {
            let ims = td.getElementsByClassName('match-changing-img');
            let quantity_label = td.getElementsByClassName('quantity');
            let damage_bar = td.getElementsByClassName('damage-bar');
            return [...ims, ...damage_bar, ...quantity_label];
        },
        parse_row_to_single_array: function (row) {
            return [
                ...row.p1Units.slice(0, 3).map((p1U, i) => [...p1U, ...row.p2Units[i]]),
                ...row.p1Units.slice(3, 6),
                ...row.p2Units.slice(3, 6),
                ...row.p1Units.slice(6, 8).map((p1U, i) => [...p1U, ...row.p2Units[i + 6]]),
            ];
        },
        add_object_to_array: [
            function (self, group, location, index, frame_data_array) {
                ///Set flags
                //  Firewalls + Inforamtion + Removal + Upgrade
                if (group >= 0 && group <= 10) {
                    self.set_value(frame_data_array, index, group, 1);
                }

                ///Set Health
                //  Firewalls
                if (group >= 0 && group <= 2) { //TODO: Change 2 to 8 later
                    let health = location[2];
                    let upgraded = is_upgraded(self, frame_data_array, index);
                    let total_health = self.config.full_health[group][upgraded];
                    let percental_health_left = health / total_health * 100;
                    self.set_if_less(frame_data_array, index, DAMAGE_BAR, percental_health_left);

                    //let health = location[2];
                    //self.set_if_less(frame_data_array, index, group, health);
                }

                ///Add together for quantity
                //Information
                if (group >= 3 && group <= 8) {
                    self.add_one(frame_data_array, index, QUANTITY);
                }
            },
        ],
        parse_frame_data_to_flat_array: function (self, frame_data) {
            let frame_data_array = self.create_new_array();

            let all_data = self.config.parse_row_to_single_array(frame_data);

            //Reverse order is there, to make sure, upgrades have been set before damage gets calculated
            for (let group = all_data.length - 1; group >= 0; group--) {
                for (let location of all_data[group]) {
                    let index = self.location_to_index(location);
                    for (let converter of self.config.add_object_to_array) {
                        converter(self, group, location, index, frame_data_array);
                    }
                }
            }

            return frame_data_array;
        },
        update_function: function (group, switched_index, current_element, value) {
            //  Firewalls + Inforamtion + Removal + Upgrade + Quantity
            if (group >= 0 && group <= 10 || group === 12) {
                current_element.hidden = value == 0;
            }

            if (current_element.tagName === 'LABEL') {
                current_element.innerHTML = value;
            }
            else if (current_element.tagName === 'circle') {
                current_element.style.strokeDashoffset = 1.00530964915 * value;
            }
        },
        additional_flipping: function (self, index) {

            const switch_range_min = 3;
            const switch_range_max = 8;

            //without ending
            const ending = index % self.config.group_size;

            if (ending >= switch_range_min && ending <= switch_range_max) {
                const without_ending = index - ending;

                //fixed ending
                const fixed_ending = (ending - switch_range_min + 3) % 6 + switch_range_min;

                index = without_ending + fixed_ending;
            }

            return index;
        }
    };

    if (typeof process !== 'undefined') {
        module.exports = match_utils_functions;
    } else {
        if (!global.match_utils_functions) {
            global.match_utils_functions = match_utils_functions;
        }
    }
}(window);