$(document).ready(function() {
  var teamNumber = "62";
  var mySKU;
  var competingCurrently = true;
  $.ajax({
    url: 'http://api.vexdb.io/get_teams?team=' + teamNumber,
    dataType: 'json',
    success: function(jd) {
      $('#title').append('<p>Team ' + teamNumber + ', ' + jd.result[0].team_name + '</p>');
    },
    async: false,
  });
  $.ajax({
    url: 'http://api.vexdb.io/get_events?team=' + teamNumber + '&status=current',
    dataType: 'json',
    success: function(jd) {
      if (jd.size == 0) {
        $('#status').append('<p>No Ongoing Tournament/Tournament Ended - Displaying Previous Results</p>');
        competingCurrently = false;
      } else {
        $('#status').append('<p>' + jd.result[0].name + '</p>');
        mySKU = jd.result[0].sku;
        $('#sku').append(mySKU + ': <a href=http://www.robotevents.com/' + mySKU + '.html>RobotEvents</a>, <a href=http://vex.us.nallen.me/events/view/' + mySKU + '>VexDB</a>');
      }
    },
    async: false,
  });
  if (!competingCurrently) {
    $.ajax({
      url: 'http://api.vexdb.io/get_events?team=' + teamNumber + '&status=past',
      dataType: 'json',
      success: function(jd) {
        $('#status').append('<p>' + jd.result[0].name + '</p>');
        mySKU = jd.result[0].sku;
        $('#sku').append('<br>' + mySKU + ': <a href=http://www.robotevents.com/' + mySKU + '.html>RobotEvents</a>, <a href=http://vex.us.nallen.me/events/view/' + mySKU + '>VexDB</a>');
      },
      async: false,
    });
  }
  $.ajax({
    url: ('http://api.vexdb.io/get_matches?team=' + teamNumber + '&sku=' + mySKU),
    dataType: 'json',
    success: function(jd) {
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
            $('#status').append('<br><div style="color:red;">' + jd.result[i].red1 + ", " + jd.result[i].red2);
            if (jd.result[i].red3 != "")
              $('#status').append(", " + jd.result[i].red3);
            $('#status').append('</div><div style="color:blue;">' + jd.result[i].blue1 + ", " + jd.result[i].blue2);
            if (jd.result[i].blue3 != "")
              $('#status').append(", " + jd.result[i].blue3);
            $('#status').append('</div><hr>');
            break;
          }
        }
      }
      scoreshtml = '<table style="width:100%" border="1"><tr><th>Match</th><th>Red Alliance</th><th>Blue Alliance</th><th>Red Score</th><th>Blue Score</th><th>Outcome</th></tr>';
      var highScore = 0;
      var lowScore = 5000;
      for (i = 0; i < jd.size; i++) {
        if (true /*jd.result[i].scored == 1*/ ) {
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
          if (jd.result[i].red3 == "") scoreshtml += ('<td class="red">' + r1 + ", " + r2 + '</td>');
          else scoreshtml += ('<td class="red">' + r1 + ", " + r2 + ", " + r3 + '</td>');
          if (jd.result[i].blue3 == "") scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + '</td>');
          else scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + ", " + b3 + '</td>');
          scoreshtml += ('<td class="red">' + jd.result[i].redscore + '</td>');
          scoreshtml += ('<td class="blue">' + jd.result[i].bluescore + '</td>');
          if (jd.result[i].scored == 0)
            scoreshtml += ('<td>Unplayed</td>');
          else if ((jd.result[i].red1 == teamNumber) || (jd.result[i].red2 == teamNumber) || (jd.result[i].red3 == teamNumber)) {
            if (parseInt(jd.result[i].redscore) > highScore) {
              highScore = parseInt(jd.result[i].redscore)
            }
            if (parseInt(jd.result[i].redscore) < lowScore) {
              lowScore = parseInt(jd.result[i].redscore)
            }
            if (parseInt(jd.result[i].redscore) > parseInt(jd.result[i].bluescore)) {
              scoreshtml += ('<td class="victory">WIN</td>');
            } else {
              scoreshtml += ('<td class="yellow">LOSS</td>');
            }
          } else {
            if (parseInt(jd.result[i].bluescore) > highScore) {
              highScore = parseInt(jd.result[i].bluescore)
            }
            if (parseInt(jd.result[i].bluescore) < lowScore) {
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
      if (lowScore != 5000)
        $('#highlowscore').append('<p>High Score: ' + highScore + ', Low Score: ' + lowScore + '</p>');
    },
    async: false,
  });
  $.ajax({
    url: 'http://api.vexdb.io/get_rankings?sku=' + mySKU,
    dataType: 'json',
    success: function(jd) {
      if (jd.size == 0) {} else {
        for (i = 0; i < 3; i++) {
          $('#' + (i + 1)).append('<td>' + jd.result[i].rank + '</td>');
          $('#' + (i + 1)).append('<td>' + jd.result[i].team + '</td>');
          $('#' + (i + 1)).append('<td>' + jd.result[i].wins + '-' + jd.result[i].losses + '-' + jd.result[i].ties + '</td>');
          $('#' + (i + 1)).append('<td>' + jd.result[i].wp + '</td>');
          $('#' + (i + 1)).append('<td>' + jd.result[i].sp + '</td>');
        }
      }
    },
    async: false,
  });
  $.ajax({
    url: 'http://api.vexdb.io/get_rankings?team=' + teamNumber + '&sku=' + mySKU,
    dataType: 'json',
    success: function(jd) {
      if (jd.size == 0) {} else {
        $('#us').append('<td><b>' + jd.result[0].rank + '</b></td>');
        $('#us').append('<td><b>' + jd.result[0].team + '</b></td>');
        $('#us').append('<td><b>' + jd.result[0].wins + '-' + jd.result[0].losses + '-' + jd.result[0].ties + '</b></td>');
        $('#us').append('<td><b>' + jd.result[0].wp + '</b></td>');
        $('#us').append('<td><b>' + jd.result[0].sp + '</b></td>');
      }
    },
    async: false,
  });
  $.ajax({
    url: 'http://ajax.robotevents.com/tm/results/rankings/?format=csv&sku=RE-VRC-15-3788&div=1',
    dataType: 'text',
    success: function(input) {
      scoreshtml = '<table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>W-L-T</th><th>WP</th><th>SP</th></tr>';
      var jd = jQuery.parseJSON(CSV2JSON(input));
      for (i = 0; i < jd.length-1; i++) {
        scoreshtml += ('<td>' + jd[i].rank + '</td>');
        scoreshtml += ('<td>' + jd[i].teamnum + '</td>');
        scoreshtml += ('<td>' + jd[i].wins + '-' + jd[i].losses + '-' + jd[i].ties + '</td>');
        scoreshtml += ('<td>' + jd[i].wp + '</td>');
        scoreshtml += ('<td>' + jd[i].sp + '</td></tr>');


      }
      scoreshtml += '</table>';
      $('#rankings').append(scoreshtml);
    },
    async: false,
  });
  $.ajax({
    url: 'http://ajax.robotevents.com/tm/results/skills_robot/?format=csv&sku='+mySKU+'&div=',
    dataType: 'text',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      roboSkillsHtml = '<table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>Score</th><th>Attempts</th></tr>';
      for (i = 0; i < jd.length - 1; i++) {
        if (jd[i].team == teamNumber) {
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
  $.ajax({
    url: 'http://ajax.robotevents.com/tm/results/skills_programming/?format=csv&sku='+mySKU+'&div=',
    dataType: 'text',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      roboSkillsHtml = '<table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>Score</th><th>Attempts</th></tr>';
      for (i = 0; i < jd.length - 1; i++) {
        if (jd[i].team == teamNumber) {
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
  $.ajax({
    url: 'http://api.vexdb.io/get_skills?season_rank=true&rank=1&program=VRC&season=current&type=0',
    dataType: 'json',
    success: function(jd) {
      $('#robohighscore').append(jd.result[0].team + " (" + jd.result[0].attempts + " attempts): " + jd.result[0].score);
    },
    async: false,
  });
  $.ajax({
    url: 'http://api.vexdb.io/get_skills?season_rank=true&rank=1&program=VRC&season=current&type=1',
    dataType: 'json',
    success: function(jd) {
      $('#proghighscore').append(jd.result[0].team + " (" + jd.result[0].attempts + " attempts): " + jd.result[0].score);
    },
    async: false,
  });
  $.ajax({
    url: ('http://api.vexdb.io/get_matches?sku=' + mySKU),
    dataType: 'json',
    success: function(jd) {
        for (i = 0; i < jd.size; i++) {
          if (jd.results[i].scored == 0) {

            $('#currentmatch').append('Current Match Number: ' + jd.result[i].matchnum);
            break;

          }
        }
      } //,
      // async: false,
  });
});

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
