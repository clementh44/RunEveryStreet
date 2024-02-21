class Node {
	constructor(nodeId_, lat_, lon_) {
		this.nodeId = nodeId_;
		this.lat = lat_;
		this.lon = lon_;
		this.pos = createVector(1, 1);
		this.x = map(this.lon, mapminlon, mapmaxlon, polygonminX, polygonmaxX);
		this.y = map(this.lat, mapminlat, mapmaxlat, polygonmaxY, polygonminY);
	}

	show() {
		noStroke();
		colorMode(HSB);
		fill(0, 255, 255, 100);
		ellipse(this.x, this.y, 2);
	}

	highlight() {
		noStroke();
		colorMode(HSB);
		fill(0, 255, 255, 0.5);
		ellipse(this.x, this.y, 15);
	}
}