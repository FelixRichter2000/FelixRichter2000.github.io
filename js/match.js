$replay_table = $('#match_table');
$replay_range = $('#match_range');
$watch_on_terminal = $('#watch_on_terminal');
$replay_images = null;
$replay_labels = null;
$replay_tds = null;
TURN_INFORMATION = {};
current_match_data_index = 0;
playback_speed = 30;
var showNextTimer = null;
var play = false;
//Play/Pause button
var $playButton = $(".togglePlay");

const playerImages = [
    ['../images/Filter1.svg', '../images/Encryptor1.svg', '../images/Destructor1.svg', '../images/Ping1.svg', '../images/Emp1.svg', '../images/Scrambler1.svg', '../images/Remove1.svg'],
    ['../images/Filter2.svg', '../images/Encryptor2.svg', '../images/Destructor2.svg', '../images/Ping2.svg', '../images/Emp2.svg', '../images/Scrambler2.svg', '../images/Remove2.svg']];
const emptyImage = '../images/EmptyField.svg';

$(document).ready(function () {

    $playButton.toggleClass("paused");
    $playButton.click(function () {
        $playButton.toggleClass("paused");
        play = $playButton.hasClass("paused");
    });

    //Initializations
    createMatchTable();
    selected_match = 5472882;
    onMatchChanged();

    //MatchReplayLoop
    setMatchSpeed(playback_speed);
});

function playMatch() {
    play = true;
    $playButton.addClass("paused");
    showMatchData(0);
    current_match_data_index = 0;
}

function stopMatch() {
    play = false;
    $playButton.removeClass("paused");
}

function setMatchSpeed(speed) {
    if (showNextTimer)
        clearInterval(showNextTimer);
    showNextTimer = setInterval(() => showNext(), 1000 / speed);
}

function showNext() {
    if (!play) return;

    for (var i = 0; i < 1; i++) {
        updateToNextFrame(current_match_data_index);
        current_match_data_index += 1;
    }

    updateReplayRangeSlider();
}

function updateReplayRangeSlider() {
    $replay_range.val(current_match_data_index);
}

$replay_range.on('input', function () {
    current_match_data_index = parseInt($(this).val());
    showMatchData(current_match_data_index);
    stopMatch();
});

$watch_on_terminal.on('click', function () {
    var win = window.open('https://terminal.c1games.com/watch/' + selected_match, '_blank');
    win.focus();
});

function onMatchChanged() {
    $('#match_id_label').html(selected_match);
    stopMatch();
    resetReplayTable();

    loadMatchData();
    current_match_data_index = 0;
    updateReplayRangeSlider();
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

var dict = {};
function setImg(location, path, type = -1) {
    var x = location[0];
    var y = location[1];
    var td = $replay_tds[(27 - y) * 28 + x];
    var img = $(td).find('img')[0];
    img.src = path;
}

function resetReplayTable() {
    $replay_images.attr('src', emptyImage);
    $replay_labels.html('');
}

function showMatchData(i) {
    if (!(i in TURN_INFORMATION)) return;

    resetReplayTable();

    var info = TURN_INFORMATION[i];

    var units = [info.p1Units, info.p2Units];

    for (var playerIndex = 0; playerIndex < units.length; playerIndex++) {
        var playerUnits = units[playerIndex];
        var images = playerImages[playerIndex];

        for (var imageIndex = 0; imageIndex < images.length; imageIndex++) {
            var currentUnits = playerUnits[imageIndex];
            var currentImage = images[imageIndex];

            var dict = {};

            for (var unit in currentUnits) {
                unit = currentUnits[unit];
                var x = parseInt(unit[0]);
                var y = parseInt(unit[1]);

                var location = (27 - y) * 28 + x;

                dict[location] = (location in dict ? dict[location] : 0) + 1;

                var td = $replay_tds[location];
                var img = $(td).find('img')[0];
                var label = $(td).find('label')[0];

                img.src = currentImage;

                if (imageIndex > 2 && imageIndex < 6) {
                    label.innerHTML = dict[location];
                }
            }
        }
    }
}

//Create initial field table
function createMatchTable() {
    for (var y = 0; y < 28; y++) {
        var new_row = $('<tr>');
        for (var x = 0; x < 28; x++) {
            var new_td = $('<td>');

            if (Math.abs(x - 13.5) + Math.abs(y - 13.5) < 15) {
                new_td
                    .append($('<label>')
                        .addClass('IULabel'));

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
    $replay_labels = $replay_table.find('label');
    $replay_tds = $replay_table.find('td');
}