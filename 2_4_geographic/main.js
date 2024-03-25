/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  artist = "#87ceeb"; // Color for countries with artists

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/world.json"),
  d3.csv("../data/MoMA_nationalities.csv", d3.autoType),
]).then(([geojson, nationalities]) => {
  console.log(geojson)
  console.log(nationalities)

  const svg = d3 
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // SPECIFY PROJECTION
  const projection = d3.geoEqualEarth()
    .fitSize([width, height], geojson);

  // DEFINE PATH FUNCTION
  const geoPathGen = d3.geoPath(projection);

  // Set of countries with artists
  const countriesWithArtists = new Set(nationalities.map(d => d.Country));

  // APPEND GEOJSON PATH  
  svg.selectAll(".country")
    .data(geojson.features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("stroke", "black")
    .attr("fill", d => countriesWithArtists.has(d.properties.name) ? artist : "none")
    .attr("d", geoPathGen);
});
