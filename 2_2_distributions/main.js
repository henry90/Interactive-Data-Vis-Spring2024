/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 40, left: 40, right: 40 };

/* LOAD DATA */
d3.csv("../data/MoMA_distributions.csv", d3.autoType)
  .then(data => {
    data = data.filter(d => d['Artist Lifespan'] !== 1947); // Filter out the row with 'Artist Lifespan' value of 1947
    console.log(data);

    /* SCALES */
    // xScale for Length
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d['Length (cm)'])])
      .range([margin.left, width - margin.right]);

    // yScale for Width
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d['Width (cm)'])])
      .range([height - margin.bottom, margin.top]);

    // Scale size
    const maxLifespan = d3.max(data, d => d['Artist Lifespan']);
    const radiusScale = d3.scaleLinear()
      .domain([0, maxLifespan > 0 ? maxLifespan : 1]) // Some values in Artist Lifespan are 0
      .range([2, 8]); // Define the range of dot sizes

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(["Female", "Male", ""])
      .range(["pink", "blue", "grey"]); // Assigning grey for missing values

    /* HTML ELEMENTS */
    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // xaxis
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    // yaxis
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    // Draw circles
    svg.selectAll(".circle")
      .data(data.filter(d => d.Gender !== ""))
      .join("circle")
      .attr("class", "circle")
      .attr("cx", d => xScale(d['Length (cm)']))
      .attr("cy", d => yScale(d['Width (cm)']))
      .attr("r", d => radiusScale(d['Artist Lifespan'] > 0 ? d['Artist Lifespan'] : 1)) // For some reason, All 'Male' has radious of 0 in browser, so I set the minimun radius of 1.
      .attr("fill", d => colorScale(d.Gender)) // Color based on gender
      .attr("opacity", 0.7); // The dots overlaps to each other, make it better for visualization
  });
