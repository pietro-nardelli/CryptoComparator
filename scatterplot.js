
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
var window_color = "rgb(2, 200, 255)"


//create_scatterplot()

function create_scatterplot(name1=null,name2=null) {
      svgg.selectAll("*").remove(); 


      d3v3.json("mds_positions.json", function (data) {
            
            
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


            if(name1 == null && name2 == null){

                  for (var i = 0; i < 100; i++) {
                        var g = svgg.append('g')
                        let crypto_name = cryptonames[i]

                              g.append("text")
                              .text(crypto_name)
                              .attr("x", x(data[i][0]+5))
                              .attr("y", y(data[i][1]))
                              .attr("font_family", "sans-serif")  // Font type
                              .attr("font-size", "11px")  // Font size
                              .attr("fill", "white") 
                              .attr("opacity", "1.0")
                              .attr("hidden", true)

                        var dot = g.append("circle")
                              .attr("cx", x(data[i][0]))
                              .attr("cy", y(data[i][1]))
                              .attr("r", 4)
                              .style("fill", "#69b3a2")
                              .attr("id", crypto_name)
                              .on('mouseover', 
                        function (d,i) {
                              d3.select(this).transition().duration('100').attr("r", 11);
                              div.transition().duration(100).style("opacity", 1);
                              div.html(crypto_name).style("left", (d3.event.pageX+45) + "px").style("top", (d3.event.pageY+20 ) + "px");
                        })
      
      
                        .on('mouseout', function (d) {
                              d3.select(this).transition().duration('200').attr("r", 4);
                             // div.transition().duration(100).style("opacity", "0");

                              g.style("opacity", "0.0")



                              });
                        
                        
      
                  };

            }
            else if(name1 != null && name2 != null){

                  for(i=0; i<100; i++){
                        if(name1==cryptonames[i]){
                              index_crypto_name1 = i
                        }
                        if(name2==cryptonames[i]){
                              index_crypto_name2 = i
                        }
                  }

                  for (var i = 0; i < 100; i++) {

                  if(i!=index_crypto_name1 && i!=index_crypto_name2){
                        var g = svgg.append('g')
                        let crypto_name = cryptonames[i]

                        var dot = g.append("circle")
                              .attr("cx", x(data[i][0]))
                              .attr("cy", y(data[i][1]))
                              .attr("r", 4)
                              .style("fill", "#808080")
                              .attr("id", crypto_name)
                              .attr("opacity", "0.2")
                        //       .on('mouseover', 

                        // function (d,i) {
                        //       d3.select(this).transition().duration('100').attr("r", 11);

                        //       div.transition().duration(100).style("opacity", 1);
                        //       div.html(crypto_name).style("left", (d3.event.pageX+45) + "px").style("top", (d3.event.pageY+20 ) + "px");
                        // })


                        // .on('mouseout', function (d) {
                        //       d3.select(this).transition().duration('200').attr("r", 2);
                        //       div.transition().duration(100).style("opacity", "0");

                        //       g.style("opacity", "0.0")

                        // });

                        }
                  else{

                        var g = svgg.append('g')
                        let crypto_name = cryptonames[i]

                        g.append("text")
                              .text(crypto_name)
                              .attr("x", x(data[i][0])+10)
                              .attr("y", y(data[i][1]))
                              .attr("font_family", "sans-serif")  // Font type
                              .attr("font-size", "14px")  // Font size
                              .attr("fill", "white") 
                              .attr("opacity", "1.0")
                              .attr("hidden", true)

                        var dot = g.append("circle")
                              .attr("cx", x(data[i][0]))
                              .attr("cy", y(data[i][1]))
                              .attr("r", 4)
                              .style("fill", "#FF6600")
                              .attr("id", crypto_name)
                              .attr("opacity", "1.0")
                              .on('mouseover', 
                        function (d,i) {
                              d3.select(this).transition().duration('100').attr("r", 11);

                        })


                        .on('mouseout', function (d) {
                              d3.select(this).transition().duration('200').attr("r", 4);
                              g.style("opacity", "0.0")
                        });

                        
                  }
                  

                  };
      

          }


            


      })

}

// names_array_test = ["Siacoin", "DigiByte", "BitcoinDark", "GameCredits", "GXShares", "Lykke",
// "Dogecoin", "Blocknet", "Syscoin", "Verge", "FirstCoin", "Nxt", "I-O Coin", "Ubiq", "Particl",
// "NAV Coin", "Rise", "Vertcoin", "Bitdeal", "FairCoin", "Metaverse ETP", "Gulden",]

//create_scatterplot_from_graph(names_array_test)

function create_scatterplot_from_graph(name_array) {
svgg.selectAll("*").remove(); 


d3v3.json("mds_positions.json", function (data) {
      
      
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

      var index_array = []

      for(i=0; i<name_array.length; i++){
            for(j=0;j<cryptonames.length;j++){
                  if(name_array[i]==cryptonames[j]){
                        index_array.push(j)
                        break
                  }
            }
      }

for (var i = 0; i < 100; i++) {

      bool = index_array.includes(i)

      if(!bool){
            var g = svgg.append('g')
            let crypto_name = cryptonames[i]

            var dot = g.append("circle")
                  .attr("cx", x(data[i][0]))
                  .attr("cy", y(data[i][1]))
                  .attr("r", 4)
                  .style("fill", "#808080")
                  .attr("id", crypto_name)
                  .attr("opacity", "0.2")

            }
      else{

            var g = svgg.append('g')
            let crypto_name = cryptonames[i]

            g.append("text")
                  .text(crypto_name)
                  .attr("x", x(data[i][0])+10)
                  .attr("y", y(data[i][1]))
                  .attr("font_family", "sans-serif")  // Font type
                  .attr("font-size", "14px")  // Font size
                  .attr("fill", "white") 
                  .attr("opacity", "1.0")
                  .attr("hidden", true)

            var dot = g.append("circle")
                  .attr("cx", x(data[i][0]))
                  .attr("cy", y(data[i][1]))
                  .attr("r", 4)
                  .style("fill", "#FF6600")
                  .attr("id", crypto_name)
                  .attr("opacity", "1.0")
                  .on('mouseover', 
            function (d,i) {
                  d3.select(this).transition().duration('100').attr("r", 11);

            })


            .on('mouseout', function (d) {
                  d3.select(this).transition().duration('200').attr("r", 4);
                  g.style("opacity", "0.0")
            });

            
            }


      };





            


      })

}
