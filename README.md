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

每个交互组件对应一个函数，写在globalInteractFunction.js中。
为全局交互设置了一个全局变量interactPara, 包含countrySelect(array类型), time, recentSelect, continentSelect(array类型),category, countryFilter（array类型,记录确诊人数和死亡人数界定值,长度为2,0位为total_cases,1位为total_deaths），interactPara初始化写在interactWidget.js中。

国家和大洲的选择区域，点击暂时无视觉效果，tag都是ul,li, 有待ui优化

## UI设计：
各区域占比面积完毕，以全屏（F11）（1920\*1080）为最佳显示效果。

字体采用思源黑体、思源宋体。

考虑目前电子展示多以黑底科技风格为主，因此反其道而行，整体色调取白底蓝图。~~*但是为什么画来画去还是这么丑~~

-- SQY 2020.6.12

## 地图说明：
地图已初步完成，包括和时间轴和类别选择和国家选择的交互。


## 环形柱状图说明：
目前设置通过时间、类别选择器、人数控制、洲选择器传参控制，交互基本全部完成；

交互方面，可以点击旋转；
新增对数坐标轴和排序方式选择；
新增放缩、拖拽移动；

## 平行坐标图说明：
平行坐标图绘制已调试完毕。
目前可通过通过时间、类别选择器、人数控制、洲选择器传参控制。
交互包括放缩、拖拽移动。
点击对应线段可以显示国家。

待添加：国家选择对应线段高亮。

## 拟合说明：
拟合部分基于Python在本地做好了，目前在考虑调试如何使用。完成后更新说明文档。

## 时序折线图说明：
时序折线图单线绘制、互动已经调试完毕。

\>\> 点击国家添加/删除对应折线，自适应以列表第一个国家为准。

\>\> 点击类别选项切换获取数据类别。

\>\> 在图中拖选部分可进行x轴方向的放大，双击区域恢复原本图样。切换数据类别自动恢复标准大小。

-- SQY 2020.6.12
