$('#watch_on_terminal').on('click', function () {
    var win = window.open('https://terminal.c1games.com/watch/' + ReplayManager.get_match_id(), '_blank');
    win.focus();
});

$(document).ready(function () {
    ReplayManager.set_match_id(5979377);
    //ReplayManager.set_match_id(5472882);
});

function onMatchChanged(id) {
    ReplayManager.set_match_id(id);
}