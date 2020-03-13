+function (global) {

    let callbacks = [];

    // Function used to find matching configs
    const areKeyEventsEqual = (e1, e2) =>
        e1.code === e2.code
        && e1.ctrlKey === e2.ctrlKey
        && e1.altKey === e2.altKey
        && e1.shiftKey === e2.shiftKey;

    // Keyboard handler
    document.addEventListener('keydown', function (keyEvent) {
        //console.log(keyEvent);

        let match = callbacks.find((e) => areKeyEventsEqual(e, keyEvent));
        if (match) {
            match.callback();
            keyEvent.preventDefault();
        }
    });

    // Function for registering callbacks
    function register_key_controls(new_callbacks) {
        callbacks = [...callbacks, ...new_callbacks];
    }
        

    if (!global.register_key_controls) {
        global.register_key_controls = register_key_controls;
    }

}(window);


