
DATA = {};
SORTED = {};
USERS = new Set();

USER_ALGOS = new Set();
LOADED_ALGOS = new Set();
USER_OPPONENTS = {};

logged_in_user = 'Felix';
loaded = 0;

//Update logged_in_user
$('#username').on('change', function () {
    logged_in_user = $(this).val();
    USER_ALGOS = new Set();
    LOADED_ALGOS = new Set();
    USER_OPPONENTS = {};

    loadOverviewData();
});

//Load Leaderboard Data
for (var i = 1; i < 6; i++) {
    $.ajax({
        url: "https://terminal.c1games.com/api/game/leaderboard?page=" + i.toString()
    }).done(function (result) {
        //console.log(result);

        var algos = result.data.algos;
        for (var i = 0; i < algos.length; i++) {

            //console.log(algos[i]);
            handleAlgo(algos[i]);

            $.ajax({
                url: "https://terminal.c1games.com/api/game/algo/" + algos[i].id + "/matches"
            }).done(function (result) {
                //console.log(result);

                matches = result.data.matches;
                for (var i = 0; i < matches.length; i++) {

                    match = matches[i]

                    losing = match.losing_algo;
                    winning = match.winning_algo;

                    handleAlgo(losing);
                    handleAlgo(winning);
                }

                //console.log(DATA);

                loaded++;
                if (loaded % 10 == 0) {
                    loadOverviewData();
                    updateLeaderboardTable();
                }
            });
        }

        loadOverviewData();
        updateLeaderboardTable();
    });
}

function handleAlgo(algo) {
    if (!(algo.id in DATA)) {
        DATA[algo.id] = algo;

        if (!(algo.rating in SORTED)) {
            SORTED[algo.rating] = [];
        }
        SORTED[algo.rating].push(algo)
    }

    if (!(algo.user in USERS)) {
        USERS.add(algo.user);
    }
}

function updateLeaderboardTable() {
    var table = $('#leaderboard_table');
    table.html("");

    numAlgos = 0;

    for (var r in SORTED) {

        r = SORTED[r];
        for (var v in r) {
            d = r[v];
            numAlgos++;

            table
                .prepend($('<tr>')
                    .append($('<td>')
                        .append($('<a>')
                            .attr('href', 'https://bcverdict.github.io/?id=' + d.id)
                            .attr('target', '_blanc')
                            .append(d.id)))
                    .append($('<td>')
                        .append(d.rating))
                    .append($('<td>')
                        .append(d.name))
                    .append($('<td>')
                        .append($('<img width="20" height="20">')
                            .attr('src', d.avatarUrl))
                        .append(' ' + d.user))
                );
        }
    }

    $('#numAlgos').html(numAlgos);
    $('#numPlayers').html(USERS.size);
}

function loadOverviewData() {
    updateUserAlgos();
    loadMissingMatchData();
}

function updateUserAlgos() {
    for (var i in DATA) {
        var d = DATA[i];
        if (d.user == logged_in_user) {
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
                    var haveIwon = winning.user == logged_in_user;

                    handleAlgo(haveIwon ? losing : winning);
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

                var row = $('<tr>')
                    .append($('<td>')
                        .append(DATA[opponent_id].name))
                    .append($('<td>')
                        .append(DATA[opponent_id].user));
                Array.from(USER_ALGOS).forEach(function (i) {
                    var td = $('<td>')
                        .addClass(i in opponent ? opponent[i].haveIwon == true ? 'won' : 'lost' : '');
                    if (i in opponent) {
                        td.append($('<a target="_blank">')
                            .attr('href', 'https://terminal.c1games.com/watch/' + opponent[i].match_id)
                            .html('&nbsp;')
                        );
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
        row.append($('<th>')
            .append(DATA[i].name));
    });
    table.prepend(row);
}