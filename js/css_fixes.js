// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
document.documentElement.style.setProperty('--vw', `${window.innerWidth}px`);
document.documentElement.style.setProperty('--min-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight))}px`);
document.documentElement.style.setProperty('--tile-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 30 - 1)}px`);
document.documentElement.style.setProperty('--half-tile-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 30 - 1) / -2}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
    // We execute the same script as before
    document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--vw', `${window.innerWidth}px`);
    document.documentElement.style.setProperty('--min-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight))}px`);
    document.documentElement.style.setProperty('--tile-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 30 - 1)}px`);
    document.documentElement.style.setProperty('--half-tile-size', `${Math.floor(Math.min(window.innerWidth, window.innerHeight) / 30 - 1) / -2}px`);
});