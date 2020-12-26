class LayoutReader {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
        this.unitInformation = {};
    }

    set_config(config) {
        this.unitInformation = config.unitInformation;
    }

    analyse_replay_data(data) {
        let layout_data = []

        let firewalls = [[], []]
        data.forEach(frame => {
            if ('events' in frame && 'spawn' in frame.events) {
                let spawns = JSON.parse(JSON.stringify(frame.events.spawn));
                for (const spawn of spawns) {
                    spawn[3] -= 1;
                    spawn[2] = ''

                    let info = this.unitInformation[spawn[1]];
                    let is_firewall = true;
                    if ('unitCategory' in info)
                        if (info.unitCategory == 1)
                            is_firewall = false
                    if ('shorthand' in info)
                        if (info.shorthand == 'RM')
                            is_firewall = false
                    if (is_firewall)
                        firewalls[spawn[3]].push(spawn)
                }
            }
        });

        //drop duplicates
        for (let i = 0; i < firewalls.length; i++)
            firewalls[i] = Array.from(new Set(firewalls[i].map(JSON.stringify)), JSON.parse)


        let length = Math.max(firewalls[0].length, firewalls[1].length)
        for (let i = 0; i < length; i++) {
            layout_data.push({
                p0: firewalls[0],
                p1: firewalls[1],
                frame: i,
                turnInfo: [1, 0, i, i],
            });
        }

        this.actionEventSystem.release_event('set_replay_data', layout_data)
    }
}

if (typeof process !== 'undefined')
    module.exports = LayoutReader;