    //Mousemove Listener
    window.addEventListener('mousemove', (e) => {
        let tile_size = Math.min(window.innerWidth, window.innerHeight) / 28;

        const round = (pixel) => Math.round((pixel - tile_size / 2) / tile_size);

        let x = round(e.clientX);
        let y = 27 - round(e.clientY);

        if (typeof viewer != 'undefined')
            viewer.show_field_info(x, y);
    });