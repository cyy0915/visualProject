function countrySelect(d) {
    interactPara.countrySelect.push(d);
    interactPara.recentSelect=d;

    mapGraph.countrySelect(interactPara.countrySelect);
    updateBaseInfo(getSpecificData(d, interactPara.time));
    updateTLCountry(interactPara.countrySelect);
    console.log(interactPara.countrySelect)
    parallelCountrySelect(interactPara.countrySelect)
}
function countryCancelSelect(d) {
    var index = interactPara.countrySelect.indexOf(d);
    if (index!==-1) {
        interactPara.countrySelect.splice(index, 1);
    }
    interactPara.recentSelect = '';
    console.log(d)
    parallelCountryCancelSelect(d);
    mapGraph.countryCancelSelect(d);
    updateTLCountry(interactPara.countrySelect);
}

function categorySelect(d) {
    interactPara.category = d;
    mapGraph.update(interactPara.category, interactPara.time);
    drawParallel();
    changeRadial();
    updateTLCountry(interactPara.countrySelect);
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
}
