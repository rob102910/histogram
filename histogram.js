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
top: 10,
bottom: 10,
left: 10,
right:10
};
var width = screen.width - margins.left - margins.right;
var height = screen.height - margins.top - margins.bottom;

var xScale = d3.scaleLinear()
            .domain([0,10])
            .nice()
            .range([0.,width]);

var binMaker = d3.histogram()
            .domain(xScale.domain())
            .thresholds(xScale.ticks(5)); //might need to change ticks

var newArray = data.map(function(d)
{
  return d.quizes[day-1].grade;
})
console.log(newArray)

var bins = binMaker(newArray)
window.alert(bins)
//var percentage = function(d)
//{
//  return d.length/data.length
//}

var yScale = d3.scaleLinear()
               .domain([0,23])
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
    .attr("width",function(d){return xScale(d.x1-.1) - xScale(d.x0);})
    .attr("y",function(d) {return yScale(d.length)})
    .attr("height",function(d) {return height- yScale(d.length)})
    //.attr("fill",function(d){return colors(d.homework);})

var xAxis = d3.axisBottom()
              .scale(xScale)
              .ticks(30);

var yAxis = d3.axisLeft()
              .scale(yScale)
              .ticks(50);
}
