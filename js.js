$(document).ready(function() {
  var teamNumber = getUrlParameter('team');
  var mySKU = getUrlParameter('sku');
  var competingCurrently = true;
  var skillsCompetition = false;
  var accessRobotEvents = false;
  var divisions;
  var divisionsArray;
  var teamDivision;
  var teamDivisionNumber;

  if (teamNumber == undefined)
    teamNumber = "62"

  //For title, gets team name
  $.ajax({
    url: 'http://api.vexdb.io/v1/get_teams?team=' + teamNumber,
    dataType: 'json',
    success: function(jd) {
      $('#title').append('<p>Team ' + teamNumber + ', ' + jd.result[0].team_name + '</p>');
    },
    async: false,
  });
  //Sets SKU of tournament to any current tournament, if we're not in one, display the last tournament
  if(mySKU == undefined) {
    $.ajax({
      url: 'http://api.vexdb.io/v1/get_events?team=' + teamNumber + '&status=current',
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
        url: 'http://api.vexdb.io/v1/get_events?team=' + teamNumber + '&status=past',
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

  $('#indexLinks').append('<a href=rankings.html?team=' + teamNumber + '&sku=' + mySKU + '>Rankings</a> <a href=skills.html?team=' + teamNumber + '&sku=' + mySKU + '>Skills</a>');
  $('#skillsLinks').append('<a href=index.html?team=' + teamNumber + '&sku=' + mySKU + '>Main Page</a> <a href=rankings.html?team=' + teamNumber + '&sku=' + mySKU + '>Rankings</a>');
  $('#rankingsLinks').append('<a href=index.html?team=' + teamNumber + '&sku=' + mySKU + '>Main Page</a> <a href=skills.html?team=' + teamNumber + '&sku=' + mySKU + '>Skills</a>');

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
    url: 'http://api.vexdb.io/v1/get_rankings?sku='+ mySKU + '&team=' + teamNumber,
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
  scoreshtml = '<table style="width:100%" border="1"><tr><th>Match</th><th>Red Alliance</th><th>Blue Alliance</th><th>Red Score</th><th>Blue Score</th><th>Outcome</th></tr>';
  for (var division = 1; division<=divisions; division++) {
    $.ajax({
      url: 'http://ajax.robotevents.com/tm/results/matches/?format=csv&sku=' + mySKU + '&div=' + division,
      dataType: 'text',
      success: function(input) {
        var jd = jQuery.parseJSON(CSV2JSON(input));
        for (i = 0; i < jd.length; i++) {
          if (jd[i].red1 == teamNumber || jd[i].red2 == teamNumber || jd[i].red3 == teamNumber || jd[i].blue1 == teamNumber || jd[i].blue2 == teamNumber || jd[i].blue3 == teamNumber) {
            if (jd[i].scored == "False") {
              $('#status').append('<i>Next Match:</i> ');
              if (jd[i].round == 2) {
                $('#status').append('QM ');
              } else if (jd[i].round == 3) {
                $('#status').append('QF ');
              } else if (jd[i].round == 4) {
                $('#status').append('SF ');
              } else if (jd[i].round == 5) {
                $('#status').append('F ');
              }
              $('#status').append(jd[i].matchnum);
              if (jd[i].red1 == teamNumber || jd[i].red2 == teamNumber || jd[i].red3 == teamNumber) {
                $('#status').append(", Red");
              } else {
                $('#status').append(", Blue");
              }
              $('#status').append(', ' + jd[i].field);
              teamshtml=('<br><div style="color:red;">' + jd[i].red1 + ", " + jd[i].red2);
              if (jd[i].red3 != undefined)
                teamshtml+=(", " + jd[i].red3);
              teamshtml+=('</div><div style="color:blue;">' + jd[i].blue1 + ", " + jd[i].blue2);
              if (jd[i].blue3 != undefined)
                teamshtml+=(", " + jd[i].blue3);
              teamshtml+=('</div>');
              $('#status').append(teamshtml);
              break;
            }
          }
        }
        for (i = 0; i < jd.length - 1; i++) {
          if (jd[i].red1 == teamNumber || jd[i].red2 == teamNumber || jd[i].red3 == teamNumber || jd[i].blue1 == teamNumber || jd[i].blue2 == teamNumber || jd[i].blue3 == teamNumber) {
            scoreshtml += ('<tr>');
            scoreshtml += ('<td>');
            if (jd[i].round == 2) {
              scoreshtml += ('QM ');
            } else if (jd[i].round == 3) {
              scoreshtml += ('QF ');
            } else if (jd[i].round == 4) {
              scoreshtml += ('SF ');
            } else if (jd[i].round == 5) {
              scoreshtml += ('F ');
            }
            scoreshtml += (jd[i].matchnum + '</td>');
            r1 = jd[i].red1;
            r2 = jd[i].red2;
            r3 = jd[i].red3;
            b1 = jd[i].blue1;
            b2 = jd[i].blue2;
            b3 = jd[i].blue3;
            if (r1 == teamNumber)
              r1 = '<b style="font-weight:bolder;">' + r1 + '</b>';
            if (r2 == teamNumber)
              r2 = '<b style="font-weight:bolder;">' + r2 + '</b>';
            if (r3 == teamNumber)
              r3 = '<b style="font-weight:bolder;">' + r3 + '</b>';
            if (b1 == teamNumber)
              b1 = '<b style="font-weight:bolder;">' + b1 + '</b>';
            if (b2 == teamNumber)
              b2 = '<b style="font-weight:bolder;">' + b2 + '</b>';
            if (b3 == teamNumber)
              b3 = '<b style="font-weight:bolder;">' + b3 + '</b>';
            if (jd[i].red3 == undefined) scoreshtml += ('<td class="red">' + r1 + ", " + r2 + '</td>');
            else scoreshtml += ('<td class="red">' + r1 + ", " + r2 + ", " + r3 + '</td>');
            if (jd[i].blue3 == undefined) scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + '</td>');
            else scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + ", " + b3 + '</td>');
            scoreshtml += ('<td class="red">' + jd[i].redscore + '</td>');
            scoreshtml += ('<td class="blue">' + jd[i].bluescore + '</td>');
            if (jd[i].scored == "False")
              scoreshtml += ('<td>Unplayed</td>');
            else if ((jd[i].red1 == teamNumber) || (jd[i].red2 == teamNumber) || (jd[i].red3 == teamNumber)) {
              if (parseInt(jd[i].redscore) > highScore) {
                highScore = parseInt(jd[i].redscore)
              }
              if (parseInt(jd[i].redscore) < lowScore) {
                lowScore = parseInt(jd[i].redscore)
              }
              if (parseInt(jd[i].redscore) > parseInt(jd[i].bluescore)) {
                scoreshtml += ('<td class="victory">WIN</td>');
              } else if (parseInt(jd[i].redscore) == parseInt(jd[i].bluescore)) {
                scoreshtml += ('<td class="tie">TIE</td>');
              } else {
                scoreshtml += ('<td class="yellow">LOSS</td>');
              }
            } else {
              if (parseInt(jd[i].bluescore) > highScore) {
                highScore = parseInt(jd[i].bluescore)
              }
              if (parseInt(jd[i].bluescore) < lowScore) {
                lowScore = parseInt(jd[i].bluescore)
              }
              if (parseInt(jd[i].bluescore) > parseInt(jd[i].redscore)) {
                scoreshtml += ('<td class="victory">WIN</td>');
              } else if (parseInt(jd[i].redscore) == parseInt(jd[i].bluescore)) {
                scoreshtml += ('<td class="tie">TIE</td>');
              } else {
                scoreshtml += ('<td class="yellow">LOSS</td>');
              }
            }
            scoreshtml += ('</tr>');
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
    url: 'http://ajax.robotevents.com/tm/results/rankings/?format=csv&sku=' + mySKU + '&div=' + teamDivisionNumber,
    dataType: 'text',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      if (jd.length < 3) {} else {
        for (i = 0; i < 3; i++) {
          $('#' + (i + 1)).append('<td>' + jd[i].rank + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].teamnum + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].wins + '-' + jd[i].losses + '-' + jd[i].ties + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].wp + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].sp + '</td>');
        }
      }
    },
    async: false,
  });
  $.ajax({
    url: 'http://ajax.robotevents.com/tm/results/rankings/?format=csv&sku=' + mySKU + '&div=' + teamDivisionNumber,
    dataType: 'text',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      if (jd.length == 0) {} else {
        for (i = 0; i < jd.length; i++) {
          if (jd[i].teamnum == teamNumber) {
            $('#us').append('<td><b>' + jd[i].rank + '</b></td>');
            $('#us').append('<td><b>' + jd[i].teamnum + '</b></td>');
            $('#us').append('<td><b>' + jd[i].wins + '-' + jd[i].losses + '-' + jd[i].ties + '</b></td>');
            $('#us').append('<td><b>' + jd[i].wp + '</b></td>');
            $('#us').append('<td><b>' + jd[i].sp + '</b></td>');
          }
        }
      }
    },
    async: false,
  });

  //Handle rankings - from robotevents
  for (division=1; division<=divisions; division++) {
    $.ajax({
      url: 'http://ajax.robotevents.com/tm/results/rankings/?format=csv&sku=' + mySKU + '&div=' + division,
      dataType: 'text',
      success: function(input) {
        scoreshtml = '<button class="accordion">'+divisionsArray[division-1]+'</button>'
        if(teamDivision == divisionsArray[division-1])
          scoreshtml += '<div class="panel show"';
        else
          scoreshtml += '<div class="panel"';
        scoreshtml += 'id="' + divisionsArray[division-1] + '"><table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>W-L-T</th><th>WP</th><th>SP</th></tr>';
        var jd = jQuery.parseJSON(CSV2JSON(input));
        for (i = 0; i < jd.length - 1; i++) {
          if (jd[i].teamnum == teamNumber) {
            scoreshtml += ('<td class=yellow><b>' + jd[i].rank + '</b></td>');
            scoreshtml += ('<td class=yellow><b><a class="black" href=http://vexdb.io/teams/view/' + jd[i].teamnum + '>' + jd[i].teamnum + '</a></b></td>');
            scoreshtml += ('<td class=yellow><b>' + jd[i].wins + '-' + jd[i].losses + '-' + jd[i].ties + '</b></td>');
            scoreshtml += ('<td class=yellow><b>' + jd[i].wp + '</b></td>');
            scoreshtml += ('<td class=yellow><b>' + jd[i].sp + '</b></td></tr>');
          } else {
            scoreshtml += ('<td>' + jd[i].rank + '</td>');
            scoreshtml += ('<td><a class="black" href=http://vexdb.io/teams/view/' + jd[i].teamnum + '>' + jd[i].teamnum + '</a></td>');
            scoreshtml += ('<td>' + jd[i].wins + '-' + jd[i].losses + '-' + jd[i].ties + '</td>');
            scoreshtml += ('<td>' + jd[i].wp + '</td>');
            scoreshtml += ('<td>' + jd[i].sp + '</td></tr>');
          }
        }
        scoreshtml += '</table></div>';
        $('#rankings').append(scoreshtml);
      },
      async: false,
    });
  }
  //handle robot skills - from RobotEvents
  $.ajax({
    url: 'http://ajax.robotevents.com/tm/results/skills_robot/?format=csv&sku=' + mySKU + '&div=',
    dataType: 'text',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      roboSkillsHtml = '<table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>Score</th><th>Attempts</th></tr>';
      for (i = 0; i < jd.length - 1; i++) {
        if (jd[i].teamnum == teamNumber) {
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].rank + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].team + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].highscore + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].attempts + '</b></td></tr>');
        } else {
          roboSkillsHtml += ('<td>' + jd[i].rank + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].team + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].highscore + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].attempts + '</td></tr>');
        }
      }
      roboSkillsHtml += '</table>';
      $('#roboskills').append(roboSkillsHtml);
    },
    async: false,
  });

  //handle programming sills - from robotevents
  $.ajax({
    url: 'http://ajax.robotevents.com/tm/results/skills_programming/?format=csv&sku=' + mySKU + '&div=',
    dataType: 'text',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      roboSkillsHtml = '<table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>Score</th><th>Attempts</th></tr>';
      for (i = 0; i < jd.length - 1; i++) {
        if (jd[i].teamnum == teamNumber) {
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].rank + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].team + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].highscore + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].attempts + '</b></td></tr>');
        } else {
          roboSkillsHtml += ('<td>' + jd[i].rank + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].team + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].highscore + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].attempts + '</td></tr>');
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
      url: ('http://ajax.robotevents.com/tm/results/matches/?format=csv&sku=' + mySKU + '&div=' + teamDivisionNumber),
      dataType: 'text',
      success: function(input) {
        var jd = jQuery.parseJSON(CSV2JSON(input));
        currentMatchNumber = 0;
        differience = 0;
        for (i = 0; i < jd.length; i++) {
          if (jd[i].scored == 'False') {
            currentMatchNumber = jd[i].matchnum;
            currentMatchTitle = "";
            if (jd[i].round == 2) {
              currentMatchTitle=('QM ');
            } else if (jd[i].round == 3) {
              currentMatchTitle=('QF ');
            } else if (jd[i].round == 4) {
              currentMatchTitle=('SF ');
            } else if (jd[i].round == 5) {
              currentMatchTitle=('F ');
            }
            $('#currentmatch').append('Current Match Number: ' + currentMatchTitle + jd[i].matchnum);
            break;
          }
        }
        for(i = 0; i < jd.length; i++) {
          if(jd[i].scored == 'False' && (jd[i].red1 == teamNumber || jd[i].red2 == teamNumber || jd[i].red3 == teamNumber || jd[i].blue1 == teamNumber || jd[i].blue2 == teamNumber || jd[i].blue3 == teamNumber)) {
            differience = jd[i].matchnum - currentMatchNumber;
            if(differience == 0)
              $('#currentmatch').append('<b> Playing Now</b>');
            else
              $('#currentmatch').append(', Our Next Match: ' + jd[i].matchnum + ', Up in <b>' + differience + '</b> matches');
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
