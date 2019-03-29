var datahistogram = d3.json("data.json");

var screen =
{
 width:500,
 height:500
};


var changeGraph = function(data){
// display days and change graph
var svg = d3.select("#day")
          .attr("width",screen.width+1000)
          .attr("height",screen.height-450);
var newplot = d3.select("svg")
                .append("g")
                .attr("class","days")
       .selectAll("text")
       .data(data[1].quizes)
       .enter()
       .append("text")
       .text(function(d,i)
    {
      return d.day;
    })
      .attr("x", function(d,i){
        return i*30
      })
      .attr("y",50)
      .on("mouseover",function(d){
        console.log(d.day)
        d3.select(this).attr("fill","orange")
          .attr("font-size","23px");
      })
      .on("mouseout",function(d){
        d3.select(this).attr("fill","black")
          .attr("font-size","16px")
      })
      .on("click",function(d){
        datahistogram.then(function(data){
        drawGraph(data,d.day)}
      )})

}

//draw graph
var drawGraph = function(data,day)
{

var svg = d3.select("#graph")
            .attr("width",screen.width+1000)
            .attr("height",screen.height+1000);

var margins =
{
top: 30,
bottom: 30,
left: 30,
right:30
};

var bars = 11;

var width = screen.width - margins.left - margins.right;
var height = screen.height - margins.top - margins.bottom;

var xScale = d3.scaleLinear()
            .domain([0,11])
            .nice()
            .range([0.,width]);

var binMaker = d3.histogram()
            .domain(xScale.domain())
            .thresholds(xScale.ticks(bars)); //might need to change ticks

var newArray = data.map(function(d)
{
  return d.quizes[day-1].grade;
})
//console.log(newArray)

var bins = binMaker(newArray)
//console.log(bins)

var max = d3.max(bins,function(d)
{
  return d.length
})

//console.log(max)

//window.alert(bins)
//var percentage = function(d)
//{
//  return d.length/data.length
//}

var yScale = d3.scaleLinear()
               .domain([0,max])
               .range([height,0])
               .nice();

var colors = d3.scaleOrdinal(d3.schemeYlGnBu[0,9]);

var plot = svg.append("g")
              .attr("transform","translate("+margins.left+","+margins.top+ ")");

//rects
plot.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x",function(d) {return xScale(d.x0)+50;})
    .attr("width",width/bars)
    .attr("y",function(d) {return yScale(d.length)+100})
    .attr("height",function(d) {return height- yScale(d.length)})
    .attr("stroke","white")
    .attr("fill",function(d){return colors(d);})
    .on("mouseover", function(d,i) {
       // console.log(d3.select(this).attr("x"))
    					//Get this bar's x/y values, then augment for the tooltip
    					var xPosition = parseFloat(d3.select(this).attr("x")) + width/bars / 2;
    					var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

    					//Update the tooltip position and value
    					d3.select("#tooltip")
    						.style("left", xPosition + "px")
    						.style("top", yPosition + "px")
    						.select("#value")
                .text(d.length)
              d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .select("#grade")
                .text(d[0])

    					//Show the tooltip
    					d3.select("#tooltip").classed("hidden", false);

    			   })
    .on("mouseout", function() {

    					//Hide the tooltip
    					d3.select("#tooltip").classed("hidden", true);

            })


var xAxis = d3.axisBottom()
              .scale(xScale)
              .ticks(10);

var yAxis = d3.axisLeft()
              .scale(yScale)
              .ticks(max);

svg.append("g")
   .attr("id", "xAxis")
   .call(xAxis)
   .attr("transform","translate("+(margins.left+50)+","+(height+100+margins.top)+")");
svg.append("g")
   .call(yAxis)
   .attr("transform","translate("+(margins.left+50)+","+(100+margins.top)+")");

}

datahistogram.then(function(data)
{
  changeGraph(data);
},
function(err)
{
  console.log(err);
})
