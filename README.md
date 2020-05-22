# visualProject
可视化小组项目
data说明：

在main.html中经过dataProcess(data)的data包含了大部分用于画图的数据，

data.timeList是一个array, 按顺序排列了数据中的所有日期

data.countryList是一个array, 按累计病例数的顺序排列了所有国家，ps：国家在程序中用三个字母的iso country code表示

data.timeData['2020-3-14']是一个array, 包含2020-3-14这一天所有国家的所有数据

data.countryData['USA']是一个array, 包含美国的所有日期的数据

data.continentList = ['NA','AS', 'EU', 'AF', 'SA','OC','AN']

data.countryName['USA']='美国' code对应中文名

data.continentName['NA']=北美 code对应中文名

data.continentCountry['NA']为北美所有国家的array

data.category=['total_cases', 'new_cases', 'total_deaths', 'incidence_rate','total_cases_per_million','new_cases_per_million','total_deaths_per_million']为作图所用数据类型，为owid-covid-data.csv中的部分字段

data.raw为经d3.csvParse(data)和部分string转nuber的原始数据



