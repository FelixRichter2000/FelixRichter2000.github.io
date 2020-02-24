const match_utils = require('./match_utils');

describe('Test generate_default_td_contents', function () {

    test('single source', () => {
        expect(match_utils.generate_default_td_contents(['1']))
            .toMatchSnapshot();
    });

    test('two sources (1, 2)', () => {
        expect(match_utils.generate_default_td_contents(['1', '2']))
            .toMatchSnapshot();
    });

    test('multiple ("filter", "destructor", "encryptor")', () => {
        expect(match_utils.generate_default_td_contents(["filter", "destructor", "encryptor"]))
            .toMatchSnapshot();
    });

});


describe('Test generate_settings', function () {

    test('size 4', () => {
        expect(match_utils.generate_settings(4))
            .toEqual({ "half_size": 2, "size": 4 });
    });

    test('size 8', () => {
        expect(match_utils.generate_settings(8))
            .toEqual({ "half_size": 4, "size": 8 });
    });

});


describe('Test is_in_arena_bounds', function () {

    test('expect false (1)', () => {
        expect(match_utils.is_in_arena_bounds(0, 0, { size: 4, half_size: 2 }))
            .toBe(false);
    });

    test('expect false (2)', () => {
        expect(match_utils.is_in_arena_bounds(0, 3, { size: 4, half_size: 2 }))
            .toBe(false);
    });

    test('expect false (3)', () => {
        expect(match_utils.is_in_arena_bounds(3, 3, { size: 4, half_size: 2 }))
            .toBe(false);
    });

    test('expect false (4)', () => {
        expect(match_utils.is_in_arena_bounds(3, 0, { size: 4, half_size: 2 }))
            .toBe(false);
    });

    test('expect true (1)', () => {
        expect(match_utils.is_in_arena_bounds(0, 1, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (2)', () => {
        expect(match_utils.is_in_arena_bounds(0, 2, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (3)', () => {
        expect(match_utils.is_in_arena_bounds(1, 0, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (4)', () => {
        expect(match_utils.is_in_arena_bounds(1, 1, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (5)', () => {
        expect(match_utils.is_in_arena_bounds(1, 2, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (6)', () => {
        expect(match_utils.is_in_arena_bounds(1, 3, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (7)', () => {
        expect(match_utils.is_in_arena_bounds(2, 0, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (8)', () => {
        expect(match_utils.is_in_arena_bounds(2, 1, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (9)', () => {
        expect(match_utils.is_in_arena_bounds(2, 2, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (10)', () => {
        expect(match_utils.is_in_arena_bounds(2, 3, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (11)', () => {
        expect(match_utils.is_in_arena_bounds(3, 1, { size: 4, half_size: 2 }))
            .toBe(true);
    });

    test('expect true (12)', () => {
        expect(match_utils.is_in_arena_bounds(3, 2, { size: 4, half_size: 2 }))
            .toBe(true);
    });

});


describe('Test generate_terminal_trs', function () {

    test('Generate generate_terminal_trs size 4', () => {
        expect(match_utils.generate_terminal_trs({ size: 4, half_size: 2 }, '.'))
            .toMatchSnapshot();
    });

    test('Generate generate_terminal_trs size 8', () => {
        expect(match_utils.generate_terminal_trs({ size: 8, half_size: 4 }, '.'))
            .toMatchSnapshot();
    });

});


describe('Test put_value_in_range', function () {

    test('Generate put_value_in_range -1 range(0, 4)', () => {
        expect(match_utils.put_value_in_range(-1, {min: 0, max: 4 }))
            .toBe(0);
    });

    test('Generate put_value_in_range 1 range(0, 4)', () => {
        expect(match_utils.put_value_in_range(1, { min: 0, max: 4 }))
            .toBe(1);
    });

    test('Generate put_value_in_range 10 range(0, 4)', () => {
        expect(match_utils.put_value_in_range(10, { min: 0, max: 4 }))
            .toBe(4);
    });

});


