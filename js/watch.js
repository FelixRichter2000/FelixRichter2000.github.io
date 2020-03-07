let replayReader = new ReplayReader(5979377);

//Init table
const watch_table = document.getElementById('watch_table');
watch_table.innerHTML = match_utils.create_viewer();

//Init references to images
//const viewer_elements = match_utils.get_images(watch_table);
const viewer_elements = match_utils.get_images_one_dimensional(watch_table);
const viewer_elements_length = viewer_elements.length;

//Set all to hidden
for (var i = 0; i < viewer_elements_length; i++) {
    viewer_elements[i].hidden = true;
}

//For loop
let mod = 60;
let counter = 0;
var lastLoop = new Date();

//For fps display
const fps_display = document.getElementById("fps");

const fps_goal = 60;

setInterval(tick, 1000 / fps_goal);
function tick() {

    if (replayReader.raw_frame_data.length == 0) return;

    counter++;
    display_fps();

    match_utils.update_changes(counter - 1, counter, replayReader.fast_frame_data, viewer_elements);

    //updateImages();
}

function updateImages() {
    //show/hide images
    for (let i = 0; i < viewer_elements_length; i++) {

        let current = viewer_elements[i];

        if (current.length == 0) {
            continue;
        }

        //current j
        let j = (counter + i) % mod;
        if (j < current.length) {
            let img = current[j];
            img.hidden = false;
        }

        //old j
        j = (counter + i - 1) % mod;
        if (j < current.length) {
            img = current[j];
            img.hidden = true;
        }
    }
}

function display_fps() {
    //fps display
    if (counter % fps_goal == 0) {
        var thisLoop = new Date();
        var fps = 1000 / (thisLoop - lastLoop) * fps_goal;
        lastLoop = thisLoop;
        fps_display.innerHTML = fps;
    }
}

