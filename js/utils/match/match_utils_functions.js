(function(global) {

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
    const HEALTH = 13;
    const UNIT_TYPE = 14;
    const SHIELD = 15;

    const is_upgraded = function(self, array, index) {
        let final_index = self.calculate_final_index(index, UPGRADE);
        return array[final_index];
    };

    //Functions config, should be moved to another file
    const match_utils_functions = {
        td_to_elements_converter: function(td) {
            let ims = td.getElementsByClassName('match-changing-img');
            let quantity_label = td.getElementsByClassName('quantity');
            let damage_bar = td.getElementsByClassName('damage-bar');
            let dummy_div = td.getElementsByClassName('dummy');
            let shield_svg = td.getElementsByClassName('shield-bar');
            return [...ims, ...damage_bar, ...quantity_label, ...dummy_div, ...shield_svg];
        },
        parse_row_to_single_array: function(row) {
            return [
                ...row.p1Units.slice(0, 3).map((p1U, i) => [...p1U, ...row.p2Units[i]]),
                ...row.p1Units.slice(3, 6),
                ...row.p2Units.slice(3, 6),
                ...row.p1Units.slice(6, 8).map((p1U, i) => [...p1U, ...row.p2Units[i + 6]]),
            ];
        },
        add_object_to_array: function(self, group, location, index, frame_data_array) {
            ///Set flags
            //  Firewalls + Inforamtion + Removal + Upgrade
            if (group >= 0 && group <= 10) {
                self.set_value(frame_data_array, index, group, 1);
            }

            ///Set Health
            //  Firewalls
            if (group >= 0 && group <= 8) { //TODO: Change 2 to 8 later

                //Calculate Unittype: map types [6, 7, 8] also to [3, 4, 5]
                let unit_type = group;
                if (unit_type > 5)
                    unit_type -= 3;

                //Set percental health for damage-bar
                let upgraded = is_upgraded(self, frame_data_array, index);
                let total_health = configTools.get_start_health(unit_type, upgraded);
                let health = location[2];
                if (!health)
                    health = total_health;
                let percental_health_left = health / total_health * 100;
                let shield_amount = Math.max(0, health - total_health);

                //set max percental health cap to 100%
                percental_health_left = Math.min(percental_health_left, 100);

                //Set percental health for damage-bar
                self.set_min(frame_data_array, index, DAMAGE_BAR, percental_health_left);

                //Set absolute health for hover details
                self.set_min(frame_data_array, index, HEALTH, health);

                //Add 100, to distinguish between 0 meaning nothing and 0 + 100 being a Filter
                unit_type += 100;

                //Set unit type
                self.set_min(frame_data_array, index, UNIT_TYPE, unit_type);

                //Set shield amount
                self.set_min(frame_data_array, index, SHIELD, shield_amount);
            }

            ///Add together for quantity
            //Information
            if (group >= 3 && group <= 8) {
                self.add_one(frame_data_array, index, QUANTITY);
            }
        },
        parse_frame_data_to_flat_array: function(self, frame_data) {
            let frame_data_array = self.create_new_array();

            let all_data = self.config.parse_row_to_single_array(frame_data);

            //Reverse order is there, to make sure, upgrades have been set before damage gets calculated
            for (let group = all_data.length - 1; group >= 0; group--) {
                for (let location of all_data[group]) {
                    let index = self.location_to_index(location);
                    self.config.add_object_to_array(self, group, location, index, frame_data_array);
                }
            }

            return frame_data_array;
        },
        update_function: function(group, switched_index, current_element, value) {
            //  Firewalls + Inforamtion + Removal + Upgrade + Quantity
            if (group >= 0 && group <= 10 || group === 12) {
                current_element.hidden = value == 0;
            }

            // Quantity
            if (group === QUANTITY) {
                current_element.innerHTML = value;
            }

            // Damage-Bar
            if (group === DAMAGE_BAR) {
                current_element.style.strokeDashoffset = 1.00530964915 * value;
            }

            // TODO: SHIELD!
            if (group === SHIELD) {
                // PI * r(=1)  ** 2 = 3.14
                // 2 = 
                current_element.setAttribute('r', Math.sqrt(value * 3.14 * 2));
            }
        },
        additional_flipping: function(self, index) {

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
})(window);