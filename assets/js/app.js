var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// -----------------------

// Retrieve data from the CSV file and execute functions below
d3.csv("./assets/data/data.csv").then(function(censusData) {
  
  console.log(censusData)

  // parse data
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.state = +data.state;
    data.id = +data.id;
    });

  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(censusData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([3, d3.max(censusData, d => d.healthcare)])
    .range([height, 0]);
  
  // Create initial axes and append
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);

// -----------------------

  // create initial circles
  chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".5")
    // .attr("alignment-baseline", "central");

  // create circle text
  chartGroup.selectAll("null")
    .data(censusData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.healthcare))
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("fill", "white");

  // -----------------------

  // Create X Axis Labels
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty");

  // Create group for Y Axis Labels
  chartGroup.append("text")
    // .attr("transform", `translate(${0 - margin.left + 40}, ${height/2})`)
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - height/2)
    .attr("y", 0 - 40)
    .attr("value", "healthcare")
    .classed("active", true)
    .text("Lacks Healthcare");


  // -----------------------

}).catch(function(error) {
  console.log(error);
});

