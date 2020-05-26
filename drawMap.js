function drawMap(data, category, time) {
    var map = L
        .map('graph1')
        .setView([47, 2], 2);   // center position + zoom

// Add a tile to the map = a background. Comes from OpenStreetmap
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
            maxZoom: 6,
        }).addTo(map);

// Add a svg layer to the map
    L.svg().addTo(map);

    var svg =  d3.select('#graph1').select('svg');
    svg.attr('pointer-events', 'all');
    var viewBox = svg.attr('viewBox');
    viewBox = viewBox.split(' ');
    var width = viewBox[2]; var height = viewBox[3];
    var adjustx = viewBox[2]/width; var adjusty = viewBox[3]/height;
    //svg.attr('viewBox', `(${viewBox[0]},${viewBox[1]},${width}, ${height})`);
    function click1(d){
        if (interactPara.countrySelect.indexOf(d.iso_code)===-1){
            countrySelect(d.iso_code);
            //$(this).attr('stroke', 'black').attr('stroke-width', '2');
        }
        else{
            countryCancelSelect(d.iso_code);
            //$(this).attr('stroke-width', '0');
        }
    }
    function mousemove(d){
        $(this).attr('stroke', 'black').attr('stroke-width', '2');
    }
    function mouseout(d){
        if (interactPara.countrySelect.indexOf(d.iso_code)===-1) {
            $(this).attr('stroke-width', '0');
        }
    }
    // Function that update circle position if something change
    function update() {
        d3.selectAll("circle")
            .attr("cx", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).x * adjustx})
            .attr("cy", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).y * adjusty })
    }

    function mainStep(category, time) {
        var dataForDraw = data.timeData[time];
        var countryPosition = data.countryPosition;
        var tmp = [];
        for (var i in dataForDraw){
            var position = countryPosition[dataForDraw[i]['iso_code']];
            if (position!==undefined) {
                dataForDraw[i].latitude = Number(position.latitude);
                dataForDraw[i].longitude = Number(position.longitude);
                tmp.push(dataForDraw[i]);
            }
        }
        dataForDraw = tmp;
        var scale;
        if (category!=='Case-Fatality_Ratio') {
            scale = d3.scaleLinear().domain([0, Math.log(d3.max(data.raw, d => d[category]))]).range([2, 25]);
        }
        else{
            scale = d3.scaleLinear().domain([0, 0.2]).range([2, 25]);
        }

        svg.selectAll("circle")
            .data(dataForDraw)
            .join('circle')
            .attr("cx", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).x * adjustx })
            .attr("cy", function(d){ return map.latLngToLayerPoint([d.latitude, d.longitude]).y * adjusty })
            .attr("r", function (d) {
                if (category !=='Case-Fatality_Ratio') {
                    var tmp = Math.log(d[category]);
                    if (tmp >= 0) {
                        return scale(tmp);
                    } else {
                        return scale(0);
                    }
                }
                else{
                    if (d[category]>0.2){
                        return scale(0.2);
                    }
                    else{
                        return scale(d[category]);
                    }
                }
            })
            .style("fill", "steelblue")
            .attr("fill-opacity", 0.7);

        svg.selectAll('circle')
            .on('click', click1)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);
    }

    mainStep(category, time);
// If the user change the map (zoom or drag), I update circle position:
    map.on("moveend", update);

    var mG = {};
    mG.update = function (category, time) {
        mainStep(category, time);
    };

    mG.countrySelect = function (country) {
        svg.selectAll('circle')
            .attr('stroke', 'black')
            .attr('stroke-width', function (d) {
                if (interactPara.countrySelect.indexOf(d.iso_code)!==-1){
                    return '2';
                }
                else{
                    return '0';
                }
            });
        var tmp = data.countryPosition[interactPara.recentSelect];
        map.setView([tmp.latitude, tmp.longitude]);
    };
    mG.countryCancelSelect = function (country) {
        svg.selectAll('circle')
            .attr('stroke', 'black')
            .attr('stroke-width', function (d) {
                if (interactPara.countrySelect.indexOf(d.iso_code)!==-1){
                    return '2';
                }
                else{
                    return '0';
                }
            });
    };
    return mG;
}