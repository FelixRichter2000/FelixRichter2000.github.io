// JavaScript source code
const match_utils = require('./match_utils');

test('Generate td contents with single source', () => {
    expect(match_utils.generate_default_td_contents(['1']))
        .toBe("<label class=\"quantity\"><img src=\"1\">");
});

test('Generate td contents with two sources (1, 2)', () => {
    expect(match_utils.generate_default_td_contents(['1', '2']))
        .toBe("<label class=\"quantity\"><img src=\"1\"><img src=\"2\">");
});

test('Generate td contents with two sources ("filter", "destructor", "encryptor")', () => {
    expect(match_utils.generate_default_td_contents(["filter", "destructor", "encryptor"]))
        .toBe("<label class=\"quantity\"><img src=\"filter\"><img src=\"destructor\"><img src=\"encryptor\">");
});


