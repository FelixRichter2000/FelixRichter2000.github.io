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
            $(nav_content_elements[i]).show();
            $(nav_a_tags[i]).addClass("selected");
        }
        else {
            $(nav_content_elements[i]).hide();
            $(nav_a_tags[i]).removeClass("selected");
        }
    }
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
    selected_match = match;
    switchToTab('Match');
    onMatchChanged();
}


(function () {
    for (var i = 0; i < nav_content_elements.length; i++) {
        if (i == 0) {
            $(nav_content_elements[i]).show();
            $(nav_a_tags[i]).addClass("selected");
        }
        else {
            $(nav_content_elements[i]).hide();
        }
    }
})();