class Route {
  waypoints
  minlat
  maxlat
  minlon
  maxlon
  distance //Total route distance
  doublingsup

  /**
   * Route passing through several nodes
   *
   * @param {Node} startnode
   * @param {Route} originalroute
   */
  constructor(startnode, originalroute) {
    if (originalroute == null) {
      // create a new route with just a node
      this.waypoints = []
      this.minlat = Infinity
      this.maxlat = 0
      this.minlon = Infinity
      this.maxlon = 0
      this.waypoints.push(startnode)
      this.distance = 0
      this.doublingsup = 0
    } else {
      // make a deep copy of a route
      this.waypoints = []
      for (let i = 0; i < originalroute.waypoints.length; i++) {
        this.waypoints.push(originalroute.waypoints[i])
      }
      this.minlat = originalroute.minlat
      this.maxlat = originalroute.maxlat
      this.minlon = originalroute.minlon
      this.maxlon = originalroute.maxlon
      this.distance = originalroute.distance
      this.doublingsup = originalroute.doublingsup
    }
  }

  addWaypoint(node, dist, doublingsup) {
    this.waypoints.push(node)
    this.distance += dist
    this.minlat = min(this.minlat, node.lat)
    this.maxlat = max(this.maxlat, node.lat)
    this.minlon = min(this.minlon, node.lon)
    this.maxlon = max(this.maxlon, node.lon)
    this.doublingsup += doublingsup
  }

  area() {
    // rough approximation of the area
    return (this.maxlat - this.minlat) * (this.maxlon - this.minlon)
  }

  show() {
    stroke(255, 255, 255, 55)
    strokeWeight(5)
    for (let i = 0; i < this.waypoints.length - 1; i++) {
      let from = createVector(this.waypoints[i].x, this.waypoints[i].y)
      let to = createVector(this.waypoints[i + 1].x, this.waypoints[i + 1].y)
      let vline = p5.Vector.sub(to, from)
      let hue = map(i, 0, this.waypoints.length - 1, 0, 155)
      stroke(hue, 255, 255, 0.5)
      line(from.x, from.y, to.x, to.y)
      if (showSteps) {
        fill(hue, 255, 55, 0.8)
        noStroke()
        textSize(8)
        let textangle = vline.heading() + HALF_PI
        text(
          i,
          10 * cos(textangle) + (from.x + to.x) / 2 - 5,
          10 * sin(textangle) + (from.y + to.y) / 2
        )
      }
    }
    noStroke()
    if (this.waypoints.length > 0) {
      fill(0, 255, 255, 0.8)
      ellipse(this.waypoints[0].x, this.waypoints[0].y, 20, 20) //show the first waypoint
    }
    fill(149, 255, 255, 0.8)
    ellipse(
      this.waypoints[bestroute.waypoints.length - 1].x,
      this.waypoints[bestroute.waypoints.length - 1].y,
      20,
      20
    ) //show the last waypoint
  }

  exportGPX() {
    let xmlDoc = document.implementation.createDocument(null, "gpx")
    let x = xmlDoc.getElementsByTagName("gpx")
    x[0].setAttribute(
      "xmlns:gpxtpx",
      "http://www.garmin.com/xmlschemas/TrackPointExtension/v1"
    )
    x[0].setAttribute("version", "1.1")
    x[0].setAttribute("xm1ns", "http://www.topografix.com/GPX/1/1") // for some weird reason the XML DOM won't add an attribute called exactly 'xmlns', so I'm fudging it and replacing it later.
    let trk = xmlDoc.createElement("trk")
    let trknumber = xmlDoc.createElement("type")
    trknumber.appendChild(xmlDoc.createTextNode("9"))
    trk.appendChild(trknumber)
    let trkseg = xmlDoc.createElement("trkseg")

    let now = new Date()

    for (let i = 0; i < this.waypoints.length; i++) {
      let trkpt = xmlDoc.createElement("trkpt")
      trkpt.setAttribute("lat", this.waypoints[i].lat)
      trkpt.setAttribute("lon", this.waypoints[i].lon)
      let ele = xmlDoc.createElement("ele")
      ele.appendChild(xmlDoc.createTextNode("2000"))
      trkpt.appendChild(ele)
      let timenode = xmlDoc.createElement("time")
      let fakedDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
        now.getHours(),
        now.getMinutes() + i
      ) // create a fake timestamp for the route by adding 1 min for each waypoint
      timenode.appendChild(xmlDoc.createTextNode(fakedDate.toISOString()))
      trkpt.appendChild(timenode)
      trkseg.appendChild(trkpt)
    }

    trk.appendChild(trkseg)
    xmlDoc.documentElement.appendChild(trk)

    var serializer = new XMLSerializer()
    let XMLString = serializer.serializeToString(xmlDoc)
    let XMLwriter = createWriter("route.gpx")
    XMLString = XMLString.replace("xm1ns", "xmlns") // for some weird reason the XML DOM won't add an attribute called exactly 'xmlns', so I'm fudging it.
    XMLwriter.write(XMLString)
    XMLwriter.close()
  }
}
