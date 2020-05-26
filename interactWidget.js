function createInteractWidget(data) {
    interactPara = {time:data.timeList[data.timeList.length-1], category: 'total_cases', countrySelect: [], recentSelect:'', countryFilter:{}};

    d3.select('#countrySelect1').append('ul').selectAll('li')
        .data(data.continentList).join('li').text(d=>data.continentName[d]).append('ul')
        .selectAll('li').data(d=>data.continentCountry[d]).join('li').text(d=>data.countryName[d]).on('click', countrySelect);

    d3.select('#categorySelect').selectAll('button')
        .data(data.category).join('button').text(d=>d).on('click', categorySelect);

    var currentTime;
    $('#timeAxis input').attr('max', data.timeList.length-1)
        .mousemove(function () {
        var newTime = data.timeList[$(this).val()];
        if (currentTime!==newTime) {
            currentTime = newTime;
            $('#timeAxis span').text(newTime);
            timeSelect(newTime);
        }
    });
    $('#timeAxis input').val(data.timeList.indexOf(interactPara.time));


    d3.select('#countrySelect2').select('ul').selectAll('li')
        .data(data.continentList).join('li').text(d=>data.continentName[d]).on('click', continentSelect);

    var totalCaseFilterNum = 4; var deathCaseFilterNum = 3;
    $('#totalCaseFilter input').mousemove(function () {
        var number = $(this).val();
        if (totalCaseFilterNum!==number) {
            totalCaseFilterNum = number;
            number = 10 ** (number - 1);
            $('#totalCaseFilter span').text(`确诊数>${number}`);
            filtByTotalCase(number);
        }
    });
    $('#deathCaseFilter input').mousemove(function () {
        var number = $(this).val();
        if (deathCaseFilterNum!==number) {
            deathCaseFilterNum=number;
            number = 10 ** (number - 1);
            $('#deathCaseFilter span').text(`死亡数>${number}`);
            filtByDeathCase(number);
        }
    })
}