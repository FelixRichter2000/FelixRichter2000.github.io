//Path query handler
$('input[query]').on('change', function () {
    updateQueryPath();
});

$('input[query]').each(function (i, el) {
    var value = urlParams.get(el.name);
    if (value)
        el.value = value;
});

updateQueryPath();

function updateQueryPath() {
    var patname = window.location.path;
    var newPath = (patname ? '/' + patname : '') + '?';

    $('input[query]').each(function (i, el) {
        newPath += el.name + '=' + el.value + '&';
    });

    newPath = newPath.slice(0, -1);
    window.history.pushState('', document.title, newPath);
    urlParams = new URLSearchParams(window.location.search);
}