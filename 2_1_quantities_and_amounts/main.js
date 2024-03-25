/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8;
const height = 800;
const margin = 60;
const barColor = d3.scaleOrdinal(d3.schemeCategory10); // Color scale

/* LOAD DATA */
d3.csv('../data/MoMA_topTenNationalities.csv', d3.autoType)
  .then(data => {
    console.log("data", data);

    /* SCALES */
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Count)])
      .range([margin, width - margin]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.Nationality))
      .range([margin, height - margin])
      .paddingInner(0.1)
      .paddingOuter(0.2);

    /* HTML ELEMENTS */
    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Append x axis
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
      .attr("transform", `translate(0,${height - margin})`)
      .call(xAxis);

    // Append y axis
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
      .attr("transform", `translate(${margin},0)`)
      .call(yAxis);

    // Append bars
    svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("width", d => xScale(d.Count) - margin)
      .attr("height", yScale.bandwidth())
      .attr("x", margin)
      .attr("y", d => yScale(d.Nationality))
      .attr("fill", d => barColor(d.Nationality));

    // Append labels
    svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.Count) + 5) // Add padding to the bars
      .attr("y", d => yScale(d.Nationality) + yScale.bandwidth() / 1.8) // Roughly centered, but OCD pixel-perfect inside of me is screaming
      .text(d => d.Count)
      
    
    
  })

