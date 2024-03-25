 /* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.8,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 50, left: 60, right: 60 }

/* LOAD DATA */
// Data source https://www.kaggle.com/datasets/azminetoushikwasi/aqi-air-quality-index-scheduled-daily-update
d3.csv('../data/World_AQI.csv', d => {
  return {
    date: new Date(d.Date),
    country: d.Country,
    aqi: +d['AQI Value']
  };
}).then(data => {
  console.log('data :>> ', data);

  // Filter data for "United States of America"
  const USAdata = data.filter(d => d.country === "United States of America");

  // SCALES
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.right, width - margin.left])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.aqi))
    .range([height - margin.bottom, margin.top])

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // BUILD AND CALL AXES
  const xAxis = d3.axisBottom(xScale)
    .ticks(5);

  const yAxis = d3.axisLeft(yScale)
    .ticks(5);

  const xAxisGroup = svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  const yAxisGroup = svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  // DRAW AREA
  const area = d3.area()
    .x(d => xScale(d.date))
    .y0(yScale(0))
    .y1(d => yScale(d.aqi));

  svg.append("path")
    .datum(USAdata)
    .attr("fill", "skyblue")
    .attr("opacity", 0.7)
    .attr("d", area);

});