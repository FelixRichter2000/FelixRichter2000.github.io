const ViewModel = require('./view_model');

describe('test ViewModel', () => {
    test('create', () => {
        new ViewModel();
    });

    test('update_view with hans', () => {
        document.body.innerHTML = `
        <label name="username">defaultUsername</label>
        `;

        let viewModel = new ViewModel();
        viewModel.update_view({ username: ['hans'] });
        expect(document.getElementsByName('username')[0].innerHTML).toEqual('hans');
    });

    test('update_view with another value', () => {
        document.body.innerHTML = `
        <label name="username">defaultUsername</label>
        `;

        let viewModel = new ViewModel();
        viewModel.update_view({ username: ['another_value'] });
        expect(document.getElementsByName('username')[0].innerHTML).toEqual('another_value');
    });


    test('update_view and element does not exist expect no error', () => {
        document.body.innerHTML = `
        `;

        let viewModel = new ViewModel();
        viewModel.update_view({ username: ['another_value'] });
    });

    test('update_view with multiple elements with the same name and multiple values', () => {
        document.body.innerHTML = `
        <label name="username">defaultUsername1</label>
        <label name="username">defaultUsername2</label>
        `;

        let viewModel = new ViewModel();
        viewModel.update_view({ username: ['another_value1', 'another_value2'] });
        expect([...document.getElementsByName('username')].map(e => e.innerHTML)).toEqual(['another_value1', 'another_value2']);
    });

    test('switch_view after update_view should reverse order', () => {
        document.body.innerHTML = `
        <label name="username">defaultUsername1</label>
        <label name="username">defaultUsername2</label>
        `;

        let viewModel = new ViewModel();
        viewModel.update_view({ username: ['another_value1', 'another_value2'] });
        viewModel.switch_view();
        expect([...document.getElementsByName('username')].map(e => e.innerHTML)).toEqual(['another_value2', 'another_value1']);
    });


    test('update_view after switch_view should reverse order', () => {
        document.body.innerHTML = `
        <label name="username">defaultUsername1</label>
        <label name="username">defaultUsername2</label>
        `;

        let viewModel = new ViewModel();
        viewModel.switch_view();
        viewModel.update_view({ username: ['another_value1', 'another_value2'] });
        expect([...document.getElementsByName('username')].map(e => e.innerHTML)).toEqual(['another_value2', 'another_value1']);
    });

    test('update_view with multiple different namees', () => {
        document.body.innerHTML = `
        <label name="username">defaultUsername1</label>
        <label name="username">defaultUsername2</label>
        <label name="algoname">defaultAlgoname1</label>
        <label name="algoname">defaultAlgoname2</label>
        `;

        let viewModel = new ViewModel();
        viewModel.update_view({
            username: ['another_value1', 'another_value2'],
            algoname: ['another_value10', 'another_value20']
        });
        expect([...document.getElementsByName('username')].map(e => e.innerHTML)).toEqual(['another_value1', 'another_value2']);
        expect([...document.getElementsByName('algoname')].map(e => e.innerHTML)).toEqual(['another_value10', 'another_value20']);
    });

    test('update_view with multiple different namees and switch view after', () => {
        document.body.innerHTML = `
        <label name="username">defaultUsername1</label>
        <label name="username">defaultUsername2</label>
        <label name="algoname">defaultAlgoname1</label>
        <label name="algoname">defaultAlgoname2</label>
        `;

        let viewModel = new ViewModel();
        viewModel.update_view({
            username: ['another_value1', 'another_value2'],
            algoname: ['another_value10', 'another_value20']
        });
        viewModel.switch_view();
        expect([...document.getElementsByName('username')].map(e => e.innerHTML)).toEqual(['another_value2', 'another_value1']);
        expect([...document.getElementsByName('algoname')].map(e => e.innerHTML)).toEqual(['another_value20', 'another_value10']);
    });
});