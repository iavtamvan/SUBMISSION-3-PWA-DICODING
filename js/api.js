var base_url = "https://api.football-data.org/v2/";
const API_KEY = 'b1b29540ead5420d84ed9e801f4596cb';
const LEAGUE_ID = 2015
var standings_url = `${base_url}competitions/${LEAGUE_ID}/standings?standingType=TOTAL`
var matches_url = `${base_url}competitions/${LEAGUE_ID}/matches`
var teams_url = `${base_url}competitions/${LEAGUE_ID}/teams`
var matchesData;
var teamsData;

function fetchApi(url) {
  return fetch(url, {
    headers: {
      'X-Auth-Token': API_KEY
    }
  });
}

function status(response) {
	if (response.status !== 200) {
		console.log("Error : " + response.status);
		return Promise.reject(new Error(response.statusText));
	} else {
		return Promise.resolve(response);
	}
}

function json(response) {
	return response.json();
}

function error(error) {
	console.log("Error : " + error);
}

function loading() {
  var html = ` 
    <div>
      <img src="/img/loading.gif"/>
    </div>`
  document.getElementById("loading").innerHTML = html;
  document.getElementById("title-content").innerHTML = '';
  document.getElementById("main-content").innerHTML = '';
}

function hideload() {
  document.getElementById("loading").innerHTML = '';
}

function getStandings() {
  loading();
	if ('caches' in window) {
		caches.match(standings_url).then(function(response) {
			if (response) {
				response.json().then(function(data) {
    			var html = ''
    			data.standings.forEach(function(standing) {
      			var detail = ''
      			standing.table.forEach(function(result) {
        			detail += `
                <tr>
            			<td>${result.position}</td>
            			<td>${result.team.name}</td>
            			<td>${result.playedGames}</td>
            			<td>${result.won}</td>
            			<td>${result.draw}</td>
            			<td>${result.lost}</td>
            			<td>${result.points}</td>
            			<td>${result.goalsFor}</td>
            			<td>${result.goalsAgainst}</td>
            			<td>${result.goalDifference}</td>
          			</tr>
              `
            });
      			html += `
      				<div style="text-align: center">
       					<h5 class="header">${standing.group}</h5>
       				</div>
        			<div class="col s12 m12">
        				<div class="card">
    	    				<div class="card-content">
	    	   					<table class="responsive-table striped">
       								<head>
	      								<tr>
           								<th>Position</th>
            							<th>Team</th>
            							<th>Played</th>
            							<th>Won</th>
           								<th>Draw</th>
           								<th>Lost</th>
           								<th>Points</th>
           								<th>GF</th>
           								<th>GA</th>
            							<th>GD</th>
          							</tr>
        							</head>
        							<body>` + detail + `</body>
        						</table>
        					</div>
       					</div>
       				</div>
       			`
    			});
          document.getElementById("title-content").innerHTML = 'Liga Perancis';
          document.getElementById("main-content").innerHTML = html;
          hideload();
  			});
			}
		});
	}
	fetchApi(standings_url)
	.then(status)
	.then(json)
	.then(function(data) {
    var html = ''
   	data.standings.forEach(function(standing) {
      var detail = ''
    	standing.table.forEach(function(result) {
     		detail += `
          <tr>
            <td>${result.position}</td>
            <td>${result.team.name}</td>
            <td>${result.playedGames}</td>
            <td>${result.won}</td>
            <td>${result.draw}</td>
            <td>${result.lost}</td>
            <td>${result.points}</td>
            <td>${result.goalsFor}</td>
            <td>${result.goalsAgainst}</td>
            <td>${result.goalDifference}</td>
          </tr>
        `
      });
      html += `
      	<div style="text-align: center">
       		<h5 class="header">${standing.stage} and ${standing.type}</h5>
       	</div>
        <div class="col s12 m12">
	        <div class="card">
        		<div class="card-content">
       				<table class="responsive-table striped">
       					<head>
	      					<tr>
           					<th>Position</th>
            				<th>Team</th>
            				<th>Played</th>
            				<th>Won</th>
           					<th>Draw</th>
           					<th>Lost</th>
           					<th>Points</th>
           					<th>GF</th>
           					<th>GA</th>
            				<th>GD</th>
          				</tr>
        				</head>
        				<body>` + detail + `</body>
        			</table>
        		</div>
       		</div>
       	</div>
      `
    });
    document.getElementById("title-content").innerHTML = 'Liga Perancis';
    document.getElementById("main-content").innerHTML = html;
    hideload();
  })
	.catch(error);
}

function getMatches() {
  loading();
	if ('caches' in window) {
		caches.match(matches_url).then(function(response) {
			if (response) {
				response.json().then(function(data) {
          matchesData = data;
					var groupBy = function (xs, key) {
						return xs.reduce(function (rv, x) {
							(rv[x[key]] = rv[x[key]] || []).push(x);
    					return rv;
						}, {});
					}
					var matchdays = groupBy(data.matches, 'matchday');
    			var html = ''
    			for (const key in matchdays) {
    				if (key != 'null') {
        			html += `
              	<div style="text-align: center">
              		<h5 class="header">Group stage ${key} of 7</h5>
              	</div>
              	<div class="card">
              		<div class="card-content">
                    <div class="row">
              `
              matchdays[key].forEach(function(match) {
								var dateToDMY = function(date) {
                  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
								}
                html += `
          				<div class="col s12 m6 l6" style="border-top:rgba(0,0,0,.2) solid 1px">
            				<div style="text-align: center">
            				  <h6>${dateToDMY(new Date(match.utcDate))}</h6>
                      <a class="waves-effect waves-light btn-small blue" onclick="insertMatch(${match.id})">Add to Favorite</a>
            				</div>
                    <div class="col s4 m4 l4">${match.homeTeam.name}</div>
                    <div class="col s1">${match.score.fullTime.homeTeam}</div>
                    <div style="text-align: center" class="col s2">vs</div>
                    <div style="text-align: right" class="col s1">${match.score.fullTime.awayTeam}</div>
                    <div style="text-align: right" class="col s4">${match.awayTeam.name}</div>
          				</div>
            		`
              });
              html += `
              			</div>
              		</div>
              	</div>
              `
            }
    			}
          document.getElementById("title-content").innerHTML = 'Liga Perancis Matches';
          document.getElementById("main-content").innerHTML = html;
          hideload();
				});
			}
    });
  }
	fetchApi(matches_url)
	.then(status)
	.then(json)
	.then(function(data) {
    matchesData = data;
		var groupBy = function (xs, key) {
			return xs.reduce(function (rv, x) {
				(rv[x[key]] = rv[x[key]] || []).push(x);
    		return rv;
			}, {});
		};
		var matchdays = groupBy(data.matches, 'matchday');
    var html = ''
    for (const key in matchdays) {
    	if (key != 'null') {
       	html += `
          <div style="text-align: center">
            <h5 class="header">Group stage ${key} of 7</h5>
          </div>
          <div class="card">
            <div class="card-content">
              <div class="row ">
        `
        matchdays[key].forEach(function(match) {
          var dateToDMY = function(date) {
						return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
          }
          html += `
            <div class="col s12 m6 l6" style="border-top:rgba(0,0,0,.2) solid 1px">
              <div style="text-align: center">
                <h6>${dateToDMY(new Date(match.utcDate))}</h6>
                <a class="waves-effect waves-light btn-small blue" onclick="insertMatch(${match.id})">Add to Favorite</a>
              </div>
              <div class="col s4 m4 l4">${match.homeTeam.name}</div>
              <div class="col s1">${match.score.fullTime.homeTeam}</div>
              <div style="text-align: center" class="col s2">vs</div>
              <div style="text-align: right" class="col s1">${match.score.fullTime.awayTeam}</div>
              <div style="text-align: right" class="col s4">${match.awayTeam.name}</div>
            </div>
          `
        });
        html += `
              </div>
            </div>
          </div>
        `
      }
    }
    document.getElementById("title-content").innerHTML = 'Liga Perancis Matches';
    document.getElementById("main-content").innerHTML = html;
    hideload();
	})
	.catch(error);
}

function getTeams() {
  loading();
	if ('caches' in window) {
		caches.match(teams_url).then(function(response) {
			if (response) {
				response.json().then(function(data) {
          teamsData = data;
					var html = ''
					html += `<div class="row">`
					data.teams.forEach(function(team) {
      			html += `
      				<div class="col s12 m6 l6">
        				<div class="card">
          				<div class="card-content">
           					<div class="center">
           						<img width="65" height="65" src="${team.crestUrl || '/img/not_found.jpg'}">
           					</div>
            				<div class="center flow-text">${team.name}</div>
            				<div class="center">${team.area.name}</div>
            				<div class="center"><a href="${team.website}">${team.website}</a></div>
          				</div>
          				<div style="text-align: center">
              			<a class="waves-effect waves-light btn-small blue" onclick="insertTeam(${team.id})">Add to Favorite</a>
          				</div>
        				</div>
      				</div>
    				`
    			});
    			html += `</div>`
          document.getElementById("title-content").innerHTML = 'Liga Perancis Teams';
          document.getElementById("main-content").innerHTML = html;
          hideload();
				});
			}
    });
  }
	fetchApi(teams_url)
	.then(status)
	.then(json)
	.then(function(data) {
    teamsData = data;
		var html = ''
		html += `<div class="row">`
		data.teams.forEach(function(team) {
      html += `
      	<div class="col s12 m6 l6">
        	<div class="card">
          	<div class="card-content">
           		<div class="center">
           			<img width="65" height="65" src="${team.crestUrl || '/img/not_found.jpg'}">
           		</div>
            	<div class="center flow-text">${team.name}</div>
            	<div class="center">${team.area.name}</div>
            	<div class="center"><a href="${team.website}">${team.website}</a></div>
          	</div>
          	<div style="text-align: center">
              <a class="waves-effect waves-light btn-small blue" onclick="insertTeam(${team.id})">Add to Favorite</a>
          	</div>
        	</div>
      	</div>
    	`
    });
    html += `</div>`
    document.getElementById("title-content").innerHTML = 'Liga Perancis Teams';
    document.getElementById("main-content").innerHTML = html;
    hideload();
	})
	.catch(error);
}

// Membuka akses database
var dbPromise = idb.open("football", 1, function(upgradeDb) {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('matches', {'keyPath': 'id'})
      upgradeDb.createObjectStore('teams', {'keyPath': 'id'})
  }
})

// Favorit Matches
function favoriteMatches() {
  loading();
  return dbPromise.then(function(db) {
    var tx = db.transaction('matches', 'readonly');
    var store = tx.objectStore('matches');
    return store.getAll();
  })
	.then(function(data) {
    matchesData = data;
		var html = ''
    html += `
      <div class="card">
        <div class="card-content">
          <div class="row ">
    `
    data.forEach(function(match) {
      var dateToDMY = function(date) {
        return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
      }
      html += `
        <div class="col s12 m6 l6" style="border-top:rgba(0,0,0,.2) solid 1px">
          <div style="text-align: center">
            <h6>${dateToDMY(new Date(match.utcDate))}</h6>
            <a class="waves-effect waves-light btn-small red" onclick="deleteMatch(${match.id})">Delete</a>
          </div>
          <div class="col s4 m4 l4">${match.homeTeam.name}</div>
          <div class="col s1">${match.score.fullTime.homeTeam}</div>
          <div style="text-align: center" class="col s2">vs</div>
          <div style="text-align: right" class="col s1">${match.score.fullTime.awayTeam}</div>
          <div style="text-align: right" class="col s4">${match.awayTeam.name}</div>
        </div>
      `
    });
    if (matchesData.length == 0) {
      html += `
      <div>
        <h6 class="center-align">Tidak ada Pertandingan di daftar Favorit.</h6>
      </div>`
    }
    html += `
          </div>
        </div>
      </div>
    `
    document.getElementById("title-content").innerHTML = 'Favorite Matches';
    document.getElementById("main-content").innerHTML = html;
    hideload();
	})
  .catch(error);
}

// Favorit Teams
function favoriteTeams() {
  loading();
  return dbPromise.then(function(db) {
    var tx = db.transaction('teams', 'readonly');
    var store = tx.objectStore('teams');
    return store.getAll();
  })
  .then(function(data) {
    teamsData = data;
    var html = ''
    html += `<div class="row">`
    data.forEach(function(team) {
      html += `
        <div class="col s12 m6 l6">
          <div class="card">
            <div class="card-content">
              <div class="center">
                <img width="65" height="65" src="${team.crestUrl || '/img/not_found.jpg'}">
              </div>
              <div class="center flow-text">${team.name}</div>
              <div class="center">${team.area.name}</div>
              <div class="center"><a href="${team.website}">${team.website}</a></div>
            </div>
            <div style="text-align: center">
              <a class="waves-effect waves-light btn-small red" onclick="deleteTeam(${team.id})">Delete</a>
            </div>
          </div>
        </div>
      `
    });
    if (teamsData.length == 0) {
      html += `
      <div>
        <h6 class="center-align">Tidak ada Team di daftar Favorit.</h6>
      </div>`
    }
    html += `</div>`
    document.getElementById("title-content").innerHTML = 'Favorite Teams';
    document.getElementById("main-content").innerHTML = html;
    hideload();
	})
  .catch(error);
}

// Insert Matches
function insertMatches(match) {
	dbPromise.then(function(db) {
    var tx = db.transaction('matches', 'readwrite');
    var store = tx.objectStore('matches')
    match.createdAt = new Date().getTime()
    store.put(match)
    return tx.complete;
  }).then(function() {
    console.log('Pertandingan berhasil disimpan.');
  }).catch(function(e) {
    console.error('Pertandingan gagal disimpan', e);
  });
}

function insertMatch(matchId) {
  var notif = confirm("Tambahkan Pertandingan ke daftar Favorit?")
  if (notif == true) {
    var match = matchesData.matches.filter(el => el.id == matchId)[0]
    insertMatches(match);
  }
}

// Delete Matches
function deleteMatches(matchId) {
	dbPromise.then(function(db) {
    var tx = db.transaction('matches', 'readwrite');
    var store = tx.objectStore('matches')
    store.delete(matchId)
    return tx.complete;
  }).then(function() {
    console.log('Pertandingan berhasil dihapus.');
    favoriteMatches();
  }).catch(function(e) {
    console.error('Pertandingan gagal disimpan', e);
  });
}

function deleteMatch(matchId) {
  var notif = confirm("Hapus Pertandingan dari daftar Favorit?")
  if (notif == true) {
    deleteMatches(matchId);
  }
}

// Insert Teams
function insertTeams(team) {
	dbPromise.then(function(db) {
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams')
    team.createdAt = new Date().getTime()
    store.put(team)
    return tx.complete;
  }).then(function() {
    console.log('Team berhasil disimpan.');
  }).catch(function(e) {
    console.error('Team gagal disimpan', e);
  });
}

function insertTeam(teamId) {
  var notif = confirm("Tambahkan Team ke daftar Favorit?")
  if (notif == true) {
    var team = teamsData.teams.filter(el => el.id == teamId)[0]
    insertTeams(team);
  }
}

// Delete Teams
function deleteTeams(teamId) {
	dbPromise.then(function(db) {
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams')
    store.delete(teamId)
    return tx.complete;
  }).then(function() {
    console.log('Team berhasil dihapus.');
    favoriteTeams();
  }).catch(function(e) {
    console.error('Team gagal disimpan', e);
  });
}

function deleteTeam (teamId) {
  var notif = confirm("Hapus Team dari daftar Favorit?")
  if (notif == true) {
    deleteTeams(teamId);
  }
}
function showNotifikasiSederhana() {
    const title = 'Notifikasi Sederhana';
    const options = {
        'body': 'Ini adalah konten notifikasi. \nBisa menggunakan baris baru.',
    }
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('FItur notifikasi tidak diijinkan.');
    }
}