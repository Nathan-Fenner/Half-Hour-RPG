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
Site.prototype.learn = function() {
	if (!this.button) {
		this.button = mapAddSite(this.name, this.x, this.y, this);
		this.button.disabled = true;
	}
};

// "Learns" this site + makes it visitable
Site.prototype.visitable = function() {
	this.learn();
	this.button.disabled = false;
}

// When visiting "this", you will instantly learn about "other".
// Use "enounters" 
Site.prototype.pathTo = function(other, path) {
	this.neighbors.push(other);
};

// What happens when this site is clicked.
Site.prototype.visit = function() {
	// What happens when you click the button to come to this place.
	var s = document.getElementById("site");
	s.innerHTML = "<h3>" + this.name + "</h3>";
}



// Begin building the world I guess...
// mapAddSite( "Town of Starting", 0, 0, false/*Site object*/ );

var town = new Site("Town of Starting", 0, 0);
town.visitable();