$replay_table = $('#match_table');
$replay_range = $('#match_range');
$watch_on_terminal = $('#watch_on_terminal');
$replay_images = null;
$replay_tds = null;
TURN_INFORMATION = {};
current_match_data_index = 0;

const playerImages = [
    ['../images/Filter1.svg', '../images/Encryptor1.svg', '../images/Destructor1.svg', '../images/Ping1.svg', '../images/Emp1.svg', '../images/Scrambler1.svg', '../images/Remove1.svg'],
    ['../images/Filter2.svg', '../images/Encryptor2.svg', '../images/Destructor2.svg', '../images/Ping2.svg', '../images/Emp2.svg', '../images/Scrambler2.svg', '../images/Remove2.svg']];
const emptyImage = '../images/EmptyField.svg';

selected_match = 5472882;
onMatchChanged();

// repeat with the interval 
let showNextTimer = null;
function playMatch() {
    showNextTimer = setInterval(() => showNext(), 1000 / 60);
}

$replay_range.on('change', function () {
    showMatchData($(this).val());
    console.log($(this).val());
    clearInterval(showNextTimer);
});

$watch_on_terminal.on('click', function () {
    var win = window.open('https://terminal.c1games.com/watch/' + selected_match, '_blank');
    win.focus();
});

function onMatchChanged() {
    $('#match_id_label').html(selected_match);
    loadMatchData();
    current_match_data_index = 0;
}

function showNext() {
    for (var i = 0; i < 1; i++) {
        updateToNextFrame(current_match_data_index);
        current_match_data_index += 1;
    }
    $replay_range.val(current_match_data_index);
}

function loadMatchData() {
    $.ajax({
        url: "https://terminal.c1games.com/api/game/replayexpanded/" + selected_match
    }).done(function (result) {
        processMatchData(result);
        $replay_range.attr('max', Object.keys(TURN_INFORMATION).length - 1);
    });
}

function processMatchData(data) {
    TURN_INFORMATION = {};
    var splittet = data.split("\n");
    for (var i = 3; i < splittet.length - 2; i++) {
        var split = splittet[i];
        var parsed = JSON.parse(split);
        console.log(parsed);
        TURN_INFORMATION[i - 3] = parsed;
    }
    playMatch();
}

function updateToNextFrame(frame) {
    if (!(frame in TURN_INFORMATION)) return;

    var info = TURN_INFORMATION[frame];

    var spawns = info.events.spawn;
    for (var i = 0; i < spawns.length; i++) {
        var spawn = spawns[i];

        var at = spawn[0];
        var type = spawn[1];
        var player = spawn[3] - 1;

        var currentImage = playerImages[player][type];

        setImg(at, currentImage);
    }

    var moves = info.events.move;
    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];

        var from = move[0];
        var to = move[1];
        var type = move[3];
        var player = move[5] - 1;

        var currentImage = playerImages[player][type];

        setImg(from, emptyImage);
        setImg(to, currentImage);
    }

    var deaths = info.events.death;
    for (var i = 0; i < deaths.length; i++) {
        var death = deaths[i];

        var at = death[0];
        var type = death[1];
        var player = death[3] - 1;

        setImg(at, emptyImage);
    }
}

function setImg(location, path) {
    var x = location[0];
    var y = location[1];
    var td = $replay_tds[(27 - y) * 28 + x];
    var img = $(td).find('img')[0];
    img.src = path;
}

function showMatchData(i) {
    if (!(i in TURN_INFORMATION)) return;

    $replay_images.attr('src', emptyImage);

    var info = TURN_INFORMATION[i];

    var units = [info.p1Units, info.p2Units];

    for (var playerIndex = 0; playerIndex < units.length; playerIndex++) {
        var playerUnits = units[playerIndex];
        var images = playerImages[playerIndex];

        for (var imageIndex = 0; imageIndex < images.length; imageIndex++) {
            var currentUnits = playerUnits[imageIndex];
            var currentImage = images[imageIndex];

            for (var unit in currentUnits) {
                unit = currentUnits[unit];
                var x = parseInt(unit[0]);
                var y = parseInt(unit[1]);

                var td = $replay_tds[(27 - y) * 28 + x];
                var img = $(td).find('img')[0];

                img.src = currentImage;
            }
        }
    }
}

//Create initial field table
(function () {
    for (var y = 0; y < 28; y++) {
        var new_row = $('<tr>');
        for (var x = 0; x < 28; x++) {
            var new_td = $('<td>');

            if (Math.abs(x - 13.5) + Math.abs(y - 13.5) < 15) {
                new_td.append($('<img>')
                    .attr('id', (27 - y) * 1000 + x)
                    .attr('src', '../images/EmptyField.svg'));
            }
            new_row
                .append(new_td);
        }
        $replay_table
            .append(new_row);
    }
    $replay_images = $replay_table.find('img');
    $replay_tds = $replay_table.find('td');
})();