
//Load Leaderboard Data
for (var i = 1; i < parseInt(urlParams.get('amount')) + 1; i++) {
    $.ajax({
        url: "https://terminal.c1games.com/api/game/leaderboard?page=" + i.toString()
    }).done(function (result) {
        //console.log(result);

        var algos = result.data.algos;
        for (var i = 0; i < algos.length; i++) {

            //console.log(algos[i]);
            handleAlgo(algos[i]);

            if (urlParams.get('recursive') === 'false')
                continue;

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
                    updateLeaderboardTable();
                }
            });
        }

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
            algo_data = r[v];
            numAlgos++;

            table
                .prepend($('<tr>')
                    .append($('<td>')
                        .append($('<a>')
                            .attr('href', 'https://bcverdict.github.io/?id=' + algo_data.id)
                            .attr('target', '_blanc')
                            .append(algo_data.id)))
                    .append($('<td>')
                        .append(algo_data.rating))
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
                );
        }
    }

    $('#numAlgos').html(numAlgos);
    $('#numPlayers').html(USERS.size);
}

