$(document).ready(function() {
  var teamber = getUrlParameter('team');
  var mySKU = getUrlParameter('sku');
  var competingCurrently = true;
  var skillsCompetition = false;
  var accessRobotEvents = false;
  var divisions;
  var divisionsArray;
  var teamDivision;
  var teamDivisionNumber;
  if (teamber == undefined)
    teamber = "62"

  //For title, gets team name
  $.ajax({
    url: 'http://api.vexdb.io/v1/get_teams?team=' + teamber,
    dataType: 'json',
    success: function(jd) {
      $('#title').append('<p>Team ' + teamber + ', ' + jd.result[0].team_name + '</p>');
    },
    async: false,
  });
  //Sets SKU of tournament to any current tournament, if we're not in one, display the last tournament
  if(mySKU == undefined) {
    $.ajax({
      url: 'http://api.vexdb.io/v1/get_events?team=' + teamber + '&status=current',
      dataType: 'json',
      success: function(jd) {
        if (jd.size == 0) {
          $('#status').append('<p>No Ongoing Tournament/Tournament Ended - Displaying Previous Results</p>');
          competingCurrently = false;
        } else {
          $('#status').append('<p>' + jd.result[0].name + '</p>');
          if(mySKU == undefined)
            mySKU = jd.result[0].sku;
          $('#sku').append(mySKU + ': <a href=http://www.robotevents.com/' + mySKU + '.html>RobotEvents</a>, <a href=http://vex.us.nallen.me/events/view/' + mySKU + '>VexDB</a>');
        }
      },
      async: false,
    });
    if (!competingCurrently) {
      $.ajax({
        url: 'http://api.vexdb.io/v1/get_events?team=' + teamber + '&status=past',
        dataType: 'json',
        success: function(jd) {
          $('#status').append('<p>' + jd.result[0].name + '</p>');
          if ((jd.result[0].name).indexOf("Skills") > 0) {
            skillsCompetition = true;
          }
          mySKU = jd.result[0].sku;
          $('#sku').append('<br>' + mySKU + ': <a href=http://www.robotevents.com/' + mySKU + '.html>RobotEvents</a>, <a href=http://vex.us.nallen.me/events/view/' + mySKU + '>VexDB</a>');
        },
        async: false,
        timeout: 5000,
      });
    }
  } else {
    $.ajax({
      url: 'http://api.vexdb.io/v1/get_events?sku=' + mySKU,
      dataType: 'json',
      success: function(jd) {
        $('#status').append('<p>' + jd.result[0].name + '</p>');
        mySKU = jd.result[0].sku;
        $('#sku').append('<br>' + mySKU + ': <a href=http://www.robotevents.com/' + mySKU + '.html>RobotEvents</a>, <a href=http://vex.us.nallen.me/events/view/' + mySKU + '>VexDB</a>');
      },
      async: false,
      timeout: 5000,
    });
  }

  $('#indexLinks').append('<a href=rankings.html?team=' + teamber + '&sku=' + mySKU + '>Rankings</a> <a href=skills.html?team=' + teamber + '&sku=' + mySKU + '>Skills</a>');
  $('#skillsLinks').append('<a href=index.html?team=' + teamber + '&sku=' + mySKU + '>Main Page</a> <a href=rankings.html?team=' + teamber + '&sku=' + mySKU + '>Rankings</a>');
  $('#rankingsLinks').append('<a href=index.html?team=' + teamber + '&sku=' + mySKU + '>Main Page</a> <a href=skills.html?team=' + teamber + '&sku=' + mySKU + '>Skills</a>');

  //Handle matches from RobotEvents
  $.ajax({
    url: 'http://api.vexdb.io/v1/get_events?sku=' + mySKU,
    dataType: 'json',
    success: function(jd) {
        divisions = jd.result[0].divisions.length;
        divisionsArray = jd.result[0].divisions;
    },
    async: false,
    timeout: 5000,
  });
  $.ajax({
    url: 'http://api.vexdb.io/v1/get_rankings?sku='+ mySKU + '&team=' + teamber,
    dataType: 'json',
    success: function(jd) {
      teamDivision = jd.result[0].division;
      for (var i = 0; i < divisionsArray.length; i++) {
        if(divisionsArray[i]==teamDivision)
          teamDivisionNumber = i+1;
      }
    },
    async: false,
  });
  var highScore = 0;
  var lowScore = 5000;
  scoreshtml = '<table style="width:100%" border="1"><tr><th>Match</th><th>Red Alliance</th><th>Blue Alliance</th><th>Red Score</th><th>Blue Score</th><th>Time</th><th>Outcome</th></tr>';
  for (var division = 1; division<=divisions; division++) {
    $.ajax({
      url: 'https://api.vexdb.io/v1/get_matches?sku=' + mySKU + '&division=' + division,
      dataType: 'json',
      success: function(jd) {
        if(jd!=null) {
          for (i = 0; i < jd.length; i++) {
            if (jd[i].result.red1 == teamber || jd[i].result.red2 == teamber || jd[i].result.red3 == teamber || jd[i].result.blue1 == teamber || jd[i].result.blue2 == teamber || jd[i].result.blue3 == teamber) {
              if (jd[i].result.scored == "False") {
                $('#status').append('<i>Next Match:</i> ');
                if (jd[i].result.round == 2) {
                  $('#status').append('QM ');
                } else if (jd[i].result.round == 3) {
                  $('#status').append('QF ');
                } else if (jd[i].result.round == 4) {
                  $('#status').append('SF ');
                } else if (jd[i].result.round == 5) {
                  $('#status').append('F ');
                } else if (jd[i].result.round == 6) {
                $('#status').append('R16 ');
                }
                $('#status').append(jd[i].result.matchnum);
                if (jd[i].result.red1 == teamber || jd[i].result.red2 == teamber || jd[i].result.red3 == teamber) {
                  $('#status').append(", Red");
                } else {
                  $('#status').append(", Blue");
                }
                $('#status').append(', ' + jd[i].result.field);
                teamshtml=('<br><div style="color:red;">' + jd[i].result.red1 + ", " + jd[i].result.red2);
                if (jd[i].result.red3 != undefined)
                  teamshtml+=(", " + jd[i].result.red3);
                teamshtml+=('</div><div style="color:blue;">' + jd[i].result.blue1 + ", " + jd[i].result.blue2);
                if (jd[i].result.blue3 != undefined)
                  teamshtml+=(", " + jd[i].result.blue3);
                teamshtml+=('</div>');
                $('#status').append(teamshtml);
                break;
              }
            }
          }
          for (i = 0; i < jd.length - 1; i++) {
            if (jd[i].result.red1 == teamber || jd[i].result.red2 == teamber || jd[i].result.red3 == teamber || jd[i].result.blue1 == teamber || jd[i].result.blue2 == teamber || jd[i].result.blue3 == teamber) {
              scoreshtml += ('<tr>');
              scoreshtml += ('<td>');
              if (jd[i].result.round == 2) {
                scoreshtml += ('QM ');
              } else if (jd[i].result.round == 3) {
                scoreshtml += ('QF ');
              } else if (jd[i].result.round == 4) {
                scoreshtml += ('SF ');
              } else if (jd[i].result.round == 5) {
                scoreshtml += ('F ');
              } else if (jd[i].result.round == 6) {
                scoreshtml += ('R16 ');
              }
              scoreshtml += (jd[i].result.matchnum + '</td>');
              r1 = jd[i].result.red1;
              r2 = jd[i].result.red2;
              r3 = jd[i].result.red3;
              b1 = jd[i].result.blue1;
              b2 = jd[i].result.blue2;
              b3 = jd[i].result.blue3;
              if (r1 == teamber)
                r1 = '<b style="font-weight:bolder;">' + r1 + '</b>';
              if (r2 == teamber)
                r2 = '<b style="font-weight:bolder;">' + r2 + '</b>';
              if (r3 == teamber)
                r3 = '<b style="font-weight:bolder;">' + r3 + '</b>';
              if (b1 == teamber)
                b1 = '<b style="font-weight:bolder;">' + b1 + '</b>';
              if (b2 == teamber)
                b2 = '<b style="font-weight:bolder;">' + b2 + '</b>';
              if (b3 == teamber)
                b3 = '<b style="font-weight:bolder;">' + b3 + '</b>';
              if (jd[i].result.red3 == undefined) scoreshtml += ('<td class="red">' + r1 + ", " + r2 + '</td>');
              else scoreshtml += ('<td class="red">' + r1 + ", " + r2 + ", " + r3 + '</td>');
              if (jd[i].result.blue3 == undefined) scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + '</td>');
              else scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + ", " + b3 + '</td>');
              scoreshtml += ('<td class="red">' + jd[i].result.redscore + '</td>');
              scoreshtml += ('<td class="blue">' + jd[i].result.bluescore + '</td>');
              scoreshtml += ('<td>'+jd[i].result.timescheduled+'</td>');
              if (jd[i].result.scored == "False")
                scoreshtml += ('<td>Unplayed</td>');
              else if ((jd[i].result.red1 == teamber) || (jd[i].result.red2 == teamber) || (jd[i].result.red3 == teamber)) {
                if (parseInt(jd[i].result.redscore) > highScore) {
                  highScore = parseInt(jd[i].result.redscore)
                }
                if (parseInt(jd[i].result.redscore) < lowScore) {
                  lowScore = parseInt(jd[i].result.redscore)
                }
                if (parseInt(jd[i].result.redscore) > parseInt(jd[i].result.bluescore)) {
                  scoreshtml += ('<td class="victory">WIN</td>');
                } else if (parseInt(jd[i].result.redscore) == parseInt(jd[i].result.bluescore)) {
                  scoreshtml += ('<td class="tie">TIE</td>');
                } else {
                  scoreshtml += ('<td class="yellow">LOSS</td>');
                }
              } else {
                if (parseInt(jd[i].result.bluescore) > highScore) {
                  highScore = parseInt(jd[i].result.bluescore)
                }
                if (parseInt(jd[i].result.bluescore) < lowScore) {
                  lowScore = parseInt(jd[i].result.bluescore)
                }
                if (parseInt(jd[i].result.bluescore) > parseInt(jd[i].result.redscore)) {
                  scoreshtml += ('<td class="victory">WIN</td>');
                } else if (parseInt(jd[i].result.redscore) == parseInt(jd[i].result.bluescore)) {
                  scoreshtml += ('<td class="tie">TIE</td>');
                } else {
                  scoreshtml += ('<td class="yellow">LOSS</td>');
                }
              }
              scoreshtml += ('</tr>');
            }
          }
        }
      },
      async: false,
    });
  }
  scoreshtml += '</table>';
  $('#scores').append(scoreshtml);
  if (lowScore != 5000)
    $('#highlowscore').append('<p>High Score: ' + highScore + ', Low Score: ' + lowScore + '</p>');
  //Handle rankings from robotevents
  $.ajax({
    url: 'https://api.vexdb.io/v1/get_rankings?sku=' + mySKU + '&division=' + teamDivisionNumber,
    dataType: 'json',
    success: function(jd) {
      if (jd.length < 3) {} else {
        for (i = 0; i < 3; i++) {
          $('#' + (i + 1)).append('<td>' + jd[i].result.result.rank + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].result.result.team + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].result.result.wins + '-' + jd[i].result.losses + '-' + jd[i].result.ties + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].result.result.wp + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].result.result.sp + '</td>');
        }
      }
    },
    async: false,
  });
  $.ajax({
    url: 'https://api.vexdb.io/v1/get_rankings?sku=' + mySKU + '&division=' + teamDivisionNumber,
    dataType: 'json',
    success: function(jd) {
      if (jd.length == 0) {} else {
        for (i = 0; i < jd.length; i++) {
          if (jd[i].result.team == teamber) {
            $('#us').append('<td><b>' + jd[i].result.result.rank + '</b></td>');
            $('#us').append('<td><b>' + jd[i].result.result.team + '</b></td>');
            $('#us').append('<td><b>' + jd[i].result.result.wins + '-' + jd[i].result.losses + '-' + jd[i].result.ties + '</b></td>');
            $('#us').append('<td><b>' + jd[i].result.result.wp + '</b></td>');
            $('#us').append('<td><b>' + jd[i].result.result.sp + '</b></td>');
          }
        }
      }
    },
    async: false,
  });

  //Handle rankings - from robotevents
  for (division=1; division<=divisions; division++) {
    $.ajax({
      url: 'https://api.vexdb.io/v1/get_rankings?sku=' + mySKU + '&division=' + division,
      dataType: 'json',
      success: function(jd) {
        scoreshtml = '<button class="accordion">'+divisionsArray[division-1]+'</button>'
        if(teamDivision == divisionsArray[division-1])
          scoreshtml += '<div class="panel show"';
        else
          scoreshtml += '<div class="panel"';
        scoreshtml += 'id="' + divisionsArray[division-1] + '"><table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>W-L-T</th><th>WP</th><th>SP</th></tr>';
        if(jd!=null) {
          for (i = 0; i < jd.length - 1; i++) {
            if (jd[i].result.team == teamber) {
              scoreshtml += ('<td class=yellow><b>' + jd[i].result.rank + '</b></td>');
              scoreshtml += ('<td class=yellow><b><a class="black" href=http://team62.github.io?team=' + jd[i].result.team + '>' + jd[i].result.team + '</a></b></td>');
              scoreshtml += ('<td class=yellow><b>' + jd[i].result.wins + '-' + jd[i].result.losses + '-' + jd[i].result.ties + '</b></td>');
              scoreshtml += ('<td class=yellow><b>' + jd[i].result.wp + '</b></td>');
              scoreshtml += ('<td class=yellow><b>' + jd[i].result.sp + '</b></td></tr>');
            } else {
              scoreshtml += ('<td>' + jd[i].result.rank + '</td>');
              scoreshtml += ('<td><a class="black" href=http://team62.github.io?team=' + jd[i].result.team + '>' + jd[i].result.team + '</a></td>');
              scoreshtml += ('<td>' + jd[i].result.wins + '-' + jd[i].result.losses + '-' + jd[i].result.ties + '</td>');
              scoreshtml += ('<td>' + jd[i].result.wp + '</td>');
              scoreshtml += ('<td>' + jd[i].result.sp + '</td></tr>');
            }
          }
          scoreshtml += '</table></div>';
          $('#rankings').append(scoreshtml);
        }
      },
      async: false,
    });
  }
  //handle robot skills - from RobotEvents
  $.ajax({
    url: 'https://api.vexdb.io/v1/get_skills?sku=' + mySKU,
    dataType: 'json',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      roboSkillsHtml = '<table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>Score</th><th>Attempts</th></tr>';
      for (i = 0; i < jd.length - 1; i++) {
        if (jd[i].result.team == teamber) {
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].result.rank + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].result.team + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].result.highscore + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].result.attempts + '</b></td></tr>');
        } else {
          roboSkillsHtml += ('<td>' + jd[i].result.rank + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].result.team + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].result.highscore + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].result.attempts + '</td></tr>');
        }
      }
      roboSkillsHtml += '</table>';
      $('#roboskills').append(roboSkillsHtml);
    },
    async: false,
  });

  //handle programming sills - from robotevents
  $.ajax({
    url: 'https://api.vexdb.io/v1/get_skills?sku=' + mySKU,
    dataType: 'text',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      roboSkillsHtml = '<table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>Score</th><th>Attempts</th></tr>';
      for (i = 0; i < jd.length - 1; i++) {
        if (jd[i].result.team == teamber) {
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].result.rank + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].result.team + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].result.highscore + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].result.attempts + '</b></td></tr>');
        } else {
          roboSkillsHtml += ('<td>' + jd[i].result.rank + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].result.team + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].result.highscore + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].result.attempts + '</td></tr>');
        }
      }
      roboSkillsHtml += '</table>';
      $('#progskills').append(roboSkillsHtml);
    },
    async: false,
  });
  //Robot skills high score - from vexdb
  $.ajax({
    url: 'http://api.vexdb.io/v1/get_skills?season_rank=true&rank=1&program=VRC&season=current&type=0',
    dataType: 'json',
    success: function(jd) {
      $('#robohighscore').append(jd.result[0].team + " (" + jd.result[0].attempts + " attempts): " + jd.result[0].score);
    },
    async: false,
  });

  //programming skills high score - from vexdb
  $.ajax({
    url: 'http://api.vexdb.io/v1/get_skills?season_rank=true&rank=1&program=VRC&season=current&type=1',
    dataType: 'json',
    success: function(jd) {
      $('#proghighscore').append(jd.result[0].team + " (" + jd.result[0].attempts + " attempts): " + jd.result[0].score);
    },
    async: false,
  });
  if (!skillsCompetition) {
    $.ajax({
      url: ('https://api.vexdb.io/v1/get_matches?sku=' + mySKU + '&division=' + teamDivisionNumber),
      dataType: 'text',
      success: function(jd) {
        currentMatchNumber = 0;
        differience = 0;
        for (i = 0; i < jd.length; i++) {
          if (jd[i].result.scored == 'False') {
            currentMatchNumber = jd[i].result.matchnum;
            currentMatchTitle = "";
            if (jd[i].result.round == 2) {
              currentMatchTitle=('QM ');
            } else if (jd[i].result.round == 3) {
              currentMatchTitle=('QF ');
            } else if (jd[i].result.round == 4) {
              currentMatchTitle=('SF ');
            } else if (jd[i].result.round == 5) {
              currentMatchTitle=('F ');
            } else if (jd[i].result.round == 6) {
              currentMatchTitle=('R16 ');
            }
            $('#currentmatch').append('Current Match Number: ' + currentMatchTitle + jd[i].result.matchnum);
            break;
          }
        }
        for(i = 0; i < jd.length; i++) {
          if(jd[i].result.scored == 'False' && (jd[i].result.red1 == teamber || jd[i].result.red2 == teamber || jd[i].result.red3 == teamber || jd[i].result.blue1 == teamber || jd[i].result.blue2 == teamber || jd[i].result.blue3 == teamber)) {
            differience = jd[i].result.matchnum - currentMatchNumber;
            if(differience == 0)
              $('#currentmatch').append('<b> Playing Now</b>');
            else
              $('#currentmatch').append(', Our Next Match: ' + jd[i].result.matchnum + ', Up in <b>' + differience + '</b> matches, at ' + jd[i].result.timescheduled.substring(11));
            break;
          }
        }
      },
      async: false,
    });
  }
  //For Accordion
  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
      acc[i].onclick = function(){
          this.classList.toggle("active");
          this.nextElementSibling.classList.toggle("show");
    }
  }
  jumpTo(teamDivision);
});

function jumpTo(anchor){
    window.location.href = "#"+anchor;
}

function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [
    []
  ];
  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;
  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec(strData)) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];
    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }
    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"), "\"");
    } else {
      // We found a non-quoted value.
      var strMatchedValue = arrMatches[3];
    }
    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  // Return the parsed data.
  return (arrData);
}

function CSV2JSON(csv) {
  if(csv==undefined || csv=="")
    return "";
  var array = CSVToArray(csv);
  var objArray = [];
  for (var i = 1; i < array.length; i++) {
    objArray[i - 1] = {};
    for (var k = 0; k < array[0].length && k < array[i].length; k++) {
      var key = array[0][k];
      objArray[i - 1][key] = array[i][k]
    }
  }

  var json = JSON.stringify(objArray);
  var str = json.replace(/},/g, "},\r\n");

  return str;
}

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};
