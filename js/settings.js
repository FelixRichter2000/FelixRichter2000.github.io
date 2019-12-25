//Path query handler
$('input[query]').on('change', function () {
    updateQueryPath();
});

$('input[query]').each(function (i, el) {
    var $el = $(el);
    var value = urlParams.get(el.name);
    if (value) {
        if ($el.attr('type') == 'number')
            el.value = value;
        else if ($el.attr('type') == 'checkbox')
            el.checked = value !== 'false';
    }
});

updateQueryPath();

function updateQueryPath() {
    var patname = window.location.path;
    var newPath = (patname ? '/' + patname : '') + '?';

    $('input[query]').each(function (i, el) {
        $el = $(el);
        if($el.attr('type') == 'number')
            newPath += el.name + '=' + el.value + '&';
        else if ($el.attr('type') == 'checkbox')
            newPath += el.name + '=' + el.checked + '&';
    });

    newPath = newPath.slice(0, -1);
    window.history.pushState('', document.title, newPath);
    urlParams = new URLSearchParams(window.location.search);
}