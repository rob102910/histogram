var datahistogram = d3.json("data.json");

var screen =
{
 width:500,
 height:500
};
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

var colors = d3.scaleOrdinal(d3.schemeYlGnBu[0,9]);
// display days and change graph
var changeGraph = function(data){
var svg = d3.select("#day")
          .attr("width",screen.width+1000)
          .attr("height",screen.height-400);
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
      //  console.log(d.day)
        d3.select(this).attr("fill","#20639B")
          .attr("font-size","23px");
      })
      .on("mouseout",function(d){
        d3.select(this).attr("fill","black")
          .attr("font-size","16px")
      })
      .on("click",function(d,i){
        datahistogram.then(function(data){
        update(data,i)} //day (i+1) - index i
      )})

}

//draw initial graph day 1
var drawGraph = function(data,day)
{

var svg = d3.select("#graph")
            .attr("width",screen.width+1000)
            .attr("height",screen.height+800);

var binMaker = d3.histogram()
            .domain(xScale.domain())
            .thresholds(xScale.ticks(bars)); //might need to change ticks

var newArray = data.map(function(d)
{
  return d.quizes[day].grade;
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
var yScale = d3.scaleLinear()
               .domain([0,max])
               .range([height,0])
               .nice();

var plot = svg.append("g")
              .attr("transform","translate("+margins.left+","+margins.top+ ")")
              .attr("id","initial");
//rects
plot.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
  //  .select("#initial").selectAll("rect")
  //  .data(bins)
    .attr("x",function(d) {return xScale(d.x0)+50;})
    .attr("width",width/bars)
    .attr("y",function(d) {return yScale(d.length)+150})
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

d3.select("#graph").append("g")
  .attr("id", "displayDay")
  .append("text")
  .attr("x",40)
  .attr("y",40)
  .text("Day 1")


var xAxis = d3.axisBottom()
              .scale(xScale)
              .ticks(10);

var yAxis = d3.axisLeft()
              .scale(yScale)
              .ticks(max);

d3.select("#graph").append("g")
   .attr("id", "xAxis")
   .call(xAxis)
   .attr("transform","translate("+(margins.left+50)+","+(height+150+margins.top)+")");
d3.select("#graph").append("g")
   .attr("id","yAxis")
   .call(yAxis)
   .attr("transform","translate("+(margins.left+50)+","+(150+margins.top)+")");

}

//update graph function
var update = function(data,day){
  var binMaker = d3.histogram()
              .domain(xScale.domain())
              .thresholds(xScale.ticks(bars)); //might need to change ticks

  var newArray = data.map(function(d)
  {
    return d.quizes[day].grade;
  })
  //console.log(newArray)

  var bins = binMaker(newArray)
  //console.log(bins)

  var max = d3.max(bins,function(d)
  {
    return d.length
  })
  var yScale = d3.scaleLinear()
                 .domain([0,max])
                 .range([height,0])
                 .nice();
  d3.select("#initial")
    .selectAll("rect")
    .data(bins)
    .transition()
    .ease(d3.easeBounce)
    .duration(1000)
    .attr("x",function(d) {return xScale(d.x0)+50;})
    .attr("width",width/bars)
    .attr("y",function(d) {return yScale(d.length)+100})
    .attr("height",function(d) {return height- yScale(d.length)})

    var xAxis = d3.axisBottom()
                  .scale(xScale)
                  .ticks(10);

    var yAxis = d3.axisLeft()
                  .scale(yScale)
                  .ticks(max);

    d3.select("#xAxis") //select the old axis and then make change
       .call(xAxis)
       .attr("transform","translate("+(margins.left+50)+","+(height+100+margins.top)+")")
       .transition()
       .duration(700);
    d3.select("#yAxis")
       .call(yAxis)
       .attr("transform","translate("+(margins.left+50)+","+(100+margins.top)+")")
       .transition()
       .duration(700);

    d3.select("#displayDay")
      .selectAll("text")
      .text("Day "+(data[1].quizes[day].day))
    // console.log(data[1].quizes[1].day)
}

//call the initial function to draw day 1
datahistogram.then(function(data,day){
  drawGraph(data,0);
});
//call the timeline function to draw days and trigger updata
datahistogram.then(function(data)
{
  changeGraph(data);
},
function(err)
{
  console.log(err);
})
