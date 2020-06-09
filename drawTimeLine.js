function drawTimeLine(globalData, country) {

    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#timeLine")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var allGroup = ["确诊人数", "死亡人数", "确诊人数(每百万人)", "死亡人数(每百万人)"];
    var allGroup1 = ["缩放模式", "显示数据模式"];


    d3.select("#selectYAxis")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })

    d3.select("#monitorNum")
        .selectAll('myOptions')
        .data(allGroup1)
        .enter()
        .append('option')
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })


    //初始化的数据读入，默认显示USA的total_cases（确诊人数）

    /* -- 数据调用方式记录 --
     * globalData.countryData →下有数组 OWID_WRL USA ESP GBR ...
     * globalData.countryData[] →下有数组 0 1 2 3 4 5 6 7 8 ...
     * globalData.countryData[][] →下有数组 iso_code location date total_cases new_cases ...
     * 数据 = globalData.countryData[国家名字缩写][第几行（0开始计数）][条目名];
     * */

    var countryChosen = country;
    var countryChosenData = globalData.countryData[countryChosen];

    /* -- 数据调用方式记录 --
     * countryChosenData →下有数组 0 1 2 3 4 5 6 7 8 ...
     * countryChosenData[] →下有数组 iso_code location date total_cases new_cases ...
     * 数据 = countryChosenData[第几行（0开始计数）][条目名];
     * */

    //初始化画图需要的数据，储存进data
    var data = [];
    for (var i in countryChosenData) {
        var slide = {
            date: countryChosenData[i]['date'],
            time: d3.timeParse("%Y-%m-%d")(countryChosenData[i]['date']),
            total_cases: countryChosenData[i]['total_cases'],
            total_deaths: countryChosenData[i]['total_deaths'],
            total_cases_per_million: countryChosenData[i]['total_cases_per_million'],
            total_deaths_per_million: countryChosenData[i]['total_deaths_per_million']
        };
        data.push(slide);
    }
    //document.getElementById("demo").innerHTML = tmp;

    var dataFilter = data.map(
        function (d) {
            return {
                date: d.date,
                time: d.time,
                value: d["total_cases"]
            }
        })
    var selectedGroup = "total_cases";


    // 绘制y轴
    var y = d3.scaleLinear()
        .domain([0, d3.max(dataFilter, function (d) { return +d.value; })])
        .range([height, 0]);
    var yAxis = d3.axisLeft().scale(y);
    svg.append("g")
        .attr("class", "myYaxis");
    svg.selectAll(".myYaxis")
        .transition()
        .call(yAxis);

    // 绘制x轴
    var x = d3.scaleTime()
        .domain(d3.extent(dataFilter, function (d) { return d.time; }))
        .range([0, width]);
    var xAxis = d3.axisBottom().scale(x);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "myXaxis");
    svg.selectAll(".myXaxis").transition()
        .call(xAxis);

    var choose = null;

    //区域限制
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    //选区刷
    var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function


    //画线
    var line = svg
        .append('g')
        .attr("clip-path", "url(#clip)")

    line
        .append("path")
        .datum(dataFilter)
        .attr("class", "line")
        .attr("d", d3.line()
            .x(function (d) { return x(+d.time) })
            .y(function (d) { return y(+d.value) })
        )
        .attr("stroke", "black")
        .style("stroke-width", 3)
        .style("fill", "none")

    line
        .append("g")
        .attr("class", "brush")
        .call(brush);

    var idleTimeout
    function idled() { idleTimeout = null; }

    function moniNum() {
        //鼠标位置对应的x
        var bisect = d3.bisector(function (d) { return d.time; }).left;
        //实时显示部分
        var focus = svg
            .append('g')
            .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 8.5)
            .style("opacity", 0)
        var focusText = svg
            .append('g')
            .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")
            //鼠标移动显示
            svg
                .append('rect')
                .style("fill", "none")
                .style("pointer-events", "all")
                .attr('width', width)
                .attr('height', height)
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseout', mouseout);
            function mouseover() {
                focus.style("opacity", 1)
                focusText.style("opacity", 1)
            }
            function mousemove() {
                // recover coordinate we need
                var x0 = x.invert(d3.mouse(this)[0]);
                var i = bisect(dataFilter, x0, 1);
                selectedData = dataFilter[i];
                focus
                    .attr("cx", x(selectedData.time))
                    .attr("cy", y(selectedData.value))
                if (y(selectedData.value) > 30) {
                    if (i <= (dataFilter.length / 2)) {
                        focusText
                            .html("日期:" + selectedData.date + "  -  " + "人数:" + selectedData.value)
                            .attr("x", x(selectedData.time) + 15)
                            .attr("y", y(selectedData.value) - 10)
                    } else {
                        focusText
                            .html("日期:" + selectedData.date + "  -  " + "人数:" + selectedData.value)
                            .attr("x", x(selectedData.time) - 250)
                            .attr("y", y(selectedData.value) - 10)
                    }
                } else {
                    if (i <= (dataFilter.length / 2)) {
                        focusText
                            .html("日期:" + selectedData.date + "  -  " + "人数:" + selectedData.value)
                            .attr("x", x(selectedData.time) + 15)
                            .attr("y", y(selectedData.value) + 10)
                    } else {
                        focusText
                            .html("日期:" + selectedData.date + "  -  " + "人数:" + selectedData.value)
                            .attr("x", x(selectedData.time) - 250)
                            .attr("y", y(selectedData.value) + 10)
                    }
                }
            }
            function mouseout() {
                focus.style("opacity", 0)
                focusText.style("opacity", 0)
                stop = true;
            }
    }


    //更改y轴&刷新
    function update(selected) {

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

        dataFilter = data.map(
            function (d) {
                return {
                    date: d.date,
                    time: d.time,
                    value: d[selectedGroup]
                }
            })

        x.domain(d3.extent(dataFilter, function (d) { return d.time; }))
        svg.selectAll(".myXaxis")
            .transition()
            .duration(3000)
            .call(xAxis);

        y.domain([0, d3.max(dataFilter, function (d) { return +d.value; })]);
        svg.selectAll(".myYaxis")
            .transition()
            .duration(3000)
            .call(yAxis);

        line
            .datum(dataFilter)
            .select('.line')
            .transition()
            .duration(3000)
            .attr("d", d3.line()
                .x(function (d) { return x(+d.time) })
                .y(function (d) { return y(+d.value) })
            )
            .attr("stroke", "black")

    }

    //缩放
    function updateChart() {

        // What are the selected boundaries?
        extent = d3.event.selection

        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if (!extent) {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            update(selectedGroup)
        } else {
            x.domain([x.invert(extent[0]), x.invert(extent[1])])
            line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }

        // Update axis and line position
        //xAxis
        svg.selectAll(".myXaxis")
            .transition()
            .duration(3000)
            .call(xAxis)
        line
            .select('.line')
            .transition()
            .duration(3000)
            .attr("d", d3.line()
                .x(function (d) { return x(d.time) })
                .y(function (d) { return y(d.value) })
            )
    }

    d3.select("#selectYAxis").on("change", function (d) {
        var selectedOption = d3.select(this).property("value")
        update(selectedOption)
    })

    d3.select("#monitorNum").on("change", function (d) {
        var selectedOption = d3.select(this).property("value")
        if (selectedOption == "缩放模式") {
            //updateTLCountry(countryChosen);
            document.getElementById("demo").innerHTML = "如需缩放，请重新点选国家进行刷新";
        }
        if (selectedOption == "显示数据模式") {
            choose = moniNum();
        }
    })

    

}
