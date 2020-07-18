//ActionEventSystem
let actionEventSystem = new ActionEventSystem();
actionEventSystem.registerFollowUpEvent('switch_view', 'update_hover')
actionEventSystem.registerFollowUpEvent('update_frame_data', 'update_hover')

//Get match id from query
let urlParams = new URLSearchParams(window.location.search);
let match_id = urlParams.get('id') || 5979377;

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

new ReplayDownloader()
    .download(match_id)
    .then((result) => {
        controller.set_replay_data(result.replay);
        configTools.setConfig(result.config);
        // raw_replay = result.raw;
    });
new UserDataDownloader()
    .download(match_id)
    .then((result) => {

        //Transform data
        let names = Object.getOwnPropertyNames(result.algos[0]);
        let transformed = names
            .map(element => result.algos
                .reduce((a, algo) => [...a, algo[element]], []))
            .reduce((a, values, index) => ({...a, [names[index]]: values }), {});

        actionEventSystem.release_event('update_view', transformed);
    });

//HoverInformation
let hoverInformation = new HoverInformation(match_viewer, flat_match_viewer, configTools, actionEventSystem);
actionEventSystem.register(hoverInformation);

//Play/Pause-AttributeToggler
let playPauseAttributeToggler = new AttributeToggler(document.getElementsByName('play_button_img'), 'hidden');
playPauseAttributeToggler.toggle_play = function() { this.toggle_attributes(); }
actionEventSystem.register(playPauseAttributeToggler);

//StateParser
let stateParser = new StateParser(actionEventSystem);
actionEventSystem.register(stateParser);

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