"use strict";

function Site(name, x, y) {
	this.name = name;
	this.known = false;
	this.x = x;
	this.y = y;
	this.attractions = [];
	this.encounters = [];
	this.neighbors = [];
	this.button = null;
}

// "Learns" the site (see but can't visit: compare "visitable")
Site.prototype.learn = function(visitable) {
	if (!this.button) {
		if (!visitable) {
			var news = document.createElement("div");
			news.innerHTML = "News of &ldquo;" + this.name + "&rdquo;. It has been added to your map.";
			var map = document.getElementById("mapnews");
			map.insertBefore(news, map.firstChild);
		}
		this.button = mapAddSite(this.name, this.x, this.y, this);
		this.button.disabled = true;
	}
};

// "Learns" this site + makes it visitable
Site.prototype.visitable = function() {
	this.learn(true);
	if (this.button.disabled) {
		var news = document.createElement("div");
		news.innerHTML = "Discovered &ldquo;" + this.name + "&rdquo;.";
		var map = document.getElementById("mapnews");
		map.insertBefore(news, map.firstChild);
		this.button.disabled = false;
	}
}

// When visiting "this", you will instantly learn about "other".
// Use "enounters" 
Site.prototype.path = function(other, path) {
	this.neighbors.push(other);
};

// What happens when this site is clicked.
Site.prototype.visit = function() {
	// What happens when you click the button to come to this place.
	var s = document.getElementById("site");
	s.innerHTML = "<h3>" + this.name + "</h3>";
	for (var i = 0; i < this.neighbors.length; i++) {
		this.neighbors[i].visitable();
	}
}


// Begin building the world I guess...
// mapAddSite( "Town of Starting", 0, 0, false/*Site object*/ );

var town = new Site("Town of Starting", 0, 0);
town.visitable();

var forest = new Site("Forest of Nightmares", 200, -20);
town.path(forest);