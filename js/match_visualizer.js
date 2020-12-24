//ActionEventSystem
let actionEventSystem = new ActionEventSystem();
actionEventSystem.registerFollowUpEvent('switch_view', 'update_hover');
actionEventSystem.registerFollowUpEvent('update_frame_data', 'update_hover');
actionEventSystem.registerFollowUpEvent('set_user_data', 'update_view');
actionEventSystem.registerFollowUpEvent('start_of_turn', 'pause');
actionEventSystem.registerFollowUpEvent('start_of_turn', 'restart_socket');
actionEventSystem.registerFollowUpEvent('set_replay_data_raw', 'set_replay_data');
actionEventSystem.registerPreEvent('simulate', 'send_simulation_game_state');

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
document.addEventListener("dragover", function (e) {
    e.preventDefault();
}, false);
document.addEventListener("drop", function (e) {
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
        let full_text = evt.target.result;
        actionEventSystem.release_event('handle_result', full_text);
    }
}, false);

//Config data
const quantity_label = '<label class="quantity"></label>';
const remove2_img = '<img class="match-changing-img" src="images/Remove2.svg">';
const upgrade2_img = '<img class="match-changing-img" src="images/Upgrade2.svg">';
const filter3_img = '<img class="match-changing-img" src="images/Filter3.svg">';
const encryptor3_img = '<img class="match-changing-img" src="images/Encryptor3.svg">';
const destructor3_img = '<img class="match-changing-img" src="images/Destructor3.svg">';
const ping3_img = '<img class="match-changing-img" src="images/Ping3.svg">';
const emp3_img = '<img class="match-changing-img" src="images/Emp3.svg">';
const scrambler3_img = '<img class="match-changing-img" src="images/Scrambler3.svg">';

//ConfigTools
let configTools = new ConfigTools();
actionEventSystem.register(configTools);

//Match_Utils
let match_utils = new MatchUtils(match_utils_config, match_utils_functions);
let match_utils_flat = new MatchUtils({
    arena_settings: {
        size: 28,
        half: 14
    },
    group_size: 1,
}, {
    update_function: function (group, switched_index, current_element, value) {
        current_element.hidden = value == 0;
    },
    parse_frame_data_to_flat_array: function (self, data) {
        return self.get_locations_in_range(data.location, data.range);
    }
});
let match_utils_simulator = new MatchUtils({
    field_contents: [
        filter3_img +
        encryptor3_img +
        destructor3_img +
        ping3_img +
        emp3_img +
        scrambler3_img +
        remove2_img +
        upgrade2_img +
        quantity_label,

        filter3_img +
        encryptor3_img +
        destructor3_img +
        ping3_img +
        emp3_img +
        scrambler3_img +
        remove2_img +
        upgrade2_img +
        quantity_label
    ],

    arena_settings: {
        size: 28,
        half: 14
    },

    group_size: 9
}, {
    td_to_elements_converter: function (td) {
        let ims = td.getElementsByClassName('match-changing-img');
        let quantity_label = td.getElementsByClassName('quantity');
        return [...ims, ...quantity_label];
    },
    add_object_to_array: function (self, group, index, frame_data_array) {
        ///Set flags
        //  Firewalls + Inforamtion + Removal + Upgrade
        if (group >= 0 && group <= 7) {
            self.set_value(frame_data_array, index, group, 1);
        }

        ///Add together for quantity
        //Information
        if (group >= 3 && group <= 5) {
            self.add_one(frame_data_array, index, 8);
        }
    },
    parse_frame_data_to_flat_array: function (self, actions) {

        let frame_data_array = self.create_new_array();

        const type_to_index = {
            'FF': 0,
            'EF': 1,
            'DF': 2,
            'PI': 3,
            'EI': 4,
            'SI': 5,
            'RM': 6,
            'UP': 7,
        }

        actions.forEach(a =>
            a.forEach(e => {
                let type = e[0];
                let location = [e[1], e[2]]
                let group = type_to_index[type];
                let index = self.location_to_index(location);
                self.config.add_object_to_array(self, group, index, frame_data_array);
            }));

        return frame_data_array;
    },
    update_function: function (group, switched_index, current_element, value) {
        current_element.hidden = value == 0;

        // Quantity
        if (group === 8) {
            current_element.innerHTML = value;
        }
    },
    additional_flipping: function (self, index) {
        return index;
    }
});

//MainFieldGenerator
const watch_table = document.getElementById('watch_table');
let fieldGenerator = new FieldGenerator(match_utils);
fieldGenerator.generate(watch_table);
const viewer_elements = fieldGenerator.get_viewer_elements();
const highlight_elements = fieldGenerator.get_hover_elements();

//SimulationSetupFieldGenerator
const simulation_table = document.getElementById('simulation_table');
let simulationFieldGenerator = new FieldGenerator(match_utils_simulator);
simulationFieldGenerator.generate(simulation_table);
const simulation_elements = simulationFieldGenerator.get_viewer_elements();

//Create MatchViewer
let match_viewer = new MatchViewer(match_utils, viewer_elements);
match_viewer.update_frame_data = e => match_viewer.update_data(e);
actionEventSystem.register(match_viewer);

//Create SimulationMatchViewer
let simulation_match_viewer = new MatchViewer(match_utils_simulator, simulation_elements);
simulation_match_viewer.set_actions = e => simulation_match_viewer.update_data(e);
actionEventSystem.register(simulation_match_viewer);

//Create ViewModel
let view_model = new ViewModel();
actionEventSystem.register(view_model);

//FlatMatchViewer
let flat_match_viewer = new MatchViewer(match_utils_flat, highlight_elements);

//ChangeDetector
let changeDetector = new ChangeDetector();

//Controller
let controller = new Controller(actionEventSystem, changeDetector);
actionEventSystem.register(controller);

//HoverInformation
let hoverInformation = new HoverInformation(match_viewer, flat_match_viewer, configTools, actionEventSystem);
actionEventSystem.register(hoverInformation);

//Slider
let replay_slider = new Slider($('#replay_slider'), actionEventSystem);
replay_slider.set_replay_data = function (data) { this.set_max_value(data.length - 1); }
replay_slider.update_frame_data = function (data) { this.set_current_value(data.turnInfo[3]); }
actionEventSystem.register(replay_slider);

//Downloader
let downloader = new Downloader();
downloader.filename = 'simulation.txt';
downloader.set_user_data = function (userdata) { this.filename = `${userdata.name.join('_VS_')}___${userdata.match_id[0]}.txt`; };
downloader.set_replay_raw = function (content) { this.content = content };
actionEventSystem.register(downloader);

//Play/Pause-AttributeToggler
let playPauseAttributeToggler = new AttributeToggler(document.getElementsByName('play_button_img'), 'hidden');
playPauseAttributeToggler.toggle_play = function () { this.toggle_attributes(); }
actionEventSystem.register(playPauseAttributeToggler);

//StateParser
let stateParser = new StateParser(actionEventSystem);
actionEventSystem.register(stateParser);

//Simulator
let startStringGenerator = new StartStringGenerator();
let socket = new Socket(actionEventSystem, startStringGenerator);
actionEventSystem.register(socket);

//SimulationIntegrator
let simulationIntegrator = new SimulationIntegrator(actionEventSystem);
actionEventSystem.register(simulationIntegrator);

//Mode highlighter
let modeHighlighter = {
    set_action_mode: function (mode) {
        mode_buttons = document.querySelectorAll('button[action="set_action_mode"]');
        mode_buttons.forEach(e => {
            if (e.getAttribute('parameter') == mode)
                e.classList.add('selected')
            else
                e.classList.remove('selected')
        });
    }
}
actionEventSystem.register(modeHighlighter);


window.addEventListener('mousemove', (e) => {
    let tile_size = Math.min(window.innerWidth, window.innerHeight) / 28;
    const round = (pixel) => Math.round((pixel - tile_size / 2) / tile_size);
    let location = [round(e.clientX), 27 - round(e.clientY)];
    if (!match_utils.is_in_arena_bounds(...location))
        location = [0, 0];
    actionEventSystem.release_event('show_field_info', location)
});

window.addEventListener('click', (e) => {
    let tile_size = Math.min(window.innerWidth, window.innerHeight) / 28;
    const round = (pixel) => Math.round((pixel - tile_size / 2) / tile_size);
    let location = [round(e.clientX), 27 - round(e.clientY)];
    if (match_utils.is_in_arena_bounds(...location))
        actionEventSystem.release_event('click_on_location', location)
});

//ActionManager
let actionManager = new ActionManager(actionEventSystem);
actionEventSystem.register(actionManager);

//Player
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
    type: "keydown"
},
{
    code: "ArrowLeft",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "previous_frame",
    type: "keydown"
},
{
    code: "ArrowRight",
    ctrlKey: true,
    shiftKey: false,
    altKey: false,
    callback: "next_turn",
    type: "keydown"
},
{
    code: "ArrowLeft",
    ctrlKey: true,
    shiftKey: false,
    altKey: false,
    callback: "previous_turn",
    type: "keydown"
},
{
    code: "ArrowUp",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "faster_playback",
    type: "keydown"
},
{
    code: "ArrowDown",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "slower_playback",
    type: "keydown"
},
{
    code: "Space",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "toggle_play",
    type: "keydown"
},
{
    code: "KeyX",
    ctrlKey: false,
    shiftKey: false,
    altKey: true,
    callback: "switch_view",
    type: "keydown"
},
{
    code: "ShiftLeft",
    ctrlKey: false,
    shiftKey: true,
    altKey: false,
    callback: "set_removal_mode",
    type: "keydown"
},
{
    code: "ShiftLeft",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "unset_removal_mode",
    type: "keyup"
},
{
    code: "ShiftRight",
    ctrlKey: false,
    shiftKey: true,
    altKey: false,
    callback: "set_removal_mode",
    type: "keydown"
},
{
    code: "ShiftRight",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "unset_removal_mode",
    type: "keyup"
},
{
    code: "Enter",
    ctrlKey: true,
    shiftKey: false,
    altKey: false,
    callback: "simulate",
    type: "keydown"
},
{
    code: "KeyF",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "set_action_mode",
    type: "keydown",
    parameter: "FF",
},
{
    code: "KeyE",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "set_action_mode",
    type: "keydown",
    parameter: "EF",
},
{
    code: "KeyD",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "set_action_mode",
    type: "keydown",
    parameter: "DF",
},
{
    code: "KeyP",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "set_action_mode",
    type: "keydown",
    parameter: "PI",
},
{
    code: "KeyM",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "set_action_mode",
    type: "keydown",
    parameter: "EI",
},
{
    code: "KeyS",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "set_action_mode",
    type: "keydown",
    parameter: "SI",
},
{
    code: "KeyU",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "set_action_mode",
    type: "keydown",
    parameter: "UP",
},
{
    code: "KeyR",
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    callback: "set_action_mode",
    type: "keydown",
    parameter: "RM",
}
].forEach(function (shortcut) {
    shortcutController.addNewShortcut(shortcut);
})

//Setup Button bindings
document.querySelectorAll('[action]').forEach(function (e) {
    e.addEventListener('click', () => actionEventSystem.release_event(e.getAttribute('action'), e.getAttribute('parameter')))
});

//Fancy Health-Bars
setInterval(() => {
    let health_values = [...document.getElementsByName('health')]
        .map(e => `${Math.max(parseInt(e.innerHTML)
            / configTools.get_starting_hp() * 100, 0)}%`);
    [...document.getElementsByName('health-bar')]
        .forEach((e, i) => e.style.width = health_values[i]);
}, 1000 / 60);