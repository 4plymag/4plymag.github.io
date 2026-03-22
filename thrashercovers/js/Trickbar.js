// Dynamically set margins, width, and height based on screen size
var fullWidth = window.innerWidth;
var isMobile = fullWidth < 768;

var svgWidth = isMobile ? 1 * fullWidth : 0.7 * fullWidth;
var barMargin = {
    top: 20,
    right: (isMobile ? 0.25 * fullWidth : (fullWidth - svgWidth) / 2 * 0.8),
    bottom: 25,
    left: (isMobile ? 0.01 * fullWidth : (fullWidth - svgWidth) / 2 * 0.5)
};

var barWidth = svgWidth - barMargin.left - barMargin.right;
var barHeight = Math.min(400, window.innerHeight / 1.6) - barMargin.top - barMargin.bottom;


// Append the svg object to the body of the page
var svg = d3.select("#my_datavis")
  .append("svg")
  .attr("width", barWidth + barMargin.left + barMargin.right)
  .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .append("g")
  .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

// Function to update chart with data from a specified CSV file
function updateChart(dataset) {
  console.log("Loading dataset:", dataset);

  // Load data from the specified CSV file
  d3.csv("data/" + dataset + ".csv", function(error, data) {
    if (error) {
      console.error("Error loading data:", error);
      return;
    }

    // Clear previous chart
    svg.selectAll("*").remove();

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.count; })])
      .range([0, barWidth]);

    var xAxis = d3.axisBottom(x).tickSize(0);
    svg.append("g")
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + barHeight + ')')
      .call(xAxis);

// Y axis
var y = d3.scaleBand()
  .range([0, barHeight])
  .domain(data.map(function(d) { return d.trick; }));

// Define fill color based on dataset
var fillcolor;
if (dataset === "toptricks") {
  fillcolor = "lightcoral";   // Light red
} else if (dataset === "topspots") {
  fillcolor = "lightblue";    // Light blue
} else if (dataset === "topobstacles") {
  fillcolor = "lightgreen";   // Light green
} else if (dataset === "topskaters") {
  fillcolor = "lightsalmon";  // Light orange
} else {
  fillcolor = "lightgray";    // Default color
}

// Bars
svg.selectAll("rect")
  .data(data)
  .enter().append("rect")
  .attr("x", 0)
  .attr("y", function(d) { return y(d.trick); })
  .attr("width", function(d) { return x(d.count); })
  .attr("height", y.bandwidth())
  .attr('fill', fillcolor)
  .style('stroke', 'black')
  .style('stroke-width', 1.5);


// Y axis with adjusted label alignment
svg.append("g")
  .attr('class', 'y-axis')
  .call(d3.axisLeft(y).tickSize(0)) // Remove tick marks
  .selectAll("text")
  .attr("x", -5) // Adjust the x position to the left of the bars
  .attr("dx", "0.7em") // Move the labels further left
  .style("text-anchor", "start") // Align the text to the start (left) of the labels
  .style('font-size', '.7rem')
  .style("padding", "2px") // Add padding to the text to make the border visible
  .style("color", "black") // Set text color to black
  .style("text-shadow", "1px 1px 1px rgba(255,255,255,1)") // Add white text shadow
  .style("font-weight", "bold"); // Make the text bold



    // Add title
    updateChartTitle(dataset);

    // // Add x-axis label
    // svg.append("text")
    //   .attr('x', (barWidth - barMargin.left) / 2)
    //   .attr('y', barHeight + barMargin.top + 40)
    //   .style('font-family', "Bungee")
    //   .style('font-size', '0.8rem')
    //   .text("Frequency");

    // Show corresponding chart description div based on the selected dataset
    showChartDescription(dataset);
  });
}

// Function to update chart title
function updateChartTitle(dataset) {
  var chartTitle = dataset.charAt(3).toUpperCase() + dataset.slice(4); // Capitalize first letter
  document.getElementById("chartTitle").innerText = "Top " + chartTitle;
}


// Function to show corresponding chart description div based on the selected dataset
function showChartDescription(dataset) {
  var chartDescriptions = ["trickchart", "spotchart", "skaterschart", "obstaclechart"];
  for (var i = 0; i < chartDescriptions.length; i++) {
    var chartDescription = chartDescriptions[i];
    if (dataset.includes(chartDescription.replace("chart", ""))) {
      document.getElementsByClassName(chartDescription)[0].style.display = "block";
    } else {
      document.getElementsByClassName(chartDescription)[0].style.display = "none";
    }
  }
}

// Call updateChart initially to display default data
updateChart('toptricks');

// Function to be called when the "Tricks" button is clicked
function updateTopTricks() {
  updateChart('toptricks');
}

// Function to be called when the "Spots" button is clicked
function updateTopSpots() {
  updateChart('topspots');
}

// Function to be called when the "Skaters" button is clicked
function updateTopSkaters() {
  updateChart('topskaters');
}

// Function to be called when the "Obstacles" button is clicked
function updateTopObstacles() {
  updateChart('topobstacles');
}
