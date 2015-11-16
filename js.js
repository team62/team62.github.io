$(document).ready(function () {
    var teamNumber = 62;
    var mySKU;
    var competingCurrently = true;
    $.ajax({
        url: 'http://api.vex.us.nallen.me/get_teams?team=' + teamNumber,
        dataType: 'json',
        success: function (jd) {
            $('#title').append('<p>Team ' + teamNumber + ', ' + jd.result[0].team_name + '</p>');
        },
        async: false,
    });
    $.ajax({
        url: 'http://api.vex.us.nallen.me/get_events?team=' + teamNumber + '&status=current',
        dataType: 'json',
        success: function (jd) {
            if (jd.size == 0) {
                $('#status').append('<p>No Current Event - Displaying Previous Results</p>');
                competingCurrently = false;
            } else {
                $('#status').append('<p>' + jd.result[0].name + '</p>');
                mySKU = jd.result[0].sku;
                $('#sku').append(mySKU+': <a href=http://www.robotevents.com/'+mySKU+'.html>RobotEvents</a>, <a href=http://vex.us.nallen.me/events/view/'+mySKU+'>VexDB</a>');
            }
        },
        async: false,
    });
    if(!competingCurrently) {
        $.ajax({
            url: 'http://api.vex.us.nallen.me/get_events?team=' + teamNumber + '&status=past',
            dataType: 'json',
            success: function (jd) {
                $('#status').append('<p>' + jd.result[0].name + '</p>');
                mySKU = jd.result[0].sku;
                $('#sku').append(mySKU);
            },
            async: false,
        });
    }
    $.ajax({
        url: ('http://api.vex.us.nallen.me/get_matches?team='+teamNumber+'&sku=' + mySKU),
        dataType: 'json',
        success: function (jd) {
          for (i = 0; i < jd.size; i++) {
              if (jd.result[i].red1 == teamNumber || jd.result[i].red2 == teamNumber || jd.result[i].red3 == teamNumber || jd.result[i].blue1 == teamNumber || jd.result[i].blue2 == teamNumber || jd.result[i].blue3 == teamNumber) {
                  if (jd.result[i].scored == 0) {
                      $('#status').append('<i>Next Match:</i> ');
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
                      $('#status').append('<br><div style="color:red;">'+jd.result[i].red1+", "+jd.result[i].red2);
                      if (jd.result[i].red3 != "")
                      $('#status').append(", "+jd.result[i].red3);
                      $('#status').append('</div><div style="color:blue;">'+jd.result[i].blue1+", "+jd.result[i].blue2);
                      if (jd.result[i].blue3 != "")
                      $('#status').append(", "+jd.result[i].blue3);
                      $('#status').append('</div><hr>');
                      break;
                  }
              }
          }
            scoreshtml = '<table style="width:100%" border="1"><tr><th>Match</th><th>Red Alliance</th><th>Blue Alliance</th><th>Red Score</th><th>Blue Score</th><th>Outcome</th></tr>';
            var highScore = 0;
            var lowScore = 5000;
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
                    r1 = jd.result[i].red1;
                    r2 = jd.result[i].red2;
                    r3 = jd.result[i].red3;
                    b1 = jd.result[i].blue1;
                    b2 = jd.result[i].blue2;
                    b3 = jd.result[i].blue3;
                    if(r1==teamNumber)
                    	r1='<b>'+r1+'</b>';
                    if(r2==teamNumber)
                    	r2='<b>'+r2+'</b>';
                    if(r3==teamNumber)
                    	r3='<b>'+r3+'</b>';
                    if(b1==teamNumber)
                    	b1='<b>'+b1+'</b>';
                    if(b2==teamNumber)
                    	b2='<b>'+b2+'</b>';
                    if(b3==teamNumber)
                    	b3='<b>'+b3+'</b>';
                    if (jd.result[i].red3 == "") scoreshtml += ('<td class="red">' + r1 + ", " + r2 + '</td>');
                    else scoreshtml += ('<td class="red">' + r1 + ", " + r2 + ", " + r3 + '</td>');
                    if (jd.result[i].blue3 == "") scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + '</td>');
                    else scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + ", " + b3 + '</td>');
                    scoreshtml += ('<td class="red">' + jd.result[i].redscore + '</td>');
                    scoreshtml += ('<td class="blue">' + jd.result[i].bluescore + '</td>');
                    if ((jd.result[i].red1 == teamNumber) || (jd.result[i].red2 == teamNumber) || (jd.result[i].red3 == teamNumber)) {
                        if(parseInt(jd.result[i].redscore)>highScore) {
                            highScore = parseInt(jd.result[i].redscore)
                        }
                        if(parseInt(jd.result[i].redscore)<lowScore) {
                            lowScore = parseInt(jd.result[i].redscore)
                        }
                        if (parseInt(jd.result[i].redscore) > parseInt(jd.result[i].bluescore)) {
                            scoreshtml += ('<td class="victory">WIN</td>');
                        } else {
                            scoreshtml += ('<td class="yellow">LOSS</td>');
                        }
                    } else {
                        if(parseInt(jd.result[i].bluescore)>highScore) {
                            highScore = parseInt(jd.result[i].bluescore)
                        }
                        if(parseInt(jd.result[i].bluescore)<lowScore) {
                            lowScore = parseInt(jd.result[i].bluescore)
                        }
                        if (parseInt(jd.result[i].bluescore) > parseInt(jd.result[i].redscore)) {
                            scoreshtml += ('<td class="victory">WIN</td>');
                        } else {
                            scoreshtml += ('<td class="yellow">LOSS</td>');
                        }
                    }
                    scoreshtml += ('</tr>');
                }
            }
            scoreshtml += '</table>';
            $('#scores').append(scoreshtml);
            if(lowScore!=5000)
            	$('#highlowscore').append('<p>High Score: ' + highScore + ', Low Score: ' + lowScore + '</p>');
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
        url: 'http://api.vex.us.nallen.me/get_rankings?team='+teamNumber+'&sku=' + mySKU,
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
