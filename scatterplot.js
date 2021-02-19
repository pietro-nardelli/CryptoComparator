
var mydata = [];

// dimensions and margins
var margin_s = { top: 10, right: -300, bottom: 30, left: 100 },
      width_s = 460 - margin_s.left - margin_s.right,
      height_s = 400 - margin_s.top - margin_s.bottom;

var svgg = d3.select("#scatterplot")
      .append("svg")
      .attr("width", width_s + margin_s.left + margin_s.right)
      .attr("height", height_s + margin_s.top + margin_s.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin_s.left + "," + margin_s.top + ")");
var mydata = []

create_scatterplot()
function create_scatterplot() {
      d3v3.json("positions.json", function (data) {
            mydata = data

            var x = d3.scaleLinear()
                  .domain([-1, 3])
                  .range([0, width_s]);
            svgg.append("g")
                  .attr("transform", "translate(0," + height_s + ")")
                  .call(d3.axisBottom(x));

            var y = d3.scaleLinear()
                  .domain([-1, 2])
                  .range([height_s, 0]);
            svgg.append("g")
                  .call(d3.axisLeft(y));

            for (var i = 0; i < 100; i++) {
                  var g = svgg.append('g')

                  g.append("circle")
                        .attr("cx", x(data[i][0]))
                        .attr("cy", y(data[i][1]))
                        .attr("r", 2)
                        .style("fill", "#69b3a2")
                        .attr("id", i);
                  g.append("text")
                        .attr("x", x(data[i][0]))
                        .attr("y", y(data[i][1]))
                        .text(function () { return cryptonames[i] })
                        .style("fill", "rgba(255,255,255,0.2)")
                        .attr("id", i)
            };
      })

}
