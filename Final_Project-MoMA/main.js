document.addEventListener('DOMContentLoaded', function() {
  const width = 1000;
  const height = 800;
  const margin = {top: 20, right: 30, bottom: 40, left: 80};
  
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  const tooltip = d3.select(".tooltip");
  
  // Message for no data for the current decade
  // const noDataMessage = svg.append("text")
  //   .attr("class", "no-data-message")
  //   .attr("x", width / 2)
  //   .attr("y", height / 2)
  //   .attr("text-anchor", "middle")
  //   .attr("dy", ".35em")
  //   .style("font-size", "24px")
  //   .style("fill", "rgb(119, 215, 255)")
  //   .style("display", "none")
  //   .text("This decade has no data, please slide to different decades.");

  d3.json("../data/top_10_materials.json").then(data => {
    console.log(data);

    // Extract departments
    let departments = new Set();
    for (let decade in data) {
      for (let dept in data[decade]) {
        departments.add(dept);
      }
    }

    departments = Array.from(departments).sort();
    console.log("Departments:", departments);

    // Dropdown menu
    const dropdown = d3.select("#department");
    dropdown.selectAll("option")
      .data(departments)
      .enter()
      .append("option")
      .text(d => d)
      .attr("value", d => d);

    // Decade slider
    const slider = d3.select("#decade-slider");
    const sliderValue = d3.select("#decade-value");

    slider.on("input", function() {
      sliderValue.text(this.value);
      updateChart(this.value, dropdown.property("value"));
    });

    dropdown.on("change", function() {
      updateChart(slider.property("value"), this.value);
    });

    updateChart(slider.property("value"), dropdown.property("value"));

    function updateChart(decade, department) {
      const materialsData = data[decade][department];
      console.log(materialsData);

      // Filter out unwanted materials
      //const filteredData = materialsData.filter(d => d.Materials !== 'Artist' && d.Materials !== 'nan');

      svg.selectAll("*").remove();

      // Remove chart elements if no data
      // if (!materialsData || materialsData.length === 0) {
      //   svg.selectAll(".bar").remove();
      //   svg.selectAll(".x-axis text").remove();
      //   svg.selectAll(".y-axis text").remove();
      //   const noDataMessage = svg.select(".no-data-message");
      //   noDataMessage.style("display", "block");
      //   return;
      // } else {
      //   noDataMessage.style("display", "none");
      // }

      const x = d3.scaleLinear()
        .domain([0, d3.max(materialsData, d => d.Count)])
        .range([0, width]);

      const y = d3.scaleBand()
        .domain(materialsData.map(d => d.Materials))
        .range([0, height])
        .padding(0.1);

      svg.append("g")
        .call(d3.axisLeft(y));

      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

      svg.selectAll(".bar")
        .data(materialsData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => y(d.Materials))
        .attr("width", d => x(d.Count))
        .attr("height", y.bandwidth())
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1);
            tooltip.html(`${d.Materials}: ${d.Count}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          tooltip.style("opacity", 0);
        });
    }
  }).catch(error => {
      console.error('Error loading or parsing data:', error);
  });
});
