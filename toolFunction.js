function getSpecificData(country, time) {
    var tmp = globalData.timeData[time];
    for (var i in tmp){
        if (tmp[i].iso_code === country){
            return tmp[i];
        }
    }
    return undefined;
}