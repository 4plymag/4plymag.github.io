var barMargin = { top: 10, right: window.innerWidth < 1000 ? 4 : window.innerWidth / 100, bottom: 40, left: window.innerWidth / 5 }
var barWidth = (window.innerWidth * 0.7) - barMargin.right - barMargin.left;
const barHeight = window.innerWidth > 1000 ? window.innerHeight * 0.6 : window.innerHeight * 0.6;



let svg3 = d3.select("#my_interactivedatavis")
    .append("svg")
    .attr("width", "100%")
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + barMargin.left + "," + barMargin.top + ")");

drawog()

function drawog() {
    barMargin.left = window.innerWidth / 4;
    const widthRatio = window.innerWidth > 1000 ? 0.7 : 0.9;
barWidth = (window.innerWidth * widthRatio) - barMargin.right - barMargin.left;


    svg3.attr("transform", "translate(" + (barMargin.left) + "," + barMargin.top + ")");
    d3.csv("detaildf.csv", function(data) {
        let trickByObstacle = d3.nest()
            .key(function(d) { return d.obstacle; })
            .rollup(function(leaves) {
                return d3.sum(leaves, function(d) { return (d.cnt) });
            })
            .entries(data)

        console.log(trickByObstacle)
        var barData = trickByObstacle.map(function(d) {
            return {
                name: d.key,
                value: d.value,
                color: colorMap.get(d.key)
            };
        });
        Object.entries(colorMap).forEach(([key, value]) => {
            var newKey = key.replace("$", "");
            if (!barData.find(data => data.name === newKey)) {
                barData.push({ name: newKey, value: 0, color: value });
            }
        });
        document.getElementById("bar-header").innerHTML = 'Top Obstacles';
        // Add X axis
        let x = d3.scaleLinear()
            .domain([0, (d3.max(trickByObstacle, function(d) { return +d.value; }))])
            .range([0, barWidth])

        let tickValues = d3.range(0, (d3.max(trickByObstacle, function(d) { return +d.value; })), (barWidth / 30));
        let xAxis = d3.axisBottom(x).tickValues(tickValues).tickSize(0);
        svg3.append("g")
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${barHeight})`)
            .call(xAxis)
        // Y axis
        let y = d3.scaleBand()
            .range([0, barHeight])
            .domain(data.map(d => d.obstacle))
            .padding(.2);
        // y axis titles
        svg3.append("g")
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y))
            .style('font-size', '.8rem')



        let trickByObstacle2 = d3.nest()
            .key(function(d) {
                return d.trick;
            })
            .rollup(function(leaves) {
                return d3.sum(leaves, function(d) { return (d.cnt) });
            })
            .entries(data)

        console.log(trickByObstacle2)

        let trickmap = d3.map(trickByObstacle2)
        let map = (trickmap.values())

        console.log(trickmap)
        console.log(map)

        svg3.append("g")
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y))
            .style('font-size', '.8rem')
        //Bars
        svg3.selectAll("myRect")
            .data(barData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", function(d) { return y(d.name); })
            .attr("obstacle", function(d) { return (d.name); })
            .transition().delay(function(d, i) { return i * 80; })
            .duration(400)
            .attr("width", function(d) { return x(d.value); })
            .attr("height", (y.bandwidth()))
            .attr("fill", function(d) { return colorMap.get(d.name); })
            .style('stroke', 'black')
            .style('stroke-width', 1)
        // add x-axis
        d3.select('svg')
            .append("text")
            .attr('x', (barWidth + barMargin.left) / 2)
            .attr('y', barHeight + barMargin.top + 60)
            // .style("text-anchor", "left")
            // .style('font-family', "PressStart2PRegular")
            .style('font-size', '1rem')
            // .text("total tricks by obstacle");

        d3.selectAll("rect")
            .on('click', function() {
                console.log("mouseClick")
                var selectedOption = d3.select(this).attr("obstacle")
                console.log(selectedOption)
                var headerText;
                if (selectedOption === "flat" || selectedOption === "stairs") {
                    headerText = 'Top tricks on ' + selectedOption;
                } else {
                    headerText = 'Top tricks on ' + selectedOption + 's';
                }
                // document.getElementById("section-header").innerHTML = headerText;
                d3.selectAll("rect")
                    .remove();

                d3.selectAll("g.tick")
                    .remove();
                redraw(selectedOption);
            })
    })

    function redraw(selectedObstacle) {
        barMargin.left = window.innerWidth / 3;
        barWidth = (window.innerWidth * 0.8) - barMargin.right - barMargin.left;

        svg3.attr("transform", "translate(" + (barMargin.left) + "," + barMargin.top + ")");
        d3.csv("detaildf.csv", function(data) {

            let dataFilter = data.filter(d => d.obstacle == selectedObstacle);
            let uniqueData = {};
            console.log(colorMap)
            dataFilter.forEach(d => {
                //create a key for each trick-obstacle combination
                let key = d.trick + " " + d.obstacle;
                //if the key already exists in the uniqueData object, add the current cnt to the existing cnt
                if (uniqueData[key]) {
                    uniqueData[key].cnt = parseInt(uniqueData[key].cnt) + parseInt(d.cnt);
                } else {
                    uniqueData[key] = { ...d };
                }
            });
            dataFilter = Object.values(uniqueData).filter(d => d.obstacle == selectedObstacle).map(d => {
                let newD = { ...d };
                delete newD.obstacledetail;
                return newD;
            });
            dataFilter = Object.values(uniqueData);
            var allObstacle = d3.map(data, function(d) { return (d.obstacle) }).keys()
            let top25 = [];
            if (selectedObstacle === "pad") {
                top25 = dataFilter.filter(elem => elem.obstacle === "pad").sort((a, b) => b.cnt - a.cnt).slice(0, 13);
            } else {
                top25 = dataFilter.sort((a, b) => b.cnt - a.cnt).slice(0, 16);
            }



            console.log(top25)
            // Add X axis
            let x = d3.scaleLinear()
                .domain([0, (d3.max(dataFilter, function(d) { return +d.cnt; }))])
                .range([0, barWidth])
            let numTicks;
            if (d3.max(top25, function(d) { return +d.cnt; }) < 10) {
                numTicks = d3.max(top25, function(d) { return +d.cnt; });
            } else {
                numTicks = 10;
            }
            let tickValues = d3.range(0, (d3.max(top25, function(d) { return +d.cnt; })), Math.round((d3.max(top25, function(d) { return +d.cnt; })) / numTicks));
            tickValues.push(d3.max(top25, function(d) { return +d.cnt; }));
            let xAxis = d3.axisBottom(x).tickValues(tickValues).tickSize(0);
            svg3.append("g")
                .attr('class', 'x-axis')
                .attr('transform', `translate(0, ${barHeight})`)
                .call(xAxis)
            // Y axis
            let y = d3.scaleBand()
                .range([0, barHeight])
                .domain(top25.map(d => (d.trick)))
                .padding(.7)


            const screenWidth = window.innerWidth;
            const maxWidth = screenWidth * 0.3;
            const isMobile = window.innerWidth < 600;
            const lineHeight = isMobile ? 0.7 : 0.7;

            function wrap(text, width) {
                text.each(function() {
                    var text = d3.select(this),
                        words = text.text().split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineNumber = 0,
                        // lineHeight = 0.7, // ems
                        y = text.attr("y"),
                        dy = parseFloat(text.attr("dy")),
                        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                        }
                    }
                });
            }
            svg3.append("g")
                .attr('class', 'y-axis')
                .call(d3.axisLeft(y))
                .style('font-size', '.8rem')

            svg3.selectAll(".y-axis .tick text")
                .attr("transform", `translate(-${barWidth * 0.02}, ${barHeight * 0.01})`)
                .call(wrap, maxWidth)
                .each(function() {
                    if (d3.select(this).selectAll("tspan").size() > 1) {
                        d3.select(this).attr("transform", `translate(-${barWidth * 0.02}, ${-barHeight * 0.005})`);
                    }
                })



            svg3.selectAll('.x-axis .tick text')
                .text(d => Math.round(d))

            console.log(top25)
            var subData = top25.map(function(d) {
                return {
                    trick: d.trick,
                    value: d.cnt,
                    key: d.obstacle,
                    color: colorMap.get(d.obstacle)

                };
            });
            console.log(subData)
            svg3.selectAll("myRect")
                .data(subData)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", 0)
                .attr("y", (function(d) { return (y(d.trick)) }))
                .transition()
                .duration(function() { return Math.random() * (500 - 250) + 200; })
                .delay(function(d, i) { return i * (Math.random() * (40 - 30) + 30); })
                .ease(d3.easeLinear)
                .attr("width", function(d) { return x(d.value) })
                .attr("height", (y.bandwidth() * 2.2))
                .attr("fill", function(d) { return colorMap.get(d.key); })
                .style('stroke', 'black')
                .style('stroke-width', 1);


            d3.selectAll("rect")
                .on('click', function() {
                    console.log("mouseClick")
                    // change colour of tags
                    d3.selectAll("rect")
                        .remove();
                    // d3.selectAll("text")
                    //     .remove();
                    d3.selectAll("g.tick")
                        .remove();
                    drawog();
                })
        })
    }
}