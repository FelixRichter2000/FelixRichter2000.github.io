window.onload = () => {
    main();
}

async function main() {
    const leaderboard_data = await get_leaderboard_data();
    const top_ten_user_ids = await get_top_ten_user_ids(leaderboard_data);
    const all_algo_ids = await get_top_ten_algo_ids(top_ten_user_ids);

    console.log(all_algo_ids);
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
    return [...all_algos.reduce((a, user_data, user_rank) => [...a, ...user_data.data.algos.map(algo => [user_rank, algo.id])], [])]
}

async function fetch_json(request) {
    const response = await fetch(request)
    if (response.status != 200) return alert(`failed to retrieve data: {request}`)
    return await response.json()
}

function createTable() {

}



////Styling js
//$(function () {
//    var header_height = 0;
//    $('table th span').each(function () {
//        if ($(this).outerWidth() > header_height) header_height = $(this).outerWidth();
//    });

//    $('table th').height(header_height);
//});