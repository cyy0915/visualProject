function dataProcess(data) {
    //中文名和iso code对应
    var countryName = $.ajax({url:'countryCode.csv', async:false}).responseText;
    var countryContinent = $.ajax({url: 'continentCode.csv', async:false}).responseText;
    countryName = d3.csvParse(countryName);
    countryContinent = d3.csvParse(countryContinent);
    var tmp = {};
    for (var i in countryContinent){
        tmp[countryContinent[i].Three_Letter_Country_Code]=countryContinent[i].Continent_Code;
    }
    countryContinent = tmp;
    tmp = {};
    for (var i in countryName){
        tmp[countryName[i]['三字母代码']]=countryName[i]['中文简称'];
    }
    countryName = tmp;

    data = d3.csvParse(data);
    data = data.map(function (d) {
        for (var i in d){
            if (i!=='iso_code' && i!=='location' && i!=='date'){
                d[i] = Number(d[i]);
            }
        }
        if (d.total_cases>0 && d.total_cases>d.total_deaths) {
            d['Case-Fatality_Ratio'] = d.total_deaths / d.total_cases;
        }
        else{
            d['Case-Fatality_Ratio'] = 0;
        }
        d.continent_code = countryContinent[d.iso_code];
        return d;
    });
    var timeData = {};
    var countryData = {};
    var timeList = d3.map(data, d=>d.date).keys();
    timeList = timeList.sort();
    var countryList = [];
    for (var i in data){
        if (data[i].date===timeList[timeList.length-2]){
            countryList.push(data[i]);
        }
    }
    countryList.sort((a,b)=>b.total_cases-a.total_cases);
    countryList = countryList.map(d=>d.iso_code);
    for (var i in countryList){
        countryData[countryList[i]] = [];
    }
    for (var i in timeList){
        timeData[timeList[i]] = [];
    }
    data.map(function (d) {
        if (countryList.indexOf(d.iso_code)!==-1) {
            countryData[d.iso_code].push(d);
            timeData[d.date].push(d);
        } //排除了不及时更新的国家
    });
    var continentList = ['NA','AS', 'EU', 'AF', 'SA','OC','AN'];
    var continentName = {'NA':'北美','AS':'亚洲', 'EU':'欧洲', 'AF':'非洲', 'SA':'南美','OC':'大洋洲','AN':'北极洲'};
    var continentCountry = {};
    for (var i in continentList){
        continentCountry[continentList[i]] = [];
    }
    for (var i in countryList){
        var continent = countryContinent[countryList[i]];
        if (continentList.indexOf(continent)!==-1) {
            continentCountry[continent].push(countryList[i]);
        }
    }
    var category = ['total_cases', 'new_cases', 'total_deaths', 'Case-Fatality_Ratio','total_cases_per_million','new_cases_per_million','total_deaths_per_million'];

    //地图专用经纬数据
    var countryCode = $.ajax({url:'countryCode.csv', async: false}).responseText;
    countryCode = d3.csvParse(countryCode);
    var tmp = {};
    countryCode.map(function (d) {
        tmp[d['两字母代码']]=d['三字母代码'];
    });
    countryCode =tmp;
    var countryPosition = $.ajax({url: 'countryPosition.csv', async:false}).responseText;
    countryPosition = d3.csvParse(countryPosition);
    countryPosition = countryPosition.map(function (d) {
        d['country']=countryCode[d['country']];
        return d;
    });
    tmp = {};
    countryPosition.map(function (d) {
        tmp[d['country']] = d;
    });
    countryPosition = tmp;

    return {timeData: timeData, countryData: countryData, countryList: countryList, timeList: timeList, continentList: continentList,countryName: countryName, continentName:continentName, continentCountry:continentCountry, category:category, countryPosition: countryPosition, raw:data};
}