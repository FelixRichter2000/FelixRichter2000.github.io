var nav_a_tags = $('#main_nav').find('a');
var nav_content_elements = $('#main_content').children();

nav_a_tags.each(function () {
    $(this).on('click', function () {
        var clicked_nav_item = $(this).html();
        switchToTab(clicked_nav_item);
    });
});

function switchToTab(tab) {
    for (var i = 0; i < nav_a_tags.length; i++) {
        var current_content_item = $(nav_content_elements[i]).attr('id');
        if (tab == current_content_item) {
            show(nav_content_elements[i]);
            $(nav_a_tags[i]).addClass("selected");
        }
        else {
            hide(nav_content_elements[i]);
            $(nav_a_tags[i]).removeClass("selected");
        }
    }
}

function show(el) {
    el.style.display = 'block';
}

function hide(el) {
    el.style.display = 'none';
}

function loadPlayer(player) {
    selected_user = player;
    switchToTab('Player');
    reloadOverviewPlayerData();
}

function loadAlgo(algo) {
    selected_algo = algo;
    switchToTab('Algo');
}

function loadMatch(match) {
    hasChanged = selected_match !== match;
    selected_match = match;
    switchToTab('Match');
    if (hasChanged) {
        onMatchChanged();
    }
}


(function () {
    for (var i = 0; i < nav_content_elements.length; i++) {
        if (i == 0) {
            show(nav_content_elements[i]);
            $(nav_a_tags[i]).addClass("selected");
        }
        else {
            hide(nav_content_elements[i]);
        }
    }
})();