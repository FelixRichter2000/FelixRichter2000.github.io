//ActionEventSystem
let actionEventSystem = new ActionEventSystem();
actionEventSystem.registerFollowUpEvent('switch_view', 'update_hover')
actionEventSystem.registerFollowUpEvent('show_data', 'update_hover')

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
        // user_data_algos = result.algos;
    });

//HoverInformation
let hoverInformation = new HoverInformation(match_viewer, flat_match_viewer, configTools);
actionEventSystem.register(hoverInformation);

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