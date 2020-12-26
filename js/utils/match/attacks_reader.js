class AttacksReader {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.unitInformation = {};
    }

    set_config(config) {
        this.unitInformation = config.unitInformation;
    }

    analyse_replay_data(data) {
        let attacks = [[], []]
        data.forEach(frame => {
            if ('events' in frame && 'spawn' in frame.events) {
                let spawns = JSON.parse(JSON.stringify(frame.events.spawn));
                let current_turn = [{}, {}];
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
                        temp.push(entry);
                    }
                    if (temp.length > 0)
                        attacks[player].push(temp);
                }
            }
        });

        this.actionEventSystem.release_event('set_attacks', attacks)
    }
}

if (typeof process !== 'undefined')
    module.exports = AttacksReader;