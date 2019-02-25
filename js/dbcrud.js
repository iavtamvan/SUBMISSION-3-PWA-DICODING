var matchesData;
var teamsData;

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
	})
  .catch(error);
}

// Favorit Teams
function favoriteTeams() {
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
    M.toast({ html: `Pertandingan ${match.homeTeam.name} VS ${match.awayTeam.name}\nberhasil disimpan.` });
    console.log('Pertandingan berhasil disimpan.');
  }).catch(function(e) {
    console.error('Pertandingan gagal disimpan', e);
  });
}

function insertMatch(matchId) {
	var match = matchesData.matches.filter(el => el.id == matchId)[0]
    insertMatches(match);
}

// Delete Matches
function deleteMatches(matchId) {
	dbPromise.then(function(db) {
    var tx = db.transaction('matches', 'readwrite');
    var store = tx.objectStore('matches')
    store.delete(matchId)
    return tx.complete;
  }).then(function() {
    M.toast({ html: 'Pertandingan berhasil dihapus.' });
    console.log('Pertandingan berhasil dihapus.');
    favoriteMatches();
  }).catch(function(e) {
    console.error('Pertandingan gagal disimpan', e);
  });
}

function deleteMatch(matchId) {
    deleteMatches(matchId);
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
    M.toast({ html: `${team.name} berhasil disimpan.` });
    console.log('Team berhasil disimpan.');
  }).catch(function(e) {
    console.error('Team gagal disimpan', e);
  });
}

function insertTeam(teamId) {
    var team = teamsData.teams.filter(el => el.id == teamId)[0]
    insertTeams(team);
}

// Delete Teams
function deleteTeams(teamId) {
	dbPromise.then(function(db) {
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams')
    store.delete(teamId)
    return tx.complete;
  }).then(function() {
    M.toast({ html: 'Team berhasil dihapus.' });
    console.log('Team berhasil dihapus.');
    favoriteTeams();
  }).catch(function(e) {
    console.error('Team gagal disimpan', e);
  });
}

function deleteTeam (teamId) {
    deleteTeams(teamId);
}