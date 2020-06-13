function createInteractWidget(data) {
    function click(d){
        if (interactPara.countrySelect.indexOf(d)===-1){
            countrySelect(d);
        }
        else{
            countryCancelSelect(d);
        }
    }

    interactPara = {time:data.timeList[data.timeList.length-1], category: 'total_cases', countrySelect: [], recentSelect:'', continentSelect: ["AS","AF","EU"], countryFilter: [1000,1000]};

    d3.select('#countrySelect1').append('ul').selectAll('li')
        .data(data.continentList).join('li').text(d=>data.continentName[d])
        .on('click', function (d) {
            if (d3.select(this).select('ul').style('display')==='none') {
                d3.select(this).select('ul').style('display', 'block')
            }
            else{
                d3.select(this).select('ul').style('display', 'none')
            }
        })
        .append('ul')
        .selectAll('li').data(d=>data.continentCountry[d]).join('li').text(d=>data.countryName[d]).on('click', click);

    d3.select('#categorySelect').selectAll('button')
        .data(data.category).join('button').text(d=>globalData.categoryName[d]).on('click', categorySelect);

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
    interactPara.continentSelect=["AS","AF","EU"];
    

    var totalCaseFilterNum = 3; var deathCaseFilterNum = 3;
    interactPara.countryFilter=[1000,1000];
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

    $('#whole').click(function () {
        if ($('#predict').attr('display')!=='none'){
            $('#predict').hide();
            $(this).hide().css('pointer-events', 'none');
        }
    })
}

function predictFromPython(middle, end) {
    var tmpdate= new Date;
    var picture = $.ajax({url:`predict/${interactPara.recentSelect}/${middle}/${end}`, async:false});
    $('#predict img').attr('src', `plots/model_${interactPara.recentSelect}.png/${tmpdate.getTime()}`);
}

function updateBaseInfo(data) {
    var basicInfo = $('#basicInfo');
    basicInfo.html(`- 当前选中 -<br/>
    <p>${globalData.countryName[data.iso_code]}</p>
    <p>确诊<br>${data.total_cases}</p>
    <p>新增<br>${data.new_cases}</p>
    <p>死亡<br>${data.total_deaths}</p><p><button>拟合预测</button></p>`);
    $('#basicInfo button').click(function () {
        var countryData = globalData.countryData[interactPara.recentSelect];
        var zeroCount = 0;
        for (var i in countryData){
            if (countryData[i].total_cases===0){
                zeroCount+=1;
            }
        }
        var timeMax = countryData.length-1-zeroCount;

        predictFromPython(Math.floor(timeMax/2), timeMax);
        $('#predict input').attr('max', timeMax)
            .change(function () {
                predictFromPython($(this).val(), timeMax);
            }).val(Math.floor(timeMax/2));
        $('#predict').show();
        $('#whole').show().css('pointer-events', 'all');
    })
}
