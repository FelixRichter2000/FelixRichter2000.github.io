async function fetch_json(request) {
    const response = await fetch(request)
    if (response.status != 200) {
        console.log(`failed to retrieve data: ${request}`)
        console.log(response);
        return null;
    }
    return await response.json()
}

if (typeof process !== 'undefined') {
    module.exports = fetch_json;
}