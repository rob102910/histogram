var datahistogram = d3.json("data.json");

datahistogram.then(function(data)
{
  drawGraph(data,1);
},
function(err)
{
  console.log(err);
})

var drawGraph = function(data,day)
{
  //put in updating graph stuff
  var screen =
 {
   width:500,
   height:500
 };
 var svg = d3.select("svg")
            .attr("width",screen.width)
            .attr("height",screen.height);

var margins =
{
top: 30,
bottom: 30,
left: 30,
right:30
};

var bars = 10;

var width = screen.width - margins.left - margins.right;
var height = screen.height - margins.top - margins.bottom;

var xScale = d3.scaleLinear()
            .domain([0,10])
            .nice()
            .range([0.,width]);

var binMaker = d3.histogram()
            .domain(xScale.domain())
            .thresholds(xScale.ticks(bars)); //might need to change ticks

var newArray = data.map(function(d)
{
  return d.quizes[day-1].grade;
})
console.log(newArray)

var bins = binMaker(newArray)
console.log(bins)

var max = d3.max(bins,function(d)
{
  return d.length
})

console.log(max)

//window.alert(bins)
//var percentage = function(d)
//{
//  return d.length/data.length
//}

var yScale = d3.scaleLinear()
               .domain([0,max])
               .range([height,0])
               .nice();

var colors = d3.scaleOrdinal(d3.schemeSet3);

var plot = svg.append("g")
                  .attr("transform","translate("+margins.left+","+margins.top+ ")");

plot.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x",function(d) {return xScale(d.x0);})
    .attr("width",width/bars)
    .attr("y",function(d) {return yScale(d.length)})
    .attr("height",function(d) {return height- yScale(d.length)})
    .attr("stroke","white")
    //.attr("fill",function(d){return colors(d.homework);})

var xAxis = d3.axisBottom()
              .scale(xScale)
              .ticks(10);

var yAxis = d3.axisLeft()
              .scale(yScale)
              .ticks(max);

svg.append("g")
   .attr("id", "xAxis")
   .call(xAxis)
   .attr("transform","translate("+(margins.left+xScale(0.5))+","+(height+margins.top)+")");
svg.append("g")
   .call(yAxis)
   .attr("transform","translate("+(margins.left+xScale(0.5))+","+margins.top+")");

}
