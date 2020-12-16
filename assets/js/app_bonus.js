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
var svg = d3.select("#scatter").append("svg").attr("width", svgWidth).attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// -----------------------

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
    d3.max(censusData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
        d3.max(censusData, d => d[chosenYAxis]) * 1.2])
      .range([height, 0]);
  
    return yLinearScale;
}
// -----------------------

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;

    if (chosenXAxis === "poverty") {
        xlabel = "Poverty: ";
    }
    else if (chosenXAxis === "age") {
        xlabel = "Age: ";
    }
    else {
        xlabel = "Income: ";
    }

    var ylabel;

    if (chosenYAxis === "healthcare") {
        ylabel = "Healthcare: ";
    }
    else if (chosenYAxis === "obesity") {
        ylabel = "Obesity: ";
    }
    else {
        ylabel = "Smokes: ";
    }    

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]} <br> ${ylabel} ${d[chosenYAxis]}`);
    });
  console.log(toolTip)  
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// -----------------------

// function used for updating xAxis var upon click on axis label
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis var upon click on axis label
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// -----------------------

// function used for updating circles group
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  
  return circlesGroup;
}

// -----------------------

// function used for updating state labels with transition
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  
    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
  
    return textGroup;
}
// --------------------------------------------------------------

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(censusData) {
  
  console.log(censusData)

  // parse data
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.income = +data.income;
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // LinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.chosenYAxis))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".5")
    .attr("alignment-baseline", "central");

  //append initial text
  var textGroup = chartGroup.selectAll("text")
    .data(censusData)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))
    // .attr("dy", 3)
    .attr("font-size", "10px")
    .text(d => d.abbr);  

  // -----------------------

  // Create groups for x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  // Create X Axis Labels
  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income");
    
  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");

  // Create group for Y Axis Labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${0 - margin.left/4}, ${height/2})`);

  // Create Y Axis Labels
  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", 0 - 20)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Healthcare");

  var obesityLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", 0 - 40)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesity");
    
  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", 0 - 60)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes");

  // -----------------------


  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel.classed("active", true).classed("inactive", false);
          incomeLabel.classed("active", false).classed("inactive", true);
          ageLabel.classed("active", false).classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
          incomeLabel.classed("active", false).classed("inactive", true);
          ageLabel.classed("active", true).classed("inactive", false);
          povertyLabel.classed("active", true).classed("inactive", false);
        }
        else {
          ageLabel.classed("active", false).classed("inactive", true);
          povertyLabel.classed("active", true).classed("inactive", false);
          incomeLabel.classed("active", true).classed("inactive", false);
        }   

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel.classed("active", true).classed("inactive", false);
          obesityLabel.classed("active", false).classed("inactive", true);
          smokesLabel.classed("active", false).classed("inactive", true);
        }
        else if (chosenYAxis === "obesity") {
          obesityLabel.classed("active", false).classed("inactive", true);
          smokesLabel.classed("active", true).classed("inactive", false);
          healthcareLabel.classed("active", true).classed("inactive", false);
        }
        else {
          smokesLabel.classed("active", false).classed("inactive", true);
          healthcareLabel.classed("active", true).classed("inactive", false);
          obesityLabel.classed("active", true).classed("inactive", false);
        }     

      }
    });

}).catch(function(error) {
  console.log(error);
});





