$(document).ready(function () {
    var teamNumber = 62;
    var mySKU;
    $.ajax({
        url: 'http://api.vex.us.nallen.me/get_teams?team='+teamNumber,
        dataType: 'json',
        success: function (jd) {
            $('#title').append('<p>Team '+teamNumber+', '+jd.result[0].team_name+'</p>');
        },
        async: false,
    });
    $.ajax({
        url: 'http://api.vex.us.nallen.me/get_events?team='+teamNumber+'&status=past',
        dataType: 'json',
        success: function (jd) {
            if (jd.size == 0) {
                $('#status').append('<p>No Current Event</p>');
            } else {
                $('#status').append('<p>' + jd.result[0].name + '</p>');
                mySKU = jd.result[0].sku;
                $('#sku').append(mySKU);
            }
        },
        async: false,
    });
    $.ajax({
        url: ('http://api.vex.us.nallen.me/get_matches?team=62&sku=' + mySKU),
        dataType: 'json',
        success: function (jd) {
            //$.getJSON('http://team62.github.io/matches', function (jd) { //replace with matches SEARCHING FOR 62 AND SKU
            for (i = 0; i < jd.size; i++) {
                if (jd.result[i].red1 == teamNumber || jd.result[i].red2 == teamNumber || jd.result[i].red3 == teamNumber || jd.result[i].blue1 == teamNumber || jd.result[i].blue2 == teamNumber || jd.result[i].blue3 == teamNumber) {
                    if (jd.result[i].scored == 1) {
                        $('#status').append('Next Match: ');
                        if (jd.result[i].round == 2) {
                            $('#status').append('QM ');
                        } else if (jd.result[i].round == 3) {
                            $('#status').append('QF ');
                        } else if (jd.result[i].round == 4) {
                            $('#status').append('SF ');
                        } else if (jd.result[i].round == 5) {
                            $('#status').append('F ');
                        }
                        $('#status').append(jd.result[i].matchnum);
                        if (jd.result[i].red1 == teamNumber || jd.result[i].red2 == teamNumber || jd.result[i].red3 == teamNumber) {
                            $('#status').append(", Red");
                        } else {
                            $('#status').append(", Blue");
                        }
                        $('#status').append(', ' + jd.result[i].field);

                        $('#status').append('<hr>');
                        break;
                    }
                }
            }
            scoreshtml = '<table style="width:100%" border="1"><tr><th>Match</th><th>Red Alliance</th><th>Blue Alliance</th><th>Red Score</th><th>Blue Score</th><th>Outcome</th></tr>';
            for (i = 0; i < jd.size; i++) {
                if (jd.result[i].scored == 1) {
                    scoreshtml += ('<tr>');
                    scoreshtml += ('<td>');
                    if (jd.result[i].round == 2) {
                        scoreshtml += ('QM ');
                    } else if (jd.result[i].round == 3) {
                        scoreshtml += ('QF ');
                    } else if (jd.result[i].round == 4) {
                        scoreshtml += ('SF ');
                    } else if (jd.result[i].round == 5) {
                        scoreshtml += ('F ');
                    }
                    scoreshtml += (jd.result[i].matchnum + '</td>');
                    scoreshtml += ('<td>' + jd.result[i].red1 + " " + jd.result[i].red2 + " " + jd.result[i].red3 + '</td>');
                    scoreshtml += ('<td>' + jd.result[i].blue1 + " " + jd.result[i].blue2 + " " + jd.result[i].blue3 + '</td>');
                    scoreshtml += ('<td>' + jd.result[i].redscore + '</td>');
                    scoreshtml += ('<td>' + jd.result[i].bluescore + '</td>');
                    if (jd.result[i].red1 == 62 || jd.result[i].red2 == 62 || jd.result[i].red3 == 62 && jd.result[i].redscore > jd.result[i].bluescore) {
                        scoreshtml += ('<td>WIN</td>');
                    } else if (jd.result[i].blue1 == 62 || jd.result[i].blue2 == 62 || jd.result[i].blue3 == 62 && jd.result[i].redscore < jd.result[i].bluescore) {
                        scoreshtml += ('<td>WIN</td>');
                    } else {
                        scoreshtml += ('<td>LOSS</td>');
                    }
                    scoreshtml += ('</tr>');
                }
            }
            scoreshtml += '</table>';
            $('#scores').append(scoreshtml);
            /*
            var highScore = 0;
            var lowScore = 5000;
            if (jd.size > 0) {
                for (i = 0, i < jd.size; i++) {
                    if (jd.result[i].scored == 1) {
                        var isRed;
                        if (jd.result[i].red1 == 62 || jd.result[i].red2 == 62 || jd.result[i].red3 == 62) {
                            isRed = true;
                        } else {
                            isRed = false;
                        }
                        var matchScore;
                        if(isRed) {
                            matchScore = jd.result[i].redscore;
                        } else {
                            matchScore = jd.result[i].bluescore;
                        }
                        if(matchScore>highScore) {
                            highScore = matchScore;
                        }
                        if(matchScore<lowScore) {
                            lowScore = matchScore;
                        }
                    }
                    $('#highlowscore').append('<p>High Score: '+highScore+', Low Score: '+lowScore+'</p>');
                }
            }
            */
        },
        async: false,
    });
    $.ajax({
        url: ('http://api.vex.us.nallen.me/get_matches?sku=' + mySKU),
        dataType: 'json',
        success: function (jd) {
            for (i = 0; i < jd.length; i++) {
                if (jd.results[i].scored == 0) {
                    if (i != 0) {
                        $('#status').append('\nCurrent Match Number: ' + jd.result[i - 1].matchnum);
                        break;
                    }
                }
            }
        }
    });
    $.ajax({
        url: 'http://api.vex.us.nallen.me/get_rankings?sku=' + mySKU,
        dataType: 'json',
        success: function (jd) {
            for (i = 0; i < 3; i++) {
                $('#' + (i + 1)).append('<td>' + jd.result[i].rank + '</td>');
                $('#' + (i + 1)).append('<td>' + jd.result[i].team + '</td>');
                $('#' + (i + 1)).append('<td>' + jd.result[i].wins + '-' + jd.result[i].losses + '-' + jd.result[i].ties + '</td>');
                $('#' + (i + 1)).append('<td>' + jd.result[i].wp + '</td>');
                $('#' + (i + 1)).append('<td>' + jd.result[i].sp + '</td>');
            }
        },
        async: false,
    });
    $.ajax({
        url: 'http://api.vex.us.nallen.me/get_rankings?team=62&sku=' + mySKU,
        dataType: 'json',
        success: function (jd) {
            $('#us').append('<td>-</td>');
            $('#us').append('<td>' + jd.result[0].team + '</td>');
            $('#us').append('<td>' + jd.result[0].wins + '-' + jd.result[0].losses + '-' + jd.result[0].ties + '</td>');
            $('#us').append('<td>' + jd.result[0].wp + '</td>');
            $('#us').append('<td>' + jd.result[0].sp + '</td>');
        },
        async: false,
    });

});
