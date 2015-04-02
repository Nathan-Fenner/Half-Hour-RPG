"use strict";

var mapCenterX = 0;
var mapCenterY = 0;

// Centers the view of the map on (x, y)
function mapCenter(x, y) {
	mapCenterX = x;
	mapCenterY = y;
	mapcross.style.left = -(x << 0) + 320 + "px";
	mapcross.style.top = -(y << 0) + 150 + "px";
}
mapCenter(0,0); // Center on the origin to begin.

// Creates a new button with text "name" at (x, y). Site is a site object.
// Right now it calls "visit" on the site when the user wants to visit a site.
function mapAddSite(name, x, y, site) {
	var b = document.createElement("button");
	b.textContent = name;
	b.style.position = "absolute";
	var w = name.length * 8;
	b.style.left = (x - w/2 << 0) + "px";
	b.style.top = (y << 0) + "px";
	b.style.width = w + "px";
	b.onclick = function() {
		site.visit();
		mapCenter(x, y);
	}
	document.getElementById("mapcross").appendChild(b);
	return b;
}

var news = document.createElement("div");
news.id = "mapnews";
document.getElementById("map").appendChild(news);