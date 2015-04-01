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
	for (var i = 0; i < this.neighbors.length; i++) {
		this.neighbors[i].visitable();
	}
	// Show site details
	document.getElementById("sitetitle").innerHTML = this.name;
	var s = document.getElementById("site");
	s.innerHTML = "";
	for (var i = 0; i < this.attractions.length; i++) {
		this.attractions[i].show();
	}
	// Run through list of encounters
	for (var i = 0; i < this.encounters.length; i++) {
		if (Math.random() < this.encounters[i].chance) {
			this.encounters[i].happen();
			document.getElementById("site").style.display = "none";
			document.getElementById("map").style.display = "none";
			break;
		}
	}
}

Site.prototype.removeEncounter = function(en) {
	this.encounters.splice( this.encounters.indexOf(en) , 1 );
}

// Adds a new encounter with probability p of happening. NOTE: This probability
// is the prob it will happen WHEN FOUND IN LIST (in order) 
// OR
// adds a thing with show() which is an attraction
Site.prototype.add = function(thing) {
	if (thing.show) {
		this.attractions.push(thing);
	} else if (thing.happen && thing.chance) {
		this.encounters.push(thing);
	} else {
		throw "Site.add not given something with .happen or .show";
	}
};

// Begin building the world I guess...
// mapAddSite( "Town of Starting", 0, 0, false/*Site object*/ );

var town = new Site("Town of Starting", 0, 0);
town.visitable();

var forest = new Site("Forest of Nightmares", 200, -20);
town.path(forest);

var cave = new Site("Cute Cave", 100, 80);
forest.path(cave);

// Chance in (0, 1]
// name the enemy's name.
function CombatEncounter(name, chance) {
	this.name = name;
	this.chance = chance;
}

CombatEncounter.prototype.happen = function() {
	enterCombat(this.name);
};

forest.add( new CombatEncounter("goblin", 0.5) );
cave.add( new CombatEncounter("dragon", 0.9) );