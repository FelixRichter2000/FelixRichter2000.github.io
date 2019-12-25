function reloadOverviewPlayerData() {
    USER_ALGOS = new Set();
    LOADED_ALGOS = new Set();
    USER_OPPONENTS = {};

    updateUserAlgos();
    loadMissingMatchData();
}

function updateUserAlgos() {
    for (var i in DATA) {
        var d = DATA[i];
        if (d.user == selected_user) {
            USER_ALGOS.add(d.id);
        }
    }
}

function loadMissingMatchData() {
    Array.from(USER_ALGOS).forEach(function (i) {
        if (!LOADED_ALGOS.has(i)) {
            LOADED_ALGOS.add(i);
            $.ajax({
                url: "https://terminal.c1games.com/api/game/algo/" + i.toString() + "/matches"
            }).done(function (result) {
                matches = result.data.matches;
                for (var m = 0; m < matches.length; m++) {

                    match = matches[m]

                    losing = match.losing_algo;
                    winning = match.winning_algo;

                    //Check if I won
                    var haveIwon = winning.user == selected_user;

                    handleAlgo(winning);
                    handleAlgo(losing);

                    var other_algo_id = haveIwon ? losing.id : winning.id;

                    //Add algo_id as new key with another dictionary as value, if it doesn't exist.
                    if (!(other_algo_id in USER_OPPONENTS)) {
                        USER_OPPONENTS[other_algo_id] = {};
                    }

                    USER_OPPONENTS[other_algo_id][i] = {
                        haveIwon: haveIwon,
                        match_id: match.id
                    };
                }
                updateOverviewTable();
            });
        }
    });
}

function updateOverviewTable() {
    var table = $('#overview_table');
    table.html("");

    numAlgos = 0;

    for (var opponent_ids in SORTED) {
        for (var opponent_id in SORTED[opponent_ids]) {
            opponent_id = SORTED[opponent_ids][opponent_id].id;
            if (opponent_id in USER_OPPONENTS) {
                opponent = USER_OPPONENTS[opponent_id];
                algo_data = DATA[opponent_id];
                var row = $('<tr>')
                    .append($('<td>')
                        .append($('<button>')
                            .attr('onclick', 'loadAlgo(' + algo_data.id + ');')
                            .append(algo_data.name)))
                    .append($('<td>')
                        .append($('<button>')
                            .attr('onclick', 'loadPlayer("' + algo_data.user + '");')
                            .append($('<img width="20" height="20">')
                                .attr('src', algo_data.avatarUrl))
                            .append(' ' + algo_data.user)))
                Array.from(USER_ALGOS).forEach(function (i) {
                    var td = $('<td>')
                        .addClass(i in opponent ? opponent[i].haveIwon == true ? 'won' : 'lost' : '');
                    if (i in opponent) {
                        td
                            .append($('<button>')
                                .attr('onclick', 'loadMatch(' + opponent[i].match_id + ');')
                                .html('&nbsp;'));
                    }
                    row.append(td);
                });
                table.prepend(row);
            }
        }
    }

    var row = $('<tr>')
        .append($('<th>'))
        .append($('<th>'));
    Array.from(USER_ALGOS).forEach(function (i) {
        algo_data = DATA[i];
        row.append($('<th>')
            .append($('<button>')
                .attr('onclick', 'loadAlgo(' + algo_data.id + ');')
                .append(DATA[i].name + ' - (' + DATA[i].rating + ')')))
    });
    table.prepend(row);
}