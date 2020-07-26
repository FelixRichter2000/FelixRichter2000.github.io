//ActionEventSystem
let actionEventSystem = new ActionEventSystem();
actionEventSystem.registerFollowUpEvent('switch_view', 'update_hover');
actionEventSystem.registerFollowUpEvent('update_frame_data', 'update_hover');
actionEventSystem.registerFollowUpEvent('set_user_data', 'update_view');

let replayDownloader = new ReplayDownloader(actionEventSystem);
actionEventSystem.register(replayDownloader);

//Get match id from query
let urlParams = new URLSearchParams(window.location.search);
let match_id = urlParams.get('id');
if (match_id) {
    replayDownloader.download(match_id);
    new UserDataDownloader(actionEventSystem)
        .download(match_id);
}

//Drag and drop
document.addEventListener("dragover", function(e) {
    e.preventDefault();
}, false);
document.addEventListener("drop", function(e) {
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function(evt) {
        let full_text = evt.target.result;
        actionEventSystem.release_event('handle_result', full_text);
    }
}, false);

//Match_Utils
match_utils = new MatchUtils(match_utils_config, match_utils_functions);
match_utils_flat = new MatchUtils({
    arena_settings: {
        size: 28,
        half: 14
    },
    group_size: 1,
}, {
    update_function: function(group, switched_index, current_element, value) {
        current_element.hidden = value == 0;
    },
    parse_frame_data_to_flat_array: function(self, data) {
        return self.get_locations_in_range(data.location, data.range);
    }
});

//FieldGenerator
const watch_table = document.getElementById('watch_table');
let fieldGenerator = new FieldGenerator(match_utils);
fieldGenerator.generate(watch_table);
const viewer_elements = fieldGenerator.get_viewer_elements();
const highlight_elements = fieldGenerator.get_hover_elements();

//Create MatchViewer
let match_viewer = new MatchViewer(match_utils, viewer_elements);
actionEventSystem.register(match_viewer);

//Create ViewModel
let view_model = new ViewModel();
actionEventSystem.register(view_model);

//FlatMatchViewer
let flat_match_viewer = new MatchViewer(match_utils_flat, highlight_elements);

//Controller
let controller = new Controller(actionEventSystem);
actionEventSystem.register(controller);

//ConfigTools
let configTools = new ConfigTools();
actionEventSystem.register(configTools);

//HoverInformation
let hoverInformation = new HoverInformation(match_viewer, flat_match_viewer, configTools, actionEventSystem);
actionEventSystem.register(hoverInformation);

//Slider
let replay_slider = new Slider($('#replay_slider'), actionEventSystem);
replay_slider.set_replay_data = function(data) { this.set_max_value(data.length); }
replay_slider.update_frame_data = function(data) { this.set_current_value(data.turnInfo[3]); }
actionEventSystem.register(replay_slider);

//Downloader
let downloader = new Downloader();
downloader.set_user_data = function(userdata) { this.filename = `${userdata.name.join('_VS_')}___${userdata.match_id[0]}.txt`; };
downloader.set_replay_raw = function(content) { this.content = content };
actionEventSystem.register(downloader);

//Play/Pause-AttributeToggler
let playPauseAttributeToggler = new AttributeToggler(document.getElementsByName('play_button_img'), 'hidden');
playPauseAttributeToggler.toggle_play = function() { this.toggle_attributes(); }
actionEventSystem.register(playPauseAttributeToggler);

//StateParser
let stateParser = new StateParser(actionEventSystem);
actionEventSystem.register(stateParser);

//Simulator
let startStringGenerator = new StartStringGenerator();
let socket = new Socket(actionEventSystem, startStringGenerator);
socket.set_game_state();
actionEventSystem.register(socket);

//SimulationIntegrator
let simulationIntegrator = new SimulationIntegrator(actionEventSystem);
actionEventSystem.register(simulationIntegrator);

window.addEventListener('mousemove', (e) => {
    let tile_size = Math.min(window.innerWidth, window.innerHeight) / 28;
    const round = (pixel) => Math.round((pixel - tile_size / 2) / tile_size);
    let location = [round(e.clientX), 27 - round(e.clientY)];
    if (!match_utils.is_in_arena_bounds(...location))
        location = [0, 0];
    actionEventSystem.release_event('show_field_info', location)
});

let player = new Player(actionEventSystem);
actionEventSystem.register(player);

//Setup shortcuts
let shortcutController = new ShortcutController(actionEventSystem);
[{
        code: "ArrowRight",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        callback: "next_frame",
    },
    {
        code: "ArrowLeft",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        callback: "previous_frame",
    },
    {
        code: "ArrowRight",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        callback: "next_turn",
    },
    {
        code: "ArrowLeft",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
        callback: "previous_turn",
    },
    {
        code: "ArrowUp",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        callback: "faster_playback",
    },
    {
        code: "ArrowDown",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        callback: "slower_playback",
    },
    {
        code: "Space",
        ctrlKey: false,
        shiftKey: false,
        altKey: false,
        callback: "toggle_play",
    },
    {
        code: "KeyX",
        ctrlKey: false,
        shiftKey: false,
        altKey: true,
        callback: "switch_view",
    }
].forEach(function(shortcut) {
    shortcutController.addNewShortcut(shortcut);
})

//Setup Button bindings
document.querySelectorAll('[action]').forEach(function(e) {
    e.addEventListener('click', () => actionEventSystem.release_event(e.getAttribute('action')))
});

//Fancy Health-Bars
setInterval(() => {
    let health_values = [...document.getElementsByName('health')]
        .map(e => `${parseInt(e.innerHTML) / .3}%`);
    [...document.getElementsByName('health-bar')]
    .forEach((e, i) => e.style.width = health_values[i]);
}, 1000 / 60);