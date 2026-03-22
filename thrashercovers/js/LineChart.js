// Dynamically set margins, width, and height based on screen size
var fullWidth = window.innerWidth;
var isMobile = fullWidth < 768;

var svgWidth = isMobile ? 0.95 * fullWidth : 0.7 * fullWidth;
var margin5 = {
    top: 20,
    right: (isMobile ? 0.1 * fullWidth : (fullWidth - svgWidth) / 2 * 0.6),
    bottom: 50,
    left: (isMobile ? 0.1 * fullWidth : (fullWidth - svgWidth) / 2 * 1.1)
};

var width5 = svgWidth - margin5.left - margin5.right;
var height5 = Math.min(400, window.innerHeight / 2.5) - margin5.top - margin5.bottom;


var svg5 = d3.select("#linechart")
    .append("svg")
    .attr("width", fullWidth)
    .attr("height", height5 + margin5.top + margin5.bottom)
  .append("g")
    .attr("transform", "translate(" + margin5.left + "," + margin5.top + ")");

//Read the data
d3.csv("data/barplot.csv", function(data) {
  

  // Add X axis
  var x = d3.scaleLinear()
    .domain([d3.min([1981,2023]),d3.max([1981,2023])])
    .range([ 0, width5 ]);
  svg5.append("g")
    .attr("transform", "translate(0," + height5 + ")")
    .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")))

    ;
    

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 10])
    .range([ height5, 0]);
  svg5.append("g")
    .call(d3.axisLeft(y).ticks(7).tickFormat(d3.format("d")));

    // Function to calculate trendline
  function trendline(data) {
    var n = data.length;
    var xSum = 0, ySum = 0, xySum = 0, xxSum = 0;
    data.forEach(function(d) {
      xSum += +d.year;
      ySum += +d.value;
      xySum += +d.year * +d.value;
      xxSum += +d.year * +d.year;
    });
    var m = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum);
    var b = (ySum - m * xSum) / n;
    var trendlineData = [];
    data.forEach(function(d) {
      var trendlineY = m * +d.year + b;
      trendlineData.push({ year: +d.year, value: trendlineY });
    });
    return trendlineData;
  }

svg5.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "mediumseagreen")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(d.transition) })
        )
      .attr('pointer-events', 'visibleStroke')
      .on("mouseover", function(d) {
        d3.select(this).style("stroke-width", "6");
      })                  
      .on("mouseout", function(d) {
        d3.select(this).style("stroke-width", "3")   
      })

svg5.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(d.rail) })
        )
      .attr('stroke-width', '3')
      .attr('fill', 'none')
      .attr('pointer-events', 'visibleStroke')
      .on("mouseover", function(d) {
        d3.select(this).style("stroke-width", "6");
      })                  
      .on("mouseout", function(d) {
        d3.select(this).style("stroke-width", "3")   
      })

 svg5.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(d.ledge) })
        )
      .attr('stroke-width', '3')
      .attr('fill', 'none')
      .attr('pointer-events', 'visibleStroke')
      .on("mouseover", function(d) {
        d3.select(this).style("stroke-width", "6");
      })                  
      .on("mouseout", function(d) {
        d3.select(this).style("stroke-width", "3")   
      })

      // Plot trend lines
  var trendData = [
    { name: "transition", color: "mediumseagreen" },
    { name: "rail", color: "orange" },
    { name: "ledge", color: "red" },
    { name: "gapstairs", color: "steelblue" }
  ];

  trendData.forEach(function(datum) {
    var trendlineData = trendline(data.map(function(d) { return { year: d.year, value: d[datum.name] }; }));
    var trendlinePath = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.value); });
    svg5.append("path")
      .datum(trendlineData)
      .attr("fill", "none")
      .attr("stroke", datum.color)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "3,3")
      .attr("d", trendlinePath);
  });

  svg5.append("circle").attr("cx",(width5-90)).attr("cy",10).attr("r", 5).style("fill", "red")
svg5.append("circle").attr("cx",width5-90).attr("cy",30).attr("r", 5).style("fill", "steelblue")
svg5.append("circle").attr("cx",width5-90).attr("cy",50).attr("r", 5).style("fill", "orange")
svg5.append("circle").attr("cx",width5-90).attr("cy",70).attr("r", 5).style("fill", "mediumseagreen")

svg5.append("text").attr("x", width5-80).attr("y", 10).text("ledges/hubbas").style("font-size", "0.8rem").attr("alignment-baseline","middle")
svg5.append("text").attr("x", width5-80).attr("y", 30).text("stairs/gaps").style("font-size", "0.8rem").attr("alignment-baseline","middle")
svg5.append("text").attr("x", width5-80).attr("y", 50).text("handrails").style("font-size", "0.8rem").attr("alignment-baseline","middle")
svg5.append("text").attr("x", width5-80).attr("y", 70).text("transition").style("font-size", "0.8rem").attr("alignment-baseline","middle")
svg5.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(function(d) { return x(d.year) })
        .y(function(d) { return y(d.gapstairs) })
        )
      .attr('pointer-events', 'visibleStroke')
      .on("mouseover", function(d) {
        d3.select(this).style("stroke-width", "6");
      })                  
      .on("mouseout", function(d) {
        d3.select(this).style("stroke-width", "3")   
      })
})

var span = document.getElementsByClassName("close")[0];

var stairs = ['totalstairs', 'topstairs'];
 
var color = d3.scaleOrdinal()
     .domain(stairs)
     .range(['#e41a1c','#377eb8'])



     svg5.append("path")
       .datum(data)
       .attr("fill", "black")
       .attr("stroke", "black" )
       .attr("stroke-width", 4.5)
       .attr("d", d3.line()
        .x(function(d) { return d.year })
        .y(function(d) { return d.transition })
        )
 
