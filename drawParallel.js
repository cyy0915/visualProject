function drawParallel() {
    d3.select('#graph4').select('svg').remove();

    var margin = { top: 40, right: 10, bottom: 10, left: 0 },
        width = 710 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

    var svg= d3.select("#graph4").append("svg")
        .attr('viewBox', `0,0,${width + margin.left + margin.right}, ${height + margin.top + margin.bottom}`)
        .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }))
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    var data = globalData.timeData[interactPara.time], category = interactPara.category,
        sel = interactPara.continentSelect, up = interactPara.countryFilter;

    var dataSet = [], num = ["NA", "AS", "AF", "EU", "SA", "OC", "AN"];

    for (var i = 0; i < data.length - 1; ++i) {
        if (sel.indexOf(data[i].continent_code) != -1 && data[i].total_cases > up[0] && data[i].total_deaths > up[1]) {
            var tmp = {};
            tmp.continent = data[i].continent_code;
            tmp.continent_num = num.indexOf(tmp.continent)
            tmp.total = data[i][category];
            tmp.new = data[i].new_cases;
            tmp.death = data[i].new_deaths;
            tmp.area = data[i].location;
            tmp.cases_per_million = data[i].total_cases_per_million;
            tmp.new_per_million = data[i].new_cases_per_million;
            tmp.death_per_million = data[i].new_deaths_per_million;      
            dataSet.push(tmp);
        }        
    }
    dimension = ["所在洲"];
    if (document.getElementById("total").checked) dimension.push("确诊数");
    if (document.getElementById("new").checked) dimension.push("新增数");
    if (document.getElementById("death").checked) dimension.push("死亡数");
    if (document.getElementById("total_million").checked) dimension.push("确诊数（每百万）");
    if (document.getElementById("new_million").checked) dimension.push("新增数（每百万）");
    if (document.getElementById("death_million").checked) dimension.push("死亡数（每百万）");
    var y = {};
    function changeName(name) {
        if (name === "所在洲") return "continent_num";
        if (name === "确诊数") return "total";
        if (name === "新增数") return "new";
        if (name === "死亡数") return "total";
        if (name === "确诊数（每百万）") return "cases_per_million";
        if (name === "新增数（每百万）") return "new_per_million";
        if (name === "死亡数（每百万）") return "death_per_million";
    }
    for (i in dimension) {
        var name = dimension[i];
        var para = changeName(name)
        y[name] = d3.scaleLinear()
            .domain(d3.extent(dataSet, function (d) {
                return +d[para];
            }))
            .range([height, 0]);
    }
    x = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimension);

    function path(d) {
        return d3.line()(dimension.map(function (p) {     
            return [x(p), y[p](d[changeName(p)])];
        }));
    }

    svg.selectAll("myPath").data(dataSet).enter()
        .append("path")
        .attr("d", path)
        .attr("id", function (d) { return d.area; })
        .style("fill", "none")
        .style("stroke", 'steelblue')
        .style("opacity", 1)
        .on("click", function () {
            alert(this.id)
        })
        .on("mouseover", function () { d3.select(this).attr("stroke", "black") })
        .on("mouseout", function () { d3.select(this).attr("stroke", "none") })

    svg.selectAll("myAxis").data(dimension).enter().append("g")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
        .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])).selectAll('text').attr('font-size',18); })
        .append("text")
        .attr("font-size", 18)
        .style("text-anchor", "middle")
        .attr("y", -15)
        .text(function (d) { return d; })
        .style("fill", "black")
}

function parallelCountrySelect(d) {

}

function parallelCountryCancelSelect(d) {
    
}
