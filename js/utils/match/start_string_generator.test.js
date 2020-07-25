const StartStringGenerator = require("./start_string_generator");
let default_game_state = {
    "p2Units": [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ],
    "turnInfo": [0, 12, -1, 843],
    "p1Stats": [24, 18, 6.7, 114],
    "p1Units": [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ],
    "p2Stats": [21, 5, 14.2, 14],
    "events": { "selfDestruct": [], "breach": [], "damage": [], "shield": [], "move": [], "spawn": [], "death": [], "attack": [], "melee": [] }
};


describe('create StartStringGenerator', () => {
    it('should not throw an error', () => {
        new StartStringGenerator();
    });
});

describe('generate start_string', () => {
    it('should use the default string and substitute the parameter', () => {
        let start_string_generator = new StartStringGenerator();
        let start_string = start_string_generator.generate(default_game_state);
        expect(start_string).toBe('n[{"game_to_client":0,"player_1_err":1,"player_2_err":2,"game_over":3,"notification":4},{"algo_zip":0},"%7B%22player_1%22%3A%22manual%22%2C%22player_2%22%3A%22manual%22%2C%22p1_use_old_config%22%3Afalse%2C%22p2_use_old_config%22%3Afalse%2C%22start_string%22%3A%22%7B%5C%22p2Units%5C%22%3A%5B%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%5D%2C%5C%22turnInfo%5C%22%3A%5B0%2C12%2C-1%2C843%5D%2C%5C%22p1Stats%5C%22%3A%5B24%2C18%2C6.7%2C114%5D%2C%5C%22p1Units%5C%22%3A%5B%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%2C%5B%5D%5D%2C%5C%22p2Stats%5C%22%3A%5B21%2C5%2C14.2%2C14%5D%2C%5C%22events%5C%22%3A%7B%5C%22selfDestruct%5C%22%3A%5B%5D%2C%5C%22breach%5C%22%3A%5B%5D%2C%5C%22damage%5C%22%3A%5B%5D%2C%5C%22shield%5C%22%3A%5B%5D%2C%5C%22move%5C%22%3A%5B%5D%2C%5C%22spawn%5C%22%3A%5B%5D%2C%5C%22death%5C%22%3A%5B%5D%2C%5C%22attack%5C%22%3A%5B%5D%2C%5C%22melee%5C%22%3A%5B%5D%7D%7D%22%2C%22match_name%22%3A%22%22%2C%22config_id%22%3Anull%2C%22config_type%22%3Anull%7D"]');
    });
});