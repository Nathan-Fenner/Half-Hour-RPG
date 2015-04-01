function mapCenter(x, y) {
	mapcross.style.left = -(x << 0) + 320 + "px";
	mapcross.style.top = -(y << 0) + 150 + "px";
}
mapCenter(0,0); // Center on the origin to begin.


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

mapAddSite( "Town of Starting", 0, 0, false );