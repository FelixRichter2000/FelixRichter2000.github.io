const update_custome_css_variables = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--vw', `${window.innerWidth}px`);
    document.documentElement.style.setProperty('--min-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight))}px`);
    document.documentElement.style.setProperty('--tile-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 28)}px`);
    document.documentElement.style.setProperty('--bar-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 24)}px`);
    document.documentElement.style.setProperty('--half-tile-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 28) / 2}px`);
    document.documentElement.style.setProperty('--negative-half-tile-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 28) / -2}px`);
}

update_custome_css_variables();

window.addEventListener('resize', () => {
    update_custome_css_variables();
});