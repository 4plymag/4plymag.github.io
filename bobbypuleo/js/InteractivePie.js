function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
}
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var width = screenWidth;
var height = (screenWidth > screenHeight) ? 0.8 * screenHeight : screenWidth;
var radius = Math.min(width, height) / 2;
var svg2 = d3.select("#pieChart svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")

var arc = d3.arc()
    .outerRadius((screenWidth > screenHeight) ? radius * 0.7 : radius * 0.6)
    .innerRadius(0)

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.value; });
var data =
    d3.csv("obstime.csv", function(loadedData) {
        document.getElementById("stance").addEventListener("click", function() {
            var filteredData = data.filter(function(d) {
                return ["r", "s", "n", "f"].indexOf(d.stance) > -1;
            });
            drawPie(filteredData);
        });

        document.getElementById("obstacle").addEventListener("click", function() {
            var filteredData = data.filter(function(d) {
                return true; // change this to the filter condition for obstacles
            });
            drawPie(filteredData);
        });

        document.getElementById("video").addEventListener("click", function() {
            var filteredData = data.filter(function(d) {
                return true; // change this to the filter condition for videos
            });
            drawPie(filteredData);
        });



        document.getElementById("main-wrapper").addEventListener("click", function(d) {
            if (d3.event.target.tagName !== "path") {
                exitPopup(d, year, this);
            }
        });

        document.getElementById("section-header").innerHTML = 'Top Obstacles';

        window.addEventListener('resize', function() {
            var screenWidth = window.innerWidth;
            var screenHeight = window.innerHeight;
            var width = screenWidth;
            var height = (screenWidth > screenHeight) ? 0.8 * screenHeight : screenWidth;
            var radius = Math.min(width, height) / 2;
            svg2.attr("width", width).attr("height", height);
            svg2.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
        });

        function setWhite() {
            document.getElementById("2020").style.backgroundColor = "white";
            document.getElementById("2021").style.backgroundColor = "white";
            document.getElementById("2022").style.backgroundColor = "white";
            document.getElementById("allyears").style.backgroundColor = "white";
        }
        year = 6969;
        data = loadedData;
        var nestedData = d3.nest()
            .key(function(d) {
                switch (year) {
                    case 2020:
                        return d.obs20;
                    case 2021:
                        return d.obs21;
                    case 2022:
                        return d.obs22;
                    case 6969:
                        return d.allyears;
                    default:
                        return null;
                }
            })
            .rollup(function(g) { return g.length; })
            .entries(data);
        console.log(loadedData)
        drawPie(6969);

    });

function drawPie(data) {
    var nestedData = d3.nest()
        .key(function(d) {
            return d.stance;
        })
        .rollup(function(g) { return g.length; })
        .entries(data);

    nestedData = nestedData.filter(d => d.key !== "" && d.value >= 10 || d.key == "other").sort((a, b) => {
        if (a.key < b.key) {
            return -1;
        }
        if (a.key > b.key) {
            return 1;
        }
        return 0;
    });
    var pieData = nestedData.map(function(d) {
        return {
            name: d.key,
            value: d.value,
            color: colorMap.get(d.key)
        };
    });
    Object.entries(colorMap).forEach(([key, value]) => {
        var newKey = key.replace("$", "");
        if (!pieData.find(data => data.name === newKey)) {
            pieData.push({ name: newKey, value: 0, color: value });
        }
    });

    var path = svg2.selectAll("path")
        .data(pie(pieData), d => d.data.name)




    path.exit().remove()
    path.transition()
        .duration(1000)
        .attrTween("d", arcTween);

    var g = svg2.selectAll(".arc")
        .data(pie(pieData));
    console.log(year)
    var path = g.enter().append("g")
        .attr("class", "arc")
        .append("path")

        .attr("d", arc)
        .style('stroke', 'white')
        .style("stroke-width", 1)
        .style("fill", function(d) { return colorMap.get(d.data.name); })
        .on("mousemove", function(d) {
            let x = d3.event.pageX;
            let y = d3.event.pageY;
            if (x > 0.6 * width) { x = 0.6 * width; }
            document.getElementById("popup").style.top = (y + 20) + "px";
            document.getElementById("popup").style.left = (x + 20) + "px";
        })
        .on("mouseenter", function(d) {
            let x = d3.event.pageX;
            let y = d3.event.pageY;
            if (x > 0.6 * width) {
                x = 0.6 * width;
            }
            enterPopup(d, year, this, x, y);
        })
        .on("mouseleave", function(d) {
            var mousePointer = d3.mouse(this);
            var mouseX = mousePointer[0];
            var mouseY = mousePointer[1];
            var centerX = width / 2;
            var centerY = height / 2;
            var distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
            var outerRadius = (screenWidth > screenHeight) ? radius * 0.7 : radius * 0.6;
            if (distance > outerRadius) {
                exitPopup(d, year, this);
            }
        })
        .on("touchstart", function(d) {
            if (d3.event.target.tagName !== "path") {
                exitPopup(d, year, this);
            }
        })



    function checkOverlapAndUpdate(pos, positions) {
        var textHeight = radius / 14
        var textWidth = radius / 3.3
        var maxIterations = 50;
        var counter = 0;

        while (true) {
            if (counter >= maxIterations) {
                break;
            }
            counter++;
            var overlap = false;
            for (var i = 0; i < positions.length; i++) {
                if (positions[i] === pos) continue;
                var xDiff = pos[0] - positions[i][0];
                var yDiff = pos[1] - positions[i][1];

                if (Math.abs(xDiff) < textWidth && Math.abs(yDiff) < textHeight) {
                    if (xDiff > 0) {
                        pos[0] += 5;
                    } else {
                        pos[0] -= 5;
                    }
                    if (yDiff > 0) {
                        pos[1] += 5;
                    } else {
                        pos[1] -= 5;
                    }
                    overlap = true;
                    break;
                }
            }
            if (!overlap) {
                console.log("overlap")
                break;
            }
        }
        while (pos[0] < -width + textWidth || pos[0] > width / 2 - textWidth - 20) {
            if (pos[0] < -width + textWidth) {
                pos[0] += 5;
            } else {
                pos[0] -= 5;
            }
        }
        return pos;
    }
    var positions = []
    console.log(positions)
    var line = d3.line()
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; });

    var text = svg2.selectAll("text")
        .data(pie(pieData), function(d) { return d.data.name; });
    console.log(pieData)

    text.enter()
        .filter(function(d) { return d.data.value % 1 === 0 && d.data.value > 1; })
        .append("text")
        .attr("transform", function(d) {
            var pos = arc.centroid(d);
            pos[0] = ((screenWidth > screenHeight) ? radius * 1 * Math.sin(midAngle(d)) : radius * 0.9 * Math.sin(midAngle(d)))
            pos[1] = radius * -0.9 * Math.cos(midAngle(d));
            positions.push(pos);
            pos = checkOverlapAndUpdate(pos, positions);
            return "translate(" + pos + ")";
        })
        .attr("class", "colouredtext")
        .style("font-family", "Electrolize")
        .style("font-size", `${radius/19}px`)
        .style("text-shadow", "h-shadow v-shadow blur-radius color")
        .style("font-weight", "bold")
        .attr("fill", function(d) { return colorMap.get(d.data.name); })
        .text(function(d) {
            var totalValue = d3.sum(pieData, function(d) { return d.value; });
            var percentage = (d.data.value / totalValue) * 100;
            return d.data.name.toUpperCase() + ": " + Math.round(percentage) + "%";
        })

    text.exit().remove()
    text.filter(function(d) { return d.data.value === 0; }).remove();
    var totalValue = pieData.reduce(function(acc, cur) { return acc + cur.value; }, 0);
    text.transition().duration(1000)
        .filter(function(d) { return d.data.value % 1 === 0 && d.data.value > 1; })
        .attr("transform", function(d, i) {
            var pos = arc.centroid(d);
            pos[0] = ((screenWidth > screenHeight) ? radius * 1 * Math.sin(midAngle(d)) : radius * 0.9 * Math.sin(midAngle(d)))
            pos[1] = radius * -0.9 * Math.cos(midAngle(d));
            positions.push(pos);
            pos = checkOverlapAndUpdate(pos, positions);
            return "translate(" + pos + ")";
        })
        .tween("text", function(d) {
            var self = this;
            var percentage = Math.round((d.data.value / totalValue) * 100);
            var start = self.textContent.split(':')[1].slice(0, -1);
            var i = d3.interpolate(start, percentage);
            return function(t) {
                self.textContent = d.data.name.toUpperCase() + ": " + Math.round(i(t)) + "%";
            }
        })
}

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
}