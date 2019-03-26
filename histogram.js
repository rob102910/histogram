var datahistogram = d3.json("data.json");

datahistogram.then(function(data)
{
  drawGraph(data,2);
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

var xScale = d3.scalelinear()
            .domain(d3.extent(data))
            .nice()
            .range([0.,width]);

var binMaker = d3.histogram()
            .domain(xScale.domain())
            .threshold(xScale.ticks(50)); //might need to change ticks

var percentage = function(d)
{
  return d.length/data.length
}

var yScale = d3.scalelinear()
            .domain([0,d3.max(bins,function(d){return percentage(d);})])
              .range([height,0])
              .nice();

var colors = d3.scaleOrdinal(d3.schemeSet3);

var histoLand = svg.append("g")
                  .attr("transform","translate("+margins.left+","+margins.top+ ")");



}
