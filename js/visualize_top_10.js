window.onload = () => {
    main();
}

async function main() {
    const leaderboard_data = await get_leaderboard_data();
    console.log(leaderboard_data);

    const top_ten_user_ids = await get_top_ten_user_ids(leaderboard_data);
    const top_algo_ids = await get_top_ten_algo_ids(top_ten_user_ids);
    console.log(top_algo_ids);

    //Create empty table
    createTable(leaderboard_data, top_algo_ids);

    //const matches_between_top_algos = await get_matches_between_top_algos(top_algo_ids);
    //console.log(matches_between_top_algos);
    //window.test = matches_between_top_algos;

    //matches_between_top_algos.forEach(e => e.then(data => console.log(data)));
}

async function get_leaderboard_data() {
    const leaderboard = await fetch_json('https://terminal.c1games.com/api/game/leaderboard')
    return leaderboard.data.algos.slice(0, 10);
}

async function get_top_ten_user_ids(leaderboard_data) {
    return await leaderboard_data.map(v => v.user.id);
}

async function get_top_ten_algo_ids(top_ten_user_ids) {
    let all_algos = await Promise.all(top_ten_user_ids.map(e => fetch_json(`https://terminal.c1games.com/api/game/user/${e}/algos?team=false`)))
    return [...all_algos.reduce((a, user_data, user_rank) => [...a, ...user_data.data.algos.map(algo => [user_rank, algo.id, algo.name])], [])]
}

async function get_matches_between_top_algos(top_algo_ids) {
    return await top_algo_ids.map(algo => fetch_json(`https://terminal.c1games.com/api/game/algo/${algo[1]}/matches`))
}

async function fetch_json(request) {
    const response = await fetch(request)
    if (response.status != 200) return alert(`failed to retrieve data: {request}`)
    return await response.json()
}

function createTable(leaderboard_data, top_algo_ids) {
    var table = document.getElementById("visualize_table");
    var header = table.createTHead();

    //Row algo
    var current_row = header.insertRow();
    current_row.insertCell();
    top_algo_ids.forEach((algo, i) => {
        let th = document.createElement('th');
        th.innerHTML = `<span>${algo[2]}</span>`;
        current_row.appendChild(th);
    });

    //Row avatar img
    var current_row = header.insertRow();
    current_row.insertCell();
    top_algo_ids.forEach((algo, i) => {
        let th = document.createElement('td');
        th.innerHTML = `<img src=${leaderboard_data[algo[0]].user.avatarUrl}/>`;
        current_row.appendChild(th);
    });

    //Data rows


    var header_height = 0;
    $('table th span').each(function () {
        if ($(this).outerWidth() > header_height) header_height = $(this).outerWidth();
    });
    $('table th').height(header_height);

}



