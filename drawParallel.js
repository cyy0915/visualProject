function drawParallel() {
    // center position + zoom

    // Add a tile to the map = a background. Comes from OpenStreetmap

    // Add a svg layer to the map

    var ssvgdom = d3.select("#graph4").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")

        dimensions = d3.keys(data[0]).filter(function (d) { return d })
        var y = {}
        for (i in dimensions) {
            name = dimensions[i]
            y[name] = d3.scaleLinear()
                .domain(d3.extent(data, function (d) { return +d[name]; }))
                .range([height, 0])
        }

        x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(dimensions);

        function path(d) {
            return d3.line()(dimensions.map(function (p) { return [x(p), y[p](d[p])]; }));
        }

        ssvgdom.selectAll("myPath").data(data).enter()
            .append("path")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", "#69b3a2")
            .style("opacity", 0.5)

        ssvgdom.selectAll("myAxis").data(dimensions).enter().append("g")
            .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
            .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) { return d; })
            .style("fill", "black")

}