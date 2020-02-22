const match_utils = require('./match_utils');

//////////////////////////////////////////////
//Test function generate_default_td_contents//
//////////////////////////////////////////////
test('Generate td contents with single source', () => {
    expect(match_utils.generate_default_td_contents(['1']))
        .toBe("<label class=\"quantity\"></label><img src=\"1\">");
});

test('Generate td contents with two sources (1, 2)', () => {
    expect(match_utils.generate_default_td_contents(['1', '2']))
        .toBe("<label class=\"quantity\"></label><img src=\"1\"><img src=\"2\">");
});

test('Generate td contents with multiple real ("filter", "destructor", "encryptor")', () => {
    expect(match_utils.generate_default_td_contents(["filter", "destructor", "encryptor"]))
        .toBe("<label class=\"quantity\"></label><img src=\"filter\"><img src=\"destructor\"><img src=\"encryptor\">");
});


///////////////////////////////////
//Test function generate_settings//
///////////////////////////////////
test('Generate setting size 4', () => {
    expect(match_utils.generate_settings(4))
        .toEqual({ "half_size": 2, "size": 4 });
});

test('Generate setting size 8', () => {
    expect(match_utils.generate_settings(8))
        .toEqual({ "half_size": 4, "size": 8 });
});


////////////////////////////////////
//Test function is_in_arena_bounds//
////////////////////////////////////
test('Test is_in_arena_bounds expect false (1)', () => {
    expect(match_utils.is_in_arena_bounds(0, 0, {size: 4, half_size: 2}))
        .toBe(false);
});

test('Test is_in_arena_bounds expect false (2)', () => {
    expect(match_utils.is_in_arena_bounds(0, 3, { size: 4, half_size: 2 }))
        .toBe(false);
});

test('Test is_in_arena_bounds expect false (3)', () => {
    expect(match_utils.is_in_arena_bounds(3, 3, { size: 4, half_size: 2 }))
        .toBe(false);
});

test('Test is_in_arena_bounds expect false (4)', () => {
    expect(match_utils.is_in_arena_bounds(3, 0, { size: 4, half_size: 2 }))
        .toBe(false);
});

test('Test is_in_arena_bounds expect true (1)', () => {
    expect(match_utils.is_in_arena_bounds(0, 1, { size: 4, half_size: 2 }))
        .toBe(true);
});

test('Test is_in_arena_bounds expect true (2)', () => {
    expect(match_utils.is_in_arena_bounds(0, 2, { size: 4, half_size: 2 }))
        .toBe(true);
});

test('Test is_in_arena_bounds expect true (3)', () => {
    expect(match_utils.is_in_arena_bounds(1, 0, { size: 4, half_size: 2 }))
        .toBe(true);
});

test('Test is_in_arena_bounds expect true (4)', () => {
    expect(match_utils.is_in_arena_bounds(1, 1, { size: 4, half_size: 2 }))
        .toBe(true);
});

test('Test is_in_arena_bounds expect true (5)', () => {
    expect(match_utils.is_in_arena_bounds(1, 2, { size: 4, half_size: 2 }))
        .toBe(true);
});

test('Test is_in_arena_bounds expect true (6)', () => {
    expect(match_utils.is_in_arena_bounds(1, 3, { size: 4, half_size: 2 }))
        .toBe(true);
});

test('Test is_in_arena_bounds expect true (7)', () => {
    expect(match_utils.is_in_arena_bounds(2, 0, { size: 4, half_size: 2 }))
        .toBe(true);
});

test('Test is_in_arena_bounds expect true (8)', () => {
    expect(match_utils.is_in_arena_bounds(2, 1, { size: 4, half_size: 2 }))
        .toBe(true);
});

test('Test is_in_arena_bounds expect true (9)', () => {
    expect(match_utils.is_in_arena_bounds(2, 2, { size: 4, half_size: 2 }))
        .toBe(true);
});

test('Test is_in_arena_bounds expect true (10)', () => {
    expect(match_utils.is_in_arena_bounds(2, 3, { size: 4, half_size: 2 }))
        .toBe(true);
});

test('Test is_in_arena_bounds expect true (11)', () => {
    expect(match_utils.is_in_arena_bounds(3, 1, { size: 4, half_size: 2 }))
        .toBe(true);
});

test('Test is_in_arena_bounds expect true (12)', () => {
    expect(match_utils.is_in_arena_bounds(3, 2, { size: 4, half_size: 2 }))
        .toBe(true);
});


///////////////////////////////////////
//Test function generate_terminal_trs//
///////////////////////////////////////
test('Generate generate_terminal_trs size 4', () => {
    expect(match_utils.generate_terminal_trs({ size: 4, half_size: 2 }, '.'))
        .toBe("<tr><td></td><td>.</td><td>.</td><td></td></tr><tr><td>.</td><td>.</td><td>.</td><td>.</td></tr><tr><td>.</td><td>.</td><td>.</td><td>.</td></tr><tr><td></td><td>.</td><td>.</td><td></td></tr>");
});


