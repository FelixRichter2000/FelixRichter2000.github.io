const update_custome_css_variables = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--vw', `${window.innerWidth}px`);
    document.documentElement.style.setProperty('--min-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight))}px`);
    document.documentElement.style.setProperty('--tile-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 28)}px`);
    document.documentElement.style.setProperty('--bar-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 25)}px`);
    document.documentElement.style.setProperty('--smaller-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 36)}px`);
    document.documentElement.style.setProperty('--very-small-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 42)}px`);
    document.documentElement.style.setProperty('--half-tile-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 28) / 2}px`);
    document.documentElement.style.setProperty('--negative-half-tile-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 28) / -2}px`);
}

update_custome_css_variables();

window.addEventListener('resize', () => {
    update_custome_css_variables();
});

window.addEventListener('orientationchange', () => {
    update_custome_css_variables();
});

window.addEventListener('mousemove', (e) => {
    let tile_size = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 28);

    const round = (pixel) => Math.round((pixel - tile_size / 2) / tile_size);

    let x = round(e.clientX);
    let y = 27 - round(e.clientY);

    viewer.show_field_info(x, y);
});

