function countrySelect(d) {
    interactPara.countrySelect.push(d);
    interactPara.recentSelect=d;

    mapGraph.countrySelect(interactPara.countrySelect);
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
}

function continentSelect(d) {

}

function filtByTotalCase(n) {

}

function filtByDeathCase(n) {

}

function timeSelect(t){
    interactPara.time = t;
    mapGraph.update(interactPara.category, interactPara.time);
}