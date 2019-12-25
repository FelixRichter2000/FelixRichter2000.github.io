$replay_table = $('#match_table');

function onMatchChanged() {
    $('#match_id_label').html(selected_match);
}

(function () {
    for (var y = 0; y < 28; y++) {
        var new_row = $('<tr>');
        for (var x = 0; x < 28; x++) {
            var new_td = $('<td>');

            if (Math.abs(x - 13.5) + Math.abs(y - 13.5) < 15) {
                new_td.append($('<img>')
                    .attr('id', y * 28 + x)
                    .attr('src', '../images/EmptyField.svg'));
            }
            new_row
                .append(new_td);
        }
        $replay_table
            .append(new_row);
    }
})();