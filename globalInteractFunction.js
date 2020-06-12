function countrySelect(d) {
    interactPara.countrySelect.push(d);
    interactPara.recentSelect=d;

    mapGraph.countrySelect(interactPara.countrySelect);
    updateBaseInfo(getSpecificData(d, interactPara.time));
    updateTLCountry(interactPara.countrySelect);
    console.log(interactPara.countrySelect);
    parallelCountrySelect(interactPara.countrySelect);

    d3.select('#countrySelect1').select('ul').selectAll('li').selectAll('li')
        .style('background', function (d) {
            if (interactPara.countrySelect.indexOf(d)!==-1){
                return '#5AB1EF';
            }
            else{
                return 'white';
            }
        })
}
function countryCancelSelect(d) {
    var index = interactPara.countrySelect.indexOf(d);
    if (index!==-1) {
        interactPara.countrySelect.splice(index, 1);
    }
    //interactPara.recentSelect = '';
    console.log(d)
    parallelCountryCancelSelect(d);
    mapGraph.countryCancelSelect(d);
    updateTLCountry(interactPara.countrySelect);

    d3.select('#countrySelect1').select('ul').selectAll('li').selectAll('li')
        .style('background', function (d) {
            if (interactPara.countrySelect.indexOf(d)!==-1){
                return '#5AB1EF';
            }
            else{
                return 'white';
            }
        })
}

function categorySelect(d) {
    interactPara.category = d;
    mapGraph.update(interactPara.category, interactPara.time);
    drawParallel();
    changeRadial();
    updateTLCountry(interactPara.countrySelect);
    d3.select('#categorySelect').selectAll('button')
        .style('background', function (d) {
            if (d===interactPara.category){
                return '#5AB1EF';
            }
            else{
                return 'white';
            }
        })
}

function continentSelect(d) {
    var index = interactPara.continentSelect.indexOf(d);
    if (index!==-1) {
        interactPara.continentSelect.splice(index, 1);
    }
    else{
        interactPara.continentSelect.push(d);
    }
    drawParallel();
    changeRadial();
    d3.select('#countrySelect2').select('ul').selectAll('li')
        .style('background', function (d) {
            if (interactPara.continentSelect.indexOf(d)!==-1){
                return '#5AB1EF';
            }
            else{
                return 'white';
            }
        })
}

function filtByTotalCase(n) {
    interactPara.countryFilter[0] = n;
    drawParallel();
    changeRadial();
}

function filtByDeathCase(n) {
    interactPara.countryFilter[1] = n;
    drawParallel();
    changeRadial();
}

function timeSelect(t){
    interactPara.time = t;
    mapGraph.update(interactPara.category, interactPara.time);
    drawParallel();
    changeRadial();
    updateBaseInfo(getSpecificData(interactPara.recentSelect, interactPara.time));
}
