# Run Every Street

Or "**Let's go everyway !**"
Live site here : [https://clementh44.github.io/RunEveryStreet/](https://clementh44.github.io/RunEveryStreet/)

This repo is a tweaked fork from [Solipsia's RunEveryStreet](https://github.com/solipsia/RunEveryStreet).

The rationale behind it is to use for street imagery where one use a road vehicle (car, bicycle, moped,…) to take pictures from streets in an efficient manner. As such, sidewalks would add unnecessary overlaps.

To run :
npm install
npm run start

<p align="center">
  <img width="460" src="./docs/Square.png">
</p>
<p align="center">
  <img width="460" src="./docs/DownloadRoute.png">
</p>

This is an attempt at solving the [Chinese Postman Problem](https://en.wikipedia.org/wiki/Route_inspection_problem) by calculating the shortest route that covers all possible roads at least once within a selected town.

The tool pulls map data from OpenStreetMap, converts it into a mathematical model (a Graph Database) consisting of nodes and edges, then applies an algorithm that produces a route. The algorithm calculates a large number of routes stochastically and keeps the best one in memory until the user stop the script. The final route can be downloaded as a GPX file to a Garmin or other GPS.

## How it works

1. When the website is loaded, it pulls the background map tileset from OpenStreetMap via the [OpenLayers API](https://openlayers.org/en/latest/apidoc/)
2. The user zooms and pans to select the area to analyse
3. The map data is then downloaded in XML via the OpenStreetMap [Overpass API](http://overpass-turbo.eu/)
4. Road segments, junctions and intersections are loaded into a data constellation of nodes (intersections) connected by edges (roads).
5. This is then drawn on the screen using the [p5.js](https://p5js.org) framework.
6. The user clicks on a node to select the starting point and clicks on roads to remove them from the graph in order to trim the coverage area. Any orphaned nodes or islands that cannot be reached from the starting point are then removed using a [Flood Fill algorithm](https://en.wikipedia.org/wiki/Flood_fill).
8. The route-finding algorithm then calculates a large number of possible routes from the starting node:
	1. Create a list of all connected edges (roads) emanating from the current node
	2. Sort these by the number of times each edge has been traveled and pick the one with least travels
	3. If there is a tie with multiple edges with the same lowest number of travels, pick one randomly.
	4. Travel down the selected edge
	5. Repeat until all edges have been traveled at least once.
	6. At this point the route is complete and is drawn on the map, coloured from red at the start to green at the finish.
	9. Keep repeating above to create a large set of possible solutions until the user stops the process.
	10. Pick the shortest route of all those created and export it to GPX file for download

The original live website can be accessed here: https://solipsia.github.io/RunEveryStreet/

## TODO
- [x] pouvoir sélectionner une zone pour l'import
- [x] prendre en charge les sens uniques
- [ ] mettre à jour les captures d'écrans
- [x] mettre en place un site live
- [ ] ajouter une légende sur les couleurs lors du calcul du meilleur itinéraire
- [ ] modification du filtre des données (mode car, walk, bicycle)
- [ ] prendre en compte les interdictions de tourner
- [ ] pouvoir annuler une suppression de chemin
- [ ] revoir l’algo de recherche du meilleur chemin (problème du postier chinois)
- [ ] importer les chemins parcourus avec Panoramax
- [x] revoir la gestion des boutons et cliques
- [ ] ajouter la possibilité de zoomer lors de la suppression des chemins
- [ ] pouvoir simplifier les chemins en supprimant les noeuds superflus
- [ ] afficher différement les chemins en fonction de leur type (route, piste cyclable, chemin etc...)
- [ ] ajouter une traduction en/fr
- [ ] voir s'il est possible de modifier le polygone après coup
- [ ] ajouter un avertissement en cas de zone très grande
