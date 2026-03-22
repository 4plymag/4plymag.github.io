// Dynamically set margins, width, and height based on screen size
var fullWidth = window.innerWidth;
var isMobile = window.innerWidth < 768;

var svgWidth = isMobile ? 0.95 * fullWidth : 0.7 * fullWidth;
var margin1 = {
    top: 20,
    right: (isMobile ? 0.1 * fullWidth : (fullWidth - svgWidth) / 2 * 0.6),
    bottom: 50,
    left: (isMobile ? 0.1 * fullWidth : (fullWidth - svgWidth) / 2 * 1.1)
};

var width1 = svgWidth - margin1.left - margin1.right;
var height1 = Math.min(400, window.innerHeight / 2) - margin1.top - margin1.bottom;

// Append the SVG object to the body of the page
var svg1 = d3.select("#stairchart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");



//Read the data
d3.csv("data/coverstairs.csv", function(data) {
    d3.csv("data/railstairs.csv", function(data2) {
        d3.csv("data/stairstairs.csv", function(data3) {
            d3.csv("data/ledgestairs.csv", function(data4) {

                // Add X axis
                var x = d3.scaleLinear()
                    .domain([d3.min([1988, 2023]), d3.max([1988, 2023])])
                    .range([0, width1]);
                svg1.append("g")
                    .attr("transform", "translate(0," + height1 + ")")
                    .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));

                // Add Y axis
                var y = d3.scaleLinear()
                    .domain([0, 60])
                    .range([height1, 0]);
                svg1.append("g")
                    .call(d3.axisLeft(y).ticks(7).tickFormat(d3.format("d")));

                // Define a function to calculate trendline data
                function calculateTrendline(data) {
                    var xSeries = data.map(function(d) { return +d.year; });
                    var ySeries = data.map(function(d) { return +d.staircount; });
                    var leastSquaresCoeff = leastSquares(xSeries, ySeries);
                    var x1 = d3.min(xSeries);
                    var y1 = leastSquaresCoeff[0] * x1 + leastSquaresCoeff[1];
                    var x2 = d3.max(xSeries);
                    var y2 = leastSquaresCoeff[0] * x2 + leastSquaresCoeff[1];
                    return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
                }

                // Define a function to calculate least squares
                function leastSquares(xSeries, ySeries) {
                    var reduceSumFunc = function(prev, cur) { return prev + cur; };

                    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
                    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

                    var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
                        .reduce(reduceSumFunc);

                    var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
                        .reduce(reduceSumFunc);

                    var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
                        .reduce(reduceSumFunc);

                    var slope = ssXY / ssXX;
                    var intercept = yBar - (xBar * slope);
                    return [slope, intercept];
                }

                // Add trendlines for each dataset
                var trendlineData1 = calculateTrendline(data4);
                svg1.append("line")
                    .attr("x1", x(trendlineData1[0].x))
                    .attr("y1", y(trendlineData1[0].y))
                    .attr("x2", x(trendlineData1[1].x))
                    .attr("y2", y(trendlineData1[1].y))
                    .attr("stroke", "red")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", "5,5");

                var trendlineData2 = calculateTrendline(data2);
                svg1.append("line")
                    .attr("x1", x(trendlineData2[0].x))
                    .attr("y1", y(trendlineData2[0].y))
                    .attr("x2", x(trendlineData2[1].x))
                    .attr("y2", y(trendlineData2[1].y))
                    .attr("stroke", "orange")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", "5,5");

                var trendlineData3 = calculateTrendline(data3);
                svg1.append("line")
                    .attr("x1", x(trendlineData3[0].x))
                    .attr("y1", y(trendlineData3[0].y))
                    .attr("x2", x(trendlineData3[1].x))
                    .attr("y2", y(trendlineData3[1].y))
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", "5,5");


                svg1.append("path")
                    .datum(data4)
                    .attr("fill", "none")
                    .attr("stroke", "red")
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function(d) { return x(d.year) })
                        .y(function(d) { return y(d.staircount) })
                    )
                    .attr('pointer-events', 'visibleStroke')


                svg1.append("path")
                    .datum(data2)
                    .attr("fill", "none")
                    .attr("stroke", "orange")
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function(d) { return x(d.year) })
                        .y(function(d) { return y(d.staircount) })
                    )
                    .attr('stroke-width', '3')
                    .attr('fill', 'none')
                    .attr('pointer-events', 'visibleStroke')

                svg1.append("circle").attr("cx", (width1 - 90)).attr("cy", 10).attr("r", 5).style("fill", "red")
                svg1.append("circle").attr("cx", width1 - 90).attr("cy", 30).attr("r", 5).style("fill", "steelblue")
                svg1.append("circle").attr("cx", width1 - 90).attr("cy", 50).attr("r", 5).style("fill", "orange")
                svg1.append("text").attr("x", width1 - 80).attr("y", 10).text("hubbas/out ledges").style("font-size", "0.8rem").attr("alignment-baseline", "middle")
                svg1.append("text").attr("x", width1 - 80).attr("y", 30).text("stairs/gaps").style("font-size", "0.8rem").attr("alignment-baseline", "middle")
                svg1.append("text").attr("x", width1 - 80).attr("y", 50).text("handrails").style("font-size", "0.8rem").attr("alignment-baseline", "middle")

                svg1.append("path")
                    .datum(data3)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 3)
                    .attr("d", d3.line()
                        .x(function(d) { return x(d.year) })
                        .y(function(d) { return y(d.staircount) })
                    )
                    .attr('pointer-events', 'visibleStroke')

                svg1.append('g')
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) { return x(d.year); })
                    .attr("cy", function(d) { return y(d.topstairs); })
                    .attr("r", 0)
                    // .style("fill", "black")

                    .on('mouseover', function(d, i) {
                        d3.select(this).transition()
                            .duration('100')
                            .attr("r", 6);
                        tooltip2

                            .style("opacity", 1)
                            .transition(100)
                    })


                    .on('mousemove', function(d, i) {

                        tooltip2
                            // .transition()
                            // .duration(100)
                            .html("<img class='tooltipcover' src='covers/" +
                                d.month + d.year + ".jpg'></img><br><br>" +
                                d.skater + ", " + d.month + " " + d.year +
                                " - " + d.staircount + "stairs")
                            // .style("pointer-events", "none")
                            .style("left", (d3.mouse(this)[0] + 50) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                            .style("bottom", (d3.mouse(this)[1] / 2) + "px")
                    })



                    .on('click', function(d, i) {
                        tooltip2
                            .style("opacity", "0")

                        popup
                            .style("width", "auto")
                            .style("height", "auto")
                            .style("max-height", "80%")
                            .style("opacity", 1)
                            .html("<img class='popupcover' src='covers/" +
                                d.month + d.year + ".jpg'></img><br><br>" + d.skater + ", " + d.month + ", " + d.year +
                                " - " + d.staircount + "stairs")

                            .style("left", "0") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                            .style("top", "-10%")
                            .style("right", "0")
                            .style("margin", "5%, auto")
                            .style("z-index", "1");

                    })


                    .on('mouseleave', function(d, i) {
                        d3.select(this).transition()
                            .duration('100')
                            .attr("r", 3);
                        tooltip2
                            .transition()
                            .duration(200)
                            .style("opacity", 0)

                    })

                svg1.append('g')
                    .selectAll("dot")
                    .data(data2)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) { return x(d.year); })
                    .attr("cy", function(d) { return y(d.staircount); })
                    .attr("r", 4)
                    .style("fill", "orange")
                    .style("stroke", "black")

                    .on('mouseover', function(d, i) {
                        d3.select(this).transition()
                            .duration('100')
                            .attr("r", 6);
                        tooltip2

                            .style("opacity", 1)
                            .transition(100)
                    })


                    .on('mousemove', function(d, i) {

                        tooltip2
                            // .transition()
                            // .duration(100)
                            .html("<img class='tooltipcover' src='covers/" +
                                d.month + d.year + ".jpg'></img><br><br>" +
                                d.skater + ", " + d.month + " " + d.year)
                            // .style("pointer-events", "none")
                            .style("left", (d3.mouse(this)[0] + 50) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                            .style("bottom", (d3.mouse(this)[1] / 2) + "px")
                    })

                    .on('click', function(d, i) {
                        tooltip2
                            .style("opacity", "0")

                        popup
                            .style("width", "auto")
                            .style("height", "auto")
                            .style("max-height", "80%")
                            .style("opacity", 1)
                            .html("<img class='popupcover' src='covers/" +
                                d.month + d.year + ".jpg'><br></img>" + d.skater + ", " + d.month + ", " + d.year)

                            .style("left", "0") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                            // .style("top", "-10%")
                            .style("right", "0")
                            .style("margin", "5%, auto")
                            .style("z-index", "1");
                    })


                    .on('mouseleave', function(d, i) {
                        d3.select(this).transition()
                            .duration('100')
                            .attr("r", 3);
                        tooltip2
                            .transition()
                            .duration(200)
                            .style("opacity", 0)

                    })

                svg1.append('g')
                    .selectAll("dot")
                    .data(data3)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) { return x(d.year); })
                    .attr("cy", function(d) { return y(d.staircount); })
                    .attr("r", 4)
                    .style("fill", "steelblue")
                    .style("stroke", "black")

                    .on('mouseover', function(d, i) {
                        d3.select(this).transition()
                            .duration('100')
                            .attr("r", 6);
                        tooltip2

                            .style("opacity", 1)
                            .transition(100)
                    })


                    .on('mousemove', function(d, i) {

                        tooltip2
                            .html("<img class='tooltipcover' src='covers/" +
                                d.month + d.year + ".jpg'></img><br>" +
                                d.skater + ", " + d.month + " " + d.year)
                            // .style("pointer-events", "none")
                            .style("left", (d3.mouse(this)[0] + 50) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                            .style("bottom", (d3.mouse(this)[1] / 2) + "px")
                    })



                    .on('click', function(d, i) {
                        tooltip2
                            .style("opacity", "0")

                        popup
                            .style("width", "auto")
                            .style("height", "auto")
                            .style("max-height", "80%")
                            .style("opacity", 1)
                            .html("<img class='popupcover' src='covers/" +
                                d.month + d.year + ".jpg'></img><br>" + d.skater + ", " + d.month + ", " + d.year)

                            .style("left", "0") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                            // .style("top", "-10%")
                            .style("right", "0")
                            .style("margin", "5%, auto")
                            .style("z-index", "1");
                    })


                    .on('mouseleave', function(d, i) {
                        d3.select(this).transition()
                            .duration('100')
                            .attr("r", 3);
                        tooltip2
                            .transition()
                            .duration(200)
                            .style("opacity", 0)

                    })

                svg1.append('g')
                    .selectAll("dot")
                    .data(data4)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) { return x(d.year); })
                    .attr("cy", function(d) { return y(d.staircount); })
                    .attr("r", 4)
                    .style("fill", "red")
                    .style("stroke", "black")

                    .on('mouseover', function(d, i) {
                        d3.select(this).transition()
                            .duration('100')
                            .attr("r", 7);
                        tooltip2

                            .style("opacity", 1)
                            .transition(100)
                    })

                    .on('mousemove', function(d, i) {
                        tooltip2
                            .html("<img class='tooltipcover' src='covers/" +
                                d.month + d.year + ".jpg'></img><br><br>" +
                                d.skater + ", " + d.month + " " + d.year)
                            // .style("pointer-events", "none")
                            .style("left", (d3.mouse(this)[0] + 50) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                            .style("bottom", (d3.mouse(this)[1] / 2) + "px")
                    })

                    .on('click', function(d, i) {

                        tooltip2
                            .style("opacity", "0")

                        popup
                            .style("width", "auto")
                            .style("height", "auto")
                            .style("max-height", "80%")
                            .style("opacity", 1)
                            .html("<img class='popupcover' src='covers/" +
                                d.month + d.year + ".jpg'></img><br>" + d.skater + ", " + d.month + ", " + d.year)

                            .style("left", "0") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                            // .style("top", "-10%")
                            .style("right", "0")
                            .style("margin", "5%, auto")
                            .style("z-index", "1");

                    })


                    .on('mouseleave', function(d, i) {
                        d3.select(this).transition()
                            .duration('100')
                            .attr("r", 3);
                        tooltip2
                            .transition()
                            .duration(200)
                            .style("opacity", 0)

                    })

                var tooltip2 = d3.select("#stairchart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip2")
    .style("display", "inline-block")
    .style("background-color", "rgba(255, 255, 255, 0.9)")
    .style("max-width", "25%")
    .style("position", "fixed")
    .style("pointer-events", "none")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "3px")
    .style("padding", "15px")
    .style("text-transform", "capitalize");

tooltip2.append("img")
    .attr("class", "tooltipcover")
    .style("display", "block")
    .style("margin", "auto")
    /* Add any additional styling for the image as needed */;


                var span = document.getElementsByClassName("close")[0];

                var stairs = ['totalstairs', 'topstairs'];

                var color = d3.scaleOrdinal()
                    .domain(stairs)
                    .range(['#e41a1c', '#377eb8'])


                for (var i = 0; i < stairs.length; i++) {
                    svg1.append("path")
                        .datum(data)
                        .attr("fill", "black")
                        .attr("stroke", function(d) { return color(stairs[i]) })
                        .attr("stroke-width", 4.5)
                        .attr("d", d3.line()
                            .x(function(d) { return d.year })
                            .y(function(d) { return d[stairs[i]] })
                        )
                }





                    var popup = d3.select("#stairchart")
    .append("div")
    .style("opacity", "0")
    .attr("class", "popup desktop-popup") // Added "desktop-popup" class
    .style("display", "inline-block")
    .style("background-color", "rgba(255, 255, 255, 0.9)")
    .style("width", "0%")
    .style("height", "0%")
    .style("margin", "10% auto")
    .style("left", "0")
    .style("position", "fixed")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "4px")
    .style("padding", "10px")
    .style("z-index", "0")
    .style("text-transform", "capitalize")

                    .on('click', function(d, i) {

                        popup
                            .style("opacity", "0")
                            .style("width", "0%")
                            .style("height", "0%");

                    })
            })
        })
    })
})