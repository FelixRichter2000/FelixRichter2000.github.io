class AttacksReader {
    constructor(actionEventSystem) {
        this.actionEventSystem = actionEventSystem;
    }

    set_config() {

    }

    analyse_replay_data(data) {
        // let layout_data = []

        // let firewalls = [[], []]
        // data.forEach(frame => {
        //     if ('events' in frame && 'spawn' in frame.events) {
        //         let spawns = frame.events.spawn;
        //         for (const spawn of spawns) {
        //             spawn[3] -= 1;
        //             if ([0, 1, 2, 7].includes(spawn[1]))
        //                 firewalls[spawn[3]].push(spawn)
        //         }
        //     }
        // });

        // let length = Math.max(firewalls[0].length, firewalls[1].length)
        // for (let i = 0; i < length; i++) {
        //     layout_data.push({
        //         p0: firewalls[0],
        //         p1: firewalls[1],
        //         frame: i,
        //         turnInfo: [1, 0, i, i],
        //     });
        // }

        // this.actionEventSystem.release_event('set_replay_data', layout_data)
    }
}

if (typeof process !== 'undefined')
    module.exports = AttacksReader;