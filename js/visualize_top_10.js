let urlParams = new URLSearchParams(window.location.search);
let amount = urlParams.get('amount') || 10;
let filter_per_player = urlParams.get('filter') || 'all';

window.onload = () => main(amount, filter_per_player);
let handled_match_ids = new Set();

async function main(amount, all_per_player) {
    const leaderboard_data = await get_leaderboard_data(amount);
    console.log(leaderboard_data)
    let top_algo_ids;

    if (all_per_player == 'all') {
        const top_ten_user_ids = await get_top_ten_user_ids(leaderboard_data);
        console.log(top_ten_user_ids)
        top_algo_ids = await get_top_ten_algo_ids(top_ten_user_ids);
        console.log(top_algo_ids)
    } else {
        top_algo_ids = get_algo_ids(leaderboard_data);
    }
    const set_algo_ids = new Set(top_algo_ids.map(e => e[1]));

    //Create empty table
    createTable(leaderboard_data, top_algo_ids);

    const matches_between_top_algos = await get_matches_between_top_algos(top_algo_ids);
    matches_between_top_algos.forEach(e => e.then(result => update_matches_in_table(result, top_algo_ids, set_algo_ids)));
}

function get_algo_ids(leaderboard_data) {
    return leaderboard_data.map((e, i) => [i, e.id, e.name]);
}

async function get_leaderboard_data(amount) {
    const leaderboard = await fetch_json('https://terminal.c1games.com/api/game/leaderboard')
    return leaderboard.data.algos.slice(0, amount);
}

async function get_top_ten_user_ids(leaderboard_data) {
    return await leaderboard_data.map(v => [v.user.id, v.team != null]);
}

async function get_top_ten_algo_ids(top_ten_user_ids) {
    let all_algos = await Promise.all(top_ten_user_ids.map(e => fetch_json(`https://terminal.c1games.com/api/game/user/${e[0]}/algos?team=${e[1]}`)))
    return [...all_algos.reduce((a, user_data, user_rank) => [...a, ...user_data.data.algos.map(algo => [user_rank, algo.id, algo.name])], [])]
}

async function get_matches_between_top_algos(top_algo_ids) {
    return await top_algo_ids.map(algo => fetch_json(`https://terminal.c1games.com/api/game/algo/${algo[1]}/matches`))
}

async function fetch_json(request) {
    const response = await fetch(request)
    if (response.status != 200) {
        console.log(`failed to retrieve data: ${request}`)
        console.log(response);
        return {
            data: { matches: [] }
        }
    }
    return await response.json()
}

function createTable(leaderboard_data, top_algo_ids) {
    var table = document.getElementById("visualize_table");

    //Row algo
    var current_row = table.insertRow();
    current_row.insertCell();
    current_row.insertCell();
    top_algo_ids.forEach((algo, i) => {
        let th = document.createElement('th');
        th.innerHTML = `<span>${algo[2]}</span>`;
        current_row.appendChild(th);
    });

    //Row avatar img
    var current_row = table.insertRow();
    current_row.insertCell();
    current_row.insertCell();
    top_algo_ids.forEach((algo, i) => {
        let td = current_row.insertCell();
        td.innerHTML = `<img src=${leaderboard_data[algo[0]].user.avatarUrl}/>`;
    });

    //Data rows
    top_algo_ids.forEach((algo, row_index) => {
        var current_row = table.insertRow();
        let userName = current_row.insertCell();
        userName.innerHTML = algo[2];
        let avatarImage = current_row.insertCell();
        avatarImage.innerHTML = `<img src=${leaderboard_data[algo[0]].user.avatarUrl}/>`;
        top_algo_ids.forEach(() => {
            current_row.insertCell();
        });
    });

    //Set header hights correctly
    $('table th').height(Math.max(...$('table th span').map(function() { return $(this).width() })));
}

function update_matches_in_table(result, top_algo_ids, set_algo_ids) {
    var table = document.getElementById("visualize_table");

    let matches = result.data.matches;
    matches.forEach(m => {
        if (handled_match_ids.has(m.id))
            return;
        handled_match_ids.add(m.id);

        let winning = m.winning_algo.id;
        let loosing = m.losing_algo.id;

        if (set_algo_ids.has(winning) && set_algo_ids.has(loosing)) {

            let winning_index = top_algo_ids.findIndex(e => e[1] === winning) + 2;
            let loosing_index = top_algo_ids.findIndex(e => e[1] === loosing) + 2;

            make_winning_link(table.rows[winning_index].cells[loosing_index], m.id);
            make_losing_link(table.rows[loosing_index].cells[winning_index], m.id);
        }
    });
}

function make_winning_link(td, match_id) {
    td.innerHTML += `<a href="https://felixrichter2000.github.io/watch?id=${match_id}" target="_blank">W</a>`;
    td.classList.add("result-w");
    handleMoreThanOneMatch(td);
}

function make_losing_link(td, match_id) {
    td.innerHTML += `<a href="https://felixrichter2000.github.io/watch?id=${match_id}" target="_blank">L</a>`;
    td.classList.add("result-l");
    handleMoreThanOneMatch(td);
}

function handleMoreThanOneMatch(td) {
    if (hasMoreThanOneMatchHappendHere(td))
        showResultU(td);
}

function showResultU(td) {
    td.classList.remove(...td.classList);
    td.classList.add("result-u");
}

function hasMoreThanOneMatchHappendHere(td) {
    return td.classList.length != 1;
}