var margin = { top: 10, right: 100, bottom: 30, left: 30 },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#timeLine")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var allGroup = ["确诊人数", "死亡人数", "确诊人数(每百万人)", "死亡人数(每百万人)"];

d3.select("#selectYAxis")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })

d3.csv('graph2Test.csv')
    .then(function (data) {

        // 绘制y轴，默认total_cases（确诊人数）
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.total_cases; })])
            .range([height, 0]);
        var yAxis = d3.axisLeft().scale(y);
        svg.append("g")
            .attr("class", "myYaxis");
        svg.selectAll(".myYaxis")
            .transition()
            .duration(3000)
            .call(yAxis);

        // 绘制x轴
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d3.timeParse("%Y-%m-%d")(d.date); }))
            .range([0, width]);
        var xAxis = d3.axisBottom().scale(x);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "myXaxis");
        svg.selectAll(".myXaxis").transition()
            .duration(3000)
            .call(xAxis);

        var line = svg
            .append('g')
            .append("path")
            .datum(data)
            .attr("d", d3.line()
                .x(function (d) { return x(+d3.timeParse("%Y-%m-%d")(d.date)) })
                .y(function (d) { return y(+d.total_cases) })
            )
            .attr("stroke", "black")
            .style("stroke-width", 3)
            .style("fill", "none")

        function update(selected) {

            var selectedGroup = "total_cases";
            if (selected == "死亡人数") {
                selectedGroup = "total_deaths";
            }
            if (selected == "确诊人数(每百万人)") {
                selectedGroup = "total_cases_per_million";
            }
            if (selected == "死亡人数(每百万人)") {
                selectedGroup = "total_deaths_per_million";
            }
            if (selected == "确诊人数") {
                selectedGroup = "total_cases";
            }

            var dataFilter = data.map(
                function (d) {
                    return {
                        time: d3.timeParse("%Y-%m-%d")(d.date),
                        value: d[selectedGroup]
                    }
                })

            y.domain([0, d3.max(dataFilter, function (d) { return +d.value; })]);
            svg.selectAll(".myYaxis")
                .transition()
                .duration(3000)
                .call(yAxis);

            line
                .datum(dataFilter)
                .transition()
                .duration(3000)
                .attr("d", d3.line()
                    .x(function (d) { return x(+d.time) })
                    .y(function (d) { return y(+d.value) })
                )
                .attr("stroke", "black")

        }

        d3.select("#selectYAxis").on("change", function (d) {
            var selectedOption = d3.select(this).property("value")
            update(selectedOption)
        })


        console.log(data);
    })
    .catch(function (error) {
    })

