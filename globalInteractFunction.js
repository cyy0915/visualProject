function countrySelect(d) {
    interactPara.countrySelect.push(d);
    interactPara.recentSelect=d;

    mapGraph.countrySelect(interactPara.countrySelect);
    updateBaseInfo(getSpecificData(d, interactPara.time));
    updateTLCountry(interactPara.countrySelect);
}
function countryCancelSelect(d) {
    var index = interactPara.countrySelect.indexOf(d);
    if (index!==-1) {
        interactPara.countrySelect.splice(index, 1);
    }
    interactPara.recentSelect='';

    mapGraph.countryCancelSelect(d);
}

function categorySelect(d) {
    interactPara.category = d;
    mapGraph.update(interactPara.category, interactPara.time);
    changeRadial();
}

function continentSelect(d) {
    var index = interactPara.continentSelect.indexOf(d);
    if (index!==-1) {
        interactPara.continentSelect.splice(index, 1);
    }
    else{
        interactPara.continentSelect.push(d);
    }
    
    changeRadial();
}

function filtByTotalCase(n) {
    interactPara.countryFilter[0] = n;
    changeRadial();

}

function filtByDeathCase(n) {
    interactPara.countryFilter[1] = n;
    changeRadial();
}

function timeSelect(t){
    interactPara.time = t;
    mapGraph.update(interactPara.category, interactPara.time);
    changeRadial();
}
