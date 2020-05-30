/*
drawRadialStackedBarChart([4,4,3,2,1,5,8,7,6,7,4,6,5,9,4,5,6,7,5,9,5,6,8,6],
    ["这个","中国","阿尔及利亚12345","10","10","10",
    "10","10","10","10","10","10",
    "10","10","10","10","10","10",
    "10","10","10","10","10","10"],[["大洋洲",2],["亚洲",7],["北美洲",14],["欧洲",20],["非洲",24]]);
    */
function compare(v1,v2){
  return v1.value-v2.value;
}

function changeRadial(){
    var data=globalData.timeData[interactPara.time],category=interactPara.category,
    sel=["AS", "AF", "EU", "SA"],up=[500,500];
    
  var dataSet=[],num=["NA","AS","AF","EU","SA","AN","OC"];//["北美","亚洲","欧洲","非洲","南美","大洋洲","北极洲"];
   
  for (var i=0;i<data.length-1;++i){
    if (sel.indexOf(data[i].continent_code)!=-1&&data[i].total_cases>up[0]&&data[i].total_deaths>up[1]){
      var tmp={};
      tmp.value=data[i][category];
      tmp.area=data[i].location;
      tmp.continent=data[i].continent_code;
      dataSet.push(tmp);       
    }
  }
    
  if (document.getElementById("num").checked) dataSet.sort(compare);
  else if (document.getElementById("area").checked){
    var dataTotal=[],dataTmp=[];
    for (var i=0;i<sel.length;++i){
      dataTmp=[];
      for (var j=0;j<dataSet.length;++j){
        if (dataSet[j].continent==sel[i]) dataTmp.push(dataSet[j]);
      }
      dataTmp.sort(compare);
      dataTotal=dataTotal.concat(dataTmp);
    }
    dataSet=dataTotal;
  }

  var flag;
  if (document.getElementById("log").checked) flag=1;
  else flag=0;

  var s=d3.select("#NO3");
  s.remove();
  drawRadialStackedBarChart(dataSet,num,flag);
}

function drawRadialStackedBarChart(dataSet,num,flag){
    var width=parseInt(d3.select("#graph3").style("width")),
    height=parseInt(d3.select("#graph3").style("height"));
    var svg = d3.select("#graph3")
        .append("svg")
        .attr("id","graph3")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                
    var innerRadius = 180,
    outerRadius = Math.min(width, height) / 2-30;

var x = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(dataSet.map(function(d,i){return d.area;}))

var y;
if (flag){
      y = d3.scaleLog()
      .range([innerRadius, outerRadius])
      .domain([1,d3.max(dataSet,function(d){return d.value;})])
    }
    else{
      y = d3.scaleLinear()
      .range([innerRadius, outerRadius])
      .domain([0,d3.max(dataSet,function(d){return d.value;})])
    }

var z = d3.scaleOrdinal()
    .range(['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80','#8d98b3', '#e5cf0d'])
    .domain([0,7])
/*
  var yAxis = svg.append("g")
    .attr("text-anchor", "middle");

  var yTick = yAxis
    .selectAll("g")
    .data([0,10,100,1000])
    .enter().append("g");

  yTick.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("r", y);

  yTick.append("text")
      .attr("y", function(d) { return -y(d); })
      .attr("dy", "0.35em")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 5)
      .text(y.tickFormat(5, "s"));

  yTick.append("text")
      .attr("y", function(d) { return -y(d); })
      .attr("dy", "0.35em")
      .text(y.tickFormat(5, "s"));
*/
  var legend = svg.append("g")
    .selectAll("g")
    .data(num)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(-40," + (i - (num.length - 1) / 2) * 20 + ")"; });

  legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", function(d,i){return z(i);});

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text(function(d) { return d; });

  svg.append("g")
    .attr("id","g1")
    .selectAll("path")
    .data(dataSet)
    .enter()
    .append("path")
      .attr("fill",function(d){return z(num.indexOf(d.continent));})
      .attr("id",function(d){return d.area;})
      .attr("d", d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return y(d.value); })
          .startAngle(function(d) { return x(d.area)-x.bandwidth()/2; })
          .endAngle(function(d) { return x(d.area)+x.bandwidth()/2; })
          .padAngle(0.01)
          .padRadius(innerRadius))
      .on("click",function(){
        var index=x(this.id);
        d3.select("#g1").attr("transform","rotate(-"+ (index * 180 / Math.PI) +")")
        d3.select("#g2").attr("transform","rotate(-"+ (index * 180 / Math.PI) +")")
        d3.select("#g3").attr("transform","rotate(-"+ (index * 180 / Math.PI) +")")
      })
      .on("mouseover",function(){d3.select(this).attr("stroke", "black")})
      .on("mouseout",function(){d3.select(this).attr("stroke", "none")})
        

    var label = svg.append("g")
      .attr("id","g2")
      .selectAll("g")
        .data(dataSet)
      .enter().append("g")
      .attr("text-anchor", "right")
        .attr("transform", function (d) {
          return "rotate(" + (x(d.area) * 180 / Math.PI-90) + ")translate(" + innerRadius + ",0)";
      });


    label.append("text")
      .attr("transform", "rotate(180)translate(25,0)")
      .text(function (d) {
          return d.area;
        })
      .attr("fill", "black")
      .style("font-size", "12px");

      svg.append("g")
      .attr("id","g3")
      .selectAll("g")
      .data(dataSet)
      .enter()
      .append("g")
        .attr("text-anchor", "middle")//function(d,i) { return (x(i) + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + (x(d.area)* 180 / Math.PI - 90) + ")"+"translate(" + (y(d.value)+5) + ",0)"; })
      .append("text")
        .text(function(d){return d.value;})
        .attr("transform",  "rotate(90)")
        .style("font-size", "10px")
        .attr("alignment-baseline", "middle")

  
     
}
