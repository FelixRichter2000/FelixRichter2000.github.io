(function () {
    let unitStack = function (spawn_info, stack_id) {
        this.units = new Set();
        this.units_left = 0;
        this.spawn_info = spawn_info;
        this.spawn_info.push(0);
        this.add(spawn_info);
        this.spawn_info[2] = stack_id;
    }
    let proto = unitStack.prototype;

    proto.set_current_location = function (location) {
        this.spawn_info[0] = location;
    }

    proto.kill_one = function () {
        this.units_left -= 1;
    }

    proto.get_units_left = function () {
        return this.units_left;
    }

    proto.matches = function (spawn_info) {
        return spawn_info[0][0] == this.spawn_info[0][0]
            && spawn_info[0][1] == this.spawn_info[0][1]
            && spawn_info[1] == this.spawn_info[1]
            && spawn_info[3] == this.spawn_info[3];
    }

    proto.info = function () {
        return this.spawn_info;
    }

    proto.max_amount = function () {
        return this.units.size;
    }

    proto.is_id_in_stack = function (unique_id) {
        return this.units.has(unique_id);
    }

    proto.add = function (spawn_info) {
        let unit_id = spawn_info[2];
        this.units.add(unit_id);
        this.spawn_info[4] += 1;
        this.units_left += 1;
    }

    if (!window.UnitStack) {
        window.UnitStack = unitStack;
    }
})();