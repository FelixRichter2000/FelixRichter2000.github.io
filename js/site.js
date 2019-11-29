
DATA = {};
SORTED = {};
USERS = new Set();

USER_ALGOS = new Set();
LOADED_ALGOS = new Set();
USER_OPPONENTS = {};

logged_in_user = '';
loaded = 0;

//Update logged_in_user
$('#username').on('change', function () {
    logged_in_user = $(this).val();
    reloadOverviewPlayerData();
});

function reloadOverviewPlayerData() {
    USER_ALGOS = new Set();
    LOADED_ALGOS = new Set();
    USER_OPPONENTS = {};
    loadOverviewData();
}

//Load Leaderboard Data
for (var i = 1; i < 2; i++) {
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
                        .append($('<button>')
                            .attr('onClick', 'loadPlayer("' + d.user + '");')
                            .append($('<img width="20" height="20">')
                                .attr('src', d.avatarUrl))
                            .append(' ' + d.user)))
                );
        }
    }

    $('#numAlgos').html(numAlgos);
    $('#numPlayers').html(USERS.size);
}

