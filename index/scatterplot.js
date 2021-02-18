
var mydata = [];


// dimensions and margins
var margin = {top: 10, right: -300, bottom: 30, left: 100},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svgg = d3.select("#scatterplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var mydata= []

create_scatterplot()
function create_scatterplot() {
      d3v3.json("positions.json", function(data) {
            mydata= data

          var x = d3.scaleLinear()
            .domain([-2, 15])
            .range([ 0, width ]);
          svgg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
          var y = d3.scaleLinear()
            .domain([-10, 8])
            .range([ height, 0]);
          svgg.append("g")
            .call(d3.axisLeft(y));
        
          for(var i = 0; i<100; i++){
              var g = svgg.append('g')

              g.append("circle")
                .attr("cx",  x(data[i][0]) )
                .attr("cy",  y(data[i][1]) )
                .attr("r", 2)
                .style("fill", "#69b3a2")
                .attr("id",i);
              g.append("text")
                  .attr("x",  x(data[i][0]) )
                  .attr("y",  y(data[i][1]) )
                   .text(function(d) { return cryptonames[i] })
                   .style("fill","rgba(255,255,255,0)")
                   .attr("id",i)
              };
        })
 
}
