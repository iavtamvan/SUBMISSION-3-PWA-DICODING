document.addEventListener("DOMContentLoaded", function() {
	// Activate sidebar nav
	var elems = document.querySelectorAll(".sidenav");
	M.Sidenav.init(elems);
	loadNav();

	function loadNav() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status != 200) return;

				// Muat daftar tautan menu
				document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
					elm.innerHTML = xhttp.responseText;
				});

				// Daftarkan event listerner untuk setiap tautan menu
				document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
					elm.addEventListener("click", function(event) {
						// Tutup sidenav
						var sidenav = document.querySelector(".sidenav");
						M.Sidenav.getInstance(sidenav).close();

						// Muat konten halaman yang dipanggil
						page = event.target.getAttribute("href").substr(1);
						loadPage(page);
					});
				});
			}
		};
		xhttp.open("GET", "./nav.html", true);
		xhttp.send();
	}
	// Load page content
	var page = window.location.hash.substr(1);
	if (page == "") page = "standing";
	loadPage(page);

	function loadPage(page) {
    	if (page == 'standing') getStandings();
    	if (page == 'match') getMatches();
    	if (page == 'team') getTeams();
    	if (page == 'favorite-match') favoriteMatches();
    	if (page == 'favorite-team') favoriteTeams();
	}
});