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

var year = 0;
var data =
    d3.csv("obstime.csv", function(loadedData) {
        document.getElementById("allyears").style.backgroundColor = "#B8D4F3";
        document.getElementById("2020").addEventListener("click", function() {
            year = 2020
            drawPie(2020);
            setWhite();
            document.getElementById("2020").style.backgroundColor = "#B8D4F3";
        });

        document.getElementById("2021").addEventListener("click", function() {
            year = 2021
            drawPie(2021);
            setWhite();
            document.getElementById("2021").style.backgroundColor = "#B8D4F3";
        });

        document.getElementById("2022").addEventListener("click", function() {
            year = 2022
            drawPie(2022);
            setWhite();
            document.getElementById("2022").style.backgroundColor = "#B8D4F3";
        });

        document.getElementById("allyears").addEventListener("click", function() {
            year = 6969
            drawPie(6969);
            setWhite();
            document.getElementById("allyears").style.backgroundColor = "#B8D4F3";
        });

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
        drawPie(6969);
    });
function drawPie(newYear) {
    year = newYear
    function enterPopup(d, pathEl, x, y) {
        var prop = { obs: '', det: '' }
        if (x > 0.5 * width) {
            x = 0.5 * width;
        }
        document.getElementById("popup").style.top = (y + 20) + "px";
        document.getElementById("popup").style.left = (x + 20) + "px";
        pathEl.style.opacity = 0.8;
        var yearProperties = {
            2020: { obs: 'obs20', det: 'det20' },
            2021: { obs: 'obs21', det: 'det21' },
            2022: { obs: 'obs22', det: 'det22' },
            6969: { obs: 'allyears', det: 'alldets' },
        };
        var prop = yearProperties[year];
        var other = 0;
        var name = d.data.name;
        var nestedData = d3.nest()
            .key(function(d) {

            if (year === 2020) {
                return d.det20;
            } else if (year === 6969) {
                return d.alldets;
            } else if (year === 2021) {
                return d.det21;
            } else if (year === 2022) {
                return d.det22;
            }
        })
            .rollup(function(values) {
                var filteredValues = values.filter(function(d) {
                    return d[prop.obs] === name;
                });
                return filteredValues.length;
            })
            .entries(data.filter(function(d) {
                return d[prop.obs] === name;
            }))
            .concat({ key: "other", value: other });
        var nestedDataString = [];
        nestedData = nestedData.filter(d => d.key !== "" && d.key !== " " && (d.value >= 2 || d.key === "other")).sort((a, b) => b.value - a.value);
        for (var i = 0; i < nestedData.length; i++) {
            if (nestedData[i].key !== "other" || nestedData[i].value > 0 && nestedData[i].key !== " ") {
                nestedDataString.push(nestedData[i].key + ": " + nestedData[i].value);
            }
        }


        var popupContent = d3.select("#popupcontent");
        popupContent.html("")

        for (var i = 0; i < nestedDataString.length; i++) {
            var className = i % 2 === 0 ? "regular" : "light-grey";
            popupContent.append("p").text(nestedDataString[i].toUpperCase()).attr("class", className).style("font-size", `${radius/19}px`).style("line-height", 1.1);
        }

        var popupHeading = d3.select("#popupheading");
        popupHeading.html("").append("p").text(d.data.name.toUpperCase()).attr("class", "popupheading").style("font-size", `${radius/19}px`).style("line-height", 1);
        d3.select("#popup").style("display", "block");
    }

    function exitPopup(d, year, pathEl) {
        var popup = d3.select("#popup")
            .style("display", "none")

        var path = svg2.selectAll("path")
            .style("opacity",1)
    }

    other = 0
    var nestedData = d3.nest()
        .key(function(d) {

            if (year === 2020) {
                return d.obs20;
            } else if (year === 6969) {
                return d.allyears;
            } else if (year === 2021) {
                return d.obs21;
            } else if (year === 2022) {
                return d.obs22;
            }
        })
        .rollup(function(values) {
            var count = values.length;
            if (count < 10) {
                other += count;
            }
            return count;
        })
        .entries(data)
        .concat({ key: "other", value: other });

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
        .on("mouseenter", function(d,) {
            let x = d3.event.pageX;
            let y = d3.event.pageY;
            if (x > 0.6 * width) {
                x = 0.6 * width;
            }
            enterPopup(d, this, x, y);
        })
        .on("mouseleave", function(d, year) {
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
    var line = d3.line()
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; });

    var text = svg2.selectAll("text")
        .data(pie(pieData), function(d) { return d.data.name; });

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