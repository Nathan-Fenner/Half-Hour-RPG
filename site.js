"use strict";

// The site that is currently being visited.
var currentSite = null;

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

// Discovers all adjacent sites (if an encounter is selected, only SUCCESFULLY
// dealing with the encounter should trigger this.)
Site.prototype.explore = function() {
	// What happens when you click the button to come to this place.
	for (var i = 0; i < this.neighbors.length; i++) {
		this.neighbors[i].visitable();
	}
}

// What happens when this site is clicked.
Site.prototype.visit = function() {
	currentSite = this;
	// Show site details
	document.getElementById("sitetitle").innerHTML = this.name;
	var s = document.getElementById("site");
	s.innerHTML = "";
	for (var i = 0; i < this.attractions.length; i++) {
		this.attractions[i].show();
	}
	// Run through list of encounters
	var total = 0;
	for (var i = 0; i < this.encounters.length; i++) {
		total += this.encounters[i].chance;
	}
	total *= Math.random();
	if (this.encounters.length == 0) {
		this.explore();
	}
	for (var i = 0; i < this.encounters.length; i++) {
		if (total <= this.encounters[i].chance) {
			this.encounters[i].happen();
			document.getElementById("site").style.display = "none";
			document.getElementById("map").style.display = "none";
			break;
		}
		total -= this.encounters[i].chance;
	}
}

// Removes the given encounter from the list of encounters (use this for
// one-time-encounters)
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




////////////////////////////////////////////////////////////////////////////////

var reports = []

function reportQueue() {
	reports.splice(0, 1);
	if (reports.length > 0) {
		showText( reports[0] );
	} else {
		leaveCombat();
	}
}

function showText(text) {
	playerMode = "explore";
	document.getElementById("combat").style.display = "none";
	var e = document.getElementById("encounter");
	e.style.display = "block";
	e.innerHTML = text;
	e.appendChild(document.createElement("br"));
	var b = document.createElement("button");
	b.onclick = reportQueue;
	b.innerHTML = "Continue on your journey";
	e.appendChild(b);
}

function reportText(text) {
	reports.push(text);
	if (reports.length == 1) {
		showText(text);
	}
}

////////////////////////////////////////////////////////////////////////////////

// Chance the WEIGHT. If thar be only one thing, matey, then this will always
// be picked.
// name the enemy's name.
function CombatEncounter(name, chance) {
	this.name = name;
	this.chance = chance;
}

CombatEncounter.prototype.happen = function() {
	enterCombat(this.name);
};

// Shows flavortext text (text may also be a array of strings; picks randomly)
// Chance is the weight of this event.
// NOTE: This will "explore" the current site -- thus revealing adjacent
// sites, even though there is no challenge here.
function Flavor(text, chance) {
	this.text = text;
	this.chance = chance || 1;
}

Flavor.prototype.happen = function() {
	var text = this.text;
	if (text instanceof Array) {
		text = text[ Math.random() * text.length << 0];
	}
	reportText(text);
	currentSite.discover();
};



////////////////////////////////////////////////////////////////////////////////


// Begin building the world I guess...
// mapAddSite( "Town of Starting", 0, 0, false/*Site object*/ );

var town = new Site("Town of Starting", 0, 0);
town.visitable();

var forest = new Site("Forest of Nightmares", 200, -20);
town.path(forest);

var cave = new Site("Cute Cave", 100, 80);
forest.path(cave);

forest.add( new CombatEncounter("goblin", 0.5) );
forest.add( new Flavor("You see a pretty flower in the scary forest!"));
cave.add( new CombatEncounter("dragon", 0.9) );
