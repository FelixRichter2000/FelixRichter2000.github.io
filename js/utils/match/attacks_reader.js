class AttacksReader {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.unitInformation = {};
    }

    set_config(config) {
        this.unitInformation = config.unitInformation;
    }

    analyse_replay_data(data) {
        let attacks = [[[]], [[]]];
        let prev_turn_removals = [{}, {}];
        data.forEach(frame => {
            if ('events' in frame && 'spawn' in frame.events && frame.events.spawn.length > 0) {
                let spawns = JSON.parse(JSON.stringify(frame.events.spawn));
                let current_turn = [{}, {}];
                let removals_now = [{}, {}];
                for (const spawn of spawns) {
                    let location = spawn[0];
                    let unit_type = spawn[1];
                    let player = spawn[3] - 1;

                    const key = JSON.stringify([location, unit_type])
                    let prev_quantity = current_turn[player][key] || 0;
                    current_turn[player][key] = prev_quantity + 1;
                }
                for (let player = 0; player < attacks.length; player++) {
                    let temp = [];
                    for (const [key, value] of Object.entries(current_turn[player])) {
                        let unwrapped_key = JSON.parse(key);
                        let percentage = value;
                        let entry = [unwrapped_key[0], unwrapped_key[1], player, percentage]
                        let unit_type = unwrapped_key[1];
                        let info = this.unitInformation[unit_type];
                        let should_add = false;
                        if ('unitCategory' in info)
                            if (info.unitCategory == 1)
                                should_add = true
                        if (!('unitCategory' in info) && info.shorthand == 'RM')
                            removals_now[player][key] = value;
                        // if ('shorthand' in info)
                        //     if (info.shorthand == 'RM')
                        //         should_add = false
                        if (should_add)
                            temp.push(entry);
                    }
                    if (temp.length > 0) {
                        for (const [key, value] of Object.entries(prev_turn_removals[player])) {
                            let unwrapped_key = JSON.parse(key);
                            let entry = [unwrapped_key[0], unwrapped_key[1], player, 0];
                            temp.push(entry);
                        }
                    }
                    if (temp.length > 0)
                        attacks[player].push(temp);
                }
                prev_turn_removals = removals_now;
            }
        });

        this.actionEventSystem.release_event('set_attacks', attacks)
    }
}

if (typeof process !== 'undefined')
    module.exports = AttacksReader;