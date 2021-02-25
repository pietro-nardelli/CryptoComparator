
var mydata = [];

// dimensions and margins
var margin_s = { top: 10, right: 50, bottom: 30, left: 100 },
      width_s = 650 - margin_s.left - margin_s.right,
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

fontsize = "24px"
create_scatterplot(null,null,"mds")

function create_scatterplot(name1=null,name2=null,dim_red="pca") {
      svgg.selectAll("*").remove(); 

      if(dim_red=="mds") var path="mds_positions.json"
      else if(dim_red="pca") var path="pca_positions.json"



      d3v3.json(path, function (data) {
            
            
            if(dim_red=="mds"){
                  var x = d3.scaleLinear()
                  .domain([-0.5, 0.5])
                  .range([0, width_s]);

            svgg.append("g")
                  .attr("transform", "translate(0," + height_s + ")")
                  .call(d3.axisBottom(x).ticks(10)).selectAll("text").attr('fill', 'white');


                  var y = d3.scaleLinear()
                  .domain([-0.6, 0.6])
                  .range([height_s, 0]);
            svgg.append("g")
                  .call(d3.axisLeft(y).ticks(10)).selectAll("text").attr('fill', 'white');
            }

            else if(dim_red=="pca"){
                  var x = d3.scaleLinear()
                  .domain([-5, 14])
                  .range([0, width_s]);

            svgg.append("g")
                  .attr("transform", "translate(0," + height_s + ")")
                  .call(d3.axisBottom(x).ticks(10)).selectAll("text").attr('fill', 'white');

                  var y = d3.scaleLinear()
                  .domain([-5, 15])
                  .range([height_s, 0]);
            svgg.append("g")
                  .call(d3.axisLeft(y).ticks(10)).selectAll("text").attr('fill', 'white');
            }


            if(name1 == null && name2 == null){

                  for (var i = 0; i < 100; i++) {
                        let g = svgg.append('g')
                        let crypto_name = cryptonames[i]
                        let name_x = x(data[i][0])+10
                        let name_y = y(data[i][1])

                        var dot = g.append("circle")
                              .attr("cx", x(data[i][0]))
                              .attr("cy", y(data[i][1]))
                              .attr("r", 4)
                              .style("fill", "#FF6600")
                              .attr("id", crypto_name)
                              .on('mouseover', 
                        function (d,i) {
                              d3.select(this).transition().duration('100').attr("r", 11);
                              g.append("text")
                              .text(crypto_name)
                              .attr("x", name_x)
                              .attr("y", name_y)
                              .attr("font_family", "sans-serif")  // Font type
                              .attr("font-size", fontsize)  // Font size
                              .attr("fill", "white") 
                              .attr("opacity", "1.0")
                        })
      
      
                        .on('mouseout', function (d) {
                              d3.select(this).transition().duration('200').attr("r", 4);
                              g.selectAll("text").remove()

                              })
                        //dot.on("click", createSingleGraphsOfMyCrypto(crypto_name));

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

                        }
                  else{

                        let g = svgg.append('g')
                        let crypto_name = cryptonames[i]
                        let name_x = x(data[i][0])+10
                        let name_y = y(data[i][1])

                        g.append("text")
                              .text(crypto_name)
                              .attr("x", name_x)
                              .attr("y", name_y)
                              .attr("font_family", "sans-serif")  // Font type
                              .attr("font-size", fontsize)  // Font size
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
                        })
                        //dot.on("click", createSingleGraphsOfMyCrypto(crypto_name));


                        
                  }
                  

                  };
      

          }


            


      })

}

// names_array_test = ["Siacoin", "DigiByte", "BitcoinDark", "GameCredits", "GXShares", "Lykke",
// "Dogecoin", "Blocknet", "Syscoin", "Verge", "FirstCoin", "Nxt", "I-O Coin", "Ubiq", "Particl",
// "NAV Coin", "Rise", "Vertcoin", "Bitdeal", "FairCoin", "Metaverse ETP", "Gulden",]

//create_scatterplot_from_graph(names_array_test)

function create_scatterplot_from_graph(name_array,dim_red="pca") {
svgg.selectAll("*").remove(); 
if(dim_red=="mds") var path="mds_positions.json"
else if(dim_red="pca") var path="pca_positions.json"



d3v3.json(path, function (data) {
      
      
      if(dim_red=="mds"){
            var x = d3.scaleLinear()
            .domain([-0.5, 0.5])
            .range([0, width_s]);

      svgg.append("g")
            .attr("transform", "translate(0," + height_s + ")")
            .call(d3.axisBottom(x).ticks(10)).selectAll("text").attr('fill', 'white');


            var y = d3.scaleLinear()
            .domain([-0.6, 0.6])
            .range([height_s, 0]);
      svgg.append("g")
            .call(d3.axisLeft(y).ticks(10)).selectAll("text").attr('fill', 'white');
      }

      else if(dim_red=="pca"){
            var x = d3.scaleLinear()
            .domain([-5, 14])
            .range([0, width_s]);

      svgg.append("g")
            .attr("transform", "translate(0," + height_s + ")")
            .call(d3.axisBottom(x).ticks(10)).selectAll("text").attr('fill', 'white');

            var y = d3.scaleLinear()
            .domain([-5, 15])
            .range([height_s, 0]);
      svgg.append("g")
            .call(d3.axisLeft(y).ticks(10)).selectAll("text").attr('fill', 'white');
      }

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

      if(!bool){//grigi

            var g = svgg.append('g').attr("id", i)
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

            let g = svgg.append('g').attr("id", i)
            let crypto_name = cryptonames[i]
            let name_x = x(data[i][0])+10
            let name_y = y(data[i][1])


            var dot = g.append("circle")
                  .attr("cx", x(data[i][0]))
                  .attr("cy", y(data[i][1]))
                  .attr("r", 4)
                  .style("fill", i==cryptonames.indexOf(name_array.slice().pop())? "yellow" : "#FF6600")
                  .attr("id", crypto_name)
                  .attr("opacity", "1.0")
                  .on('mouseover', 
            function (d,i) {
                  d3.select(this).transition().duration('100').attr("r", 11);
                  g.append("text")
                  .text(crypto_name)
                  .attr("x", name_x)
                  .attr("y", name_y)
                  .attr("font_family", "sans-serif")  // Font type
                  .attr("font-size", fontsize)  // Font size
                  .attr("fill", "white") 
                  .attr("opacity", "1.0")



                  

            })


            .on('mouseout', function (d) {
                  d3.select(this).transition().duration('200').attr("r", 4);
                  g.selectAll("text").remove()

            })
            //dot.on("click", createSingleGraphsOfMyCrypto(crypto_name));

            }


      };





            


      })

}
