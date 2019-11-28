
DATA = {};
SORTED = {};
USERS = new Set();

loaded = 0



for (var i = 1; i < 6; i++) {
    $.ajax({
        url: "https://terminal.c1games.com/api/game/leaderboard?page=" + i.toString()
    }).done(function (result) {
        console.log(result);

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
                    updateTable();
                }
            });
        }

        updateTable();
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

function updateTable() {
    table = $('#table');
    table.html("");

    numAlgos = 0;

    //for (var d in DATA) {
    //    d = DATA[d];

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

function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("table");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 0; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("td")[1];
            y = rows[i + 1].getElementsByTagName("td")[1];
            // Check if the two rows should switch place:
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                // If so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}