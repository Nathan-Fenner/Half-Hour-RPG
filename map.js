"use strict";

var mapCenterX = 0;
var mapCenterY = 0;
var allKnownSites = [];

var canvas = document.getElementById("canvas_map");
canvas.width = 640;
canvas.height = 300;
var ctx = canvas.getContext("2d");
ctx.font = "24px Segoe UI";

// Centers the view of the map on (x, y)
function mapCenter(x, y) {
	mapCenterX = x;
	mapCenterY = y;
	mapcross.style.left = -(x << 0) + 320 + "px";
	mapcross.style.top = -(y << 0) + 150 + "px";

	renderMapCanvas();
}
mapCenter(0,0); // Center on the origin to begin.

function hideMap() {
	document.getElementById("site").style.display = "none";
	document.getElementById("map").style.display = "none";
	document.getElementById("mapsub").style.display = "none";
}

function showMap() {
	document.getElementById("site").style.display = "block";
	document.getElementById("mapsub").style.display = "block";
	document.getElementById("map").style.display = "block";
}


// Creates a new button with text "name" at (x, y). Site is a site object.
// Right now it calls "visit" on the site when the user wants to visit a site.
function mapAddSite(name, x, y, site) {
	site.known = true;
	var b = document.createElement("button");
	b.textContent = name;
	b.style.position = "absolute";
	ctx.save();
	ctx.font = "14px Arial";
	var w = ctx.measureText(name).width + 35;
	var h = 26;
	ctx.restore();
	b.style.left = (x - w/2 << 0) + "px";
	b.style.top = (y - h/2 << 0) + "px";
	b.style.width = w + "px";
	b.style.height = h + "px";
	b.onclick = function() {
		site.focus();
	}
	document.getElementById("mapcross").appendChild(b);
	allKnownSites.push({name:name, x:x, y:y, site:site});

	renderMapCanvas();

	return b;
}

var news = document.createElement("div");
news.id = "mapnews";
document.getElementById("map").appendChild(news);


function renderMapCanvas() {

	ctx.clearRect(0,0, 640, 300);
	ctx.save();
	ctx.translate(320, 150);
	ctx.translate( -mapCenterX, -mapCenterY );
	ctx.fillStyle = "#6A3";

	ctx.strokeStyle = "#462";

	ctx.beginPath();

	for (var i = 0; i < allKnownSites.length; ++i) {
		var site = allKnownSites[i].site;
		var neighbors = site.neighbors;
		for (var j = 0; j < neighbors.length; ++j) {
			var neighbor = neighbors[j];
			if (neighbor.known) {
				ctx.moveTo( site.x, site.y );
				ctx.lineTo( neighbor.x, neighbor.y );
			}
		}
	}

	ctx.lineWidth = 10;
	ctx.stroke();

	for (var i = 0; i < allKnownSites.length; ++i) {
		var site = allKnownSites[i];
		ctx.beginPath();
		ctx.arc( site.x, site.y, 40, 0, Math.PI * 2 );
		ctx.fill();
	}
	ctx.restore();
}