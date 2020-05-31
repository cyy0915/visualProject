# visualProject
可视化小组项目
## data说明：

在main.html中经过dataProcess(data)的globalData包含了大部分用于画图的数据，

data.timeList是一个array, 按顺序排列了数据中的所有日期，格式为'2020-3-14'

data.countryList是一个array, 按累计病例数的顺序排列了所有国家，ps：国家在程序中用三个字母的iso country code表示

data.timeData['2020-3-14']是一个array, 包含2020-3-14这一天所有国家的所有数据

data.countryData['USA']是一个array, 包含美国的所有日期的数据

data.continentList = ['NA','AS', 'EU', 'AF', 'SA','OC','AN']

data.countryName['USA']='美国' code对应中文名

data.continentName['NA']=北美 code对应中文名

data.continentCountry['NA']为北美所有国家的array

data.category=['total_cases', 'new_cases', 'total_deaths', 'incidence_rate','total_cases_per_million','new_cases_per_million','total_deaths_per_million']为作图所用数据类型，为owid-covid-data.csv中的部分字段

data.raw为经d3.csvParse(data)和部分string转number的原始数据

**PS: 全球总的数据暂未考虑和处理**

## 交互说明：

每个交互组件对应一个函数，写在globalInteractFunction.js中。为全局交互设置了一个全局变量interactPara, 包含countrySelect(array类型), time, recentSelect, continentSelect(array类型),category, countryFilter（array类型,记录确诊人数和死亡人数界定值,长度为2,0位为tota_cases,1位为tatal_deaths），interactPara初始化写在interactWidget.js中。
**PS:countrySelect、continentSelect的取消操作未完成，还要调试**

## 进度说明：
地图已初步完成，包括和时间轴和类别选择和国家选择的交互。


## 环形柱状图说明：
目前设置通过时间、类别选择器、人数控制、洲选择器传参控制，但发现洲选择器无法选择？？待调试；
交互方面，可以点击旋转；
新增对数坐标轴和排序方式选择；
新增放缩、拖拽移动；

## 平行坐标图说明：
平行图框架已搭好，上星期事情太多时间太少没有深入调试及添加内容，本周非常空闲，可以快速赶进度。

## 时序折线图说明：
时序折线图的基本框架已经确定，接下来的工作内容是调试控制器和数据筛选，添加互动功能。
之前忘了有整理好的data，接下来利用起这些数据能更快推进完成度。 SQY 2020.5.28
