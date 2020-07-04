+ function() {

    // Keyboard Control Config
    let keybord_controls = [{
            code: "ArrowRight",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: viewer.next_frame,
        },
        {
            code: "ArrowLeft",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: viewer.previous_frame,
        },
        {
            code: "ArrowRight",
            ctrlKey: true,
            shiftKey: false,
            altKey: false,
            callback: viewer.next_turn,
        },
        {
            code: "ArrowLeft",
            ctrlKey: true,
            shiftKey: false,
            altKey: false,
            callback: viewer.previous_turn,
        },
        {
            code: "ArrowUp",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: viewer.faster_playback,
        },
        {
            code: "ArrowDown",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: viewer.slower_playback,
        },
        {
            code: "Space",
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            callback: viewer.toggle_play,
        },
        {
            code: "KeyX",
            ctrlKey: false,
            shiftKey: false,
            altKey: true,
            callback: viewer.switch_view,
        }
    ];

    register_key_controls(keybord_controls);
}