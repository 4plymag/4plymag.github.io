// set the dimensions and margins of the graph
const barMargin = {top: 50, right: 10, bottom: 50, left: 220},
    barWidth = 800 - barMargin.left - barMargin.right,
    barHeight = 500 - barMargin.top - barMargin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${(barWidth + barMargin.left + barMargin.right)}
    ${(barHeight + barMargin.top + barMargin.bottom)}`)
  .append("g")
    .attr("transform",
          "translate(" + barMargin.left + "," + barMargin.top + ")");

// Parse the Data
d3.csv("data/top_tricks.csv", function(data) {

  // Add X axis
  let x = d3.scaleLinear()
    .domain([0, 10])
    .range([ 0, barWidth]);

  let xAxis = d3.axisBottom(x).tickSize(0);
  svg.append("g")
    .attr('class', 'x-axis')
    .attr("transform", "translate(0," + barHeight + ")")
    .call(xAxis);

  // Y axis
  let y = d3.scaleBand()
    .range([ 0, barHeight])
    .domain(data.map(function(d) { return d.trick; }))
    .padding(.4);

  svg.append("g")
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y))
    .style('font-size', '.82rem')

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.trick); })
    .attr("width", function(d) { return x(d.count); })
    .attr("height", y.bandwidth() )
    .attr('fill', "teal")
    .style('stroke', 'teal')
    .style('stroke-width', 7)

})

// add title — left-aligned
d3.select('#my_dataviz svg')
  .append('text')
  .attr('x', barMargin.left)
  .attr('y', 20)
  .text("Koston Has No 'Standout' Trick")
  .style('font-family', "Bungee")
  .style('font-size', '1.1rem')

// add subtitle
d3.select('#my_dataviz svg')
  .append('text')
  .attr('x', barMargin.left)
  .attr('y', 38)
  .text("Most-performed tricks across all video parts")
  .style('font-family', "Bungee")
  .style('font-size', '.55rem')
  .style('fill', '#888')

// add x-axis label
d3.select('#my_dataviz svg')
  .append("text")
  .attr('x', (barWidth + barMargin.right + barMargin.left) / 2)
  .attr('y', barHeight + barMargin.top + 40)
  .style("text-anchor", "middle")
  .style('font-family', "Bungee")
  .style('font-size', '.6rem')
  .text("Count Across All Video Parts");
