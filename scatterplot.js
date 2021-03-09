
var mydata = [];
var kind_dim = "mds"
var global_arr_names = []

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
var window_color = color1
var dot_color = color2

fontsize = "24px"
create_scatterplot(null,null,kind_dim)

d3.select("#dim_reduction_selection_dropdown").on("change", function() {

      kind_dim = this.value;
      //crypto_name_matrix1 crypto_name_matrix2

      if(already_draw){
            
            if(single_chart){
                  if(global_arr_names.length!=0){
                        create_scatterplot_from_graph(global_arr_names,kind_dim)
                  }
                  else{
                        create_scatterplot(null,null,kind_dim)

                  }
            } 
            else create_scatterplot(crypto_name_matrix1,crypto_name_matrix2,kind_dim)
      }
      else{
            create_scatterplot(null,null,kind_dim)
      }
    });


function create_scatterplot(name1=null,name2=null,dim_red=kind_dim) {
      svgg.selectAll("*").remove(); 
      var Box = svgg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 2*width-360)
      .attr("height", height-69)
      .attr("fill", window_color)
      .attr("opacity", 0.1);
      global_arr_names = []

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
                              .style("fill", dot_color)
                              .style("stroke","black").style("stroke-width","2px")
                              .attr("id", crypto_name)
                              .on("click", function(d,i){
                                    clicked_graph = false
                                    createSingleGraphsOfMyCrypto(crypto_name)
                                    highlight_subgraph_from_scatterplot(crypto_name)
                                    last_clicked_scatterplot = crypto_name
                              })
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

                  };

            }
            else if(name1 != null && name2 != null){
                  var index_cryptoarr = []

                  for(i=0; i<100; i++){
                        if(name1==cryptonames[i]){//row name
                              index_crypto_name1 = i
                              index_cryptoarr.push(index_crypto_name1)
                        }
                  }
                  for(i=0; i<100; i++){
                        if(name2==cryptonames[i]){//column name
                              index_crypto_name2 = i
                              index_cryptoarr.push(index_crypto_name2)
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
                  };


                  for(i=0;i<index_cryptoarr.length;i++){

                        let g = svgg.append('g')
                        let crypto_name = cryptonames[[index_cryptoarr[i]]]
                        let name_x = x(data[index_cryptoarr[i]][0])+10
                        let name_y = y(data[index_cryptoarr[i]][1])

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
                              .attr("cx", x(data[index_cryptoarr[i]][0]))
                              .attr("cy", y(data[index_cryptoarr[i]][1]))
                              .attr("r", 4)
                              .style("fill",i==0? dot_color : window_color) //primo arancio,secondo azz
                              .attr("id", crypto_name)
                              .attr("opacity", "1.0")
                              .style("stroke","black").style("stroke-width","2px")
                              .on("click", function(d,i){
                                    clicked_graph = false
                                    createSingleGraphsOfMyCrypto(crypto_name)
                                    highlight_subgraph_from_scatterplot(crypto_name)
                                    last_clicked_scatterplot = crypto_name

                              })
                              .on('mouseover', 
                        function (d,i) {
                              d3.select(this).transition().duration('100').attr("r", 11);

                        })


                        .on('mouseout', function (d) {
                              d3.select(this).transition().duration('200').attr("r", 4);
                        })

                  }

            name1=name2=null
          }


            


      })

}


function create_scatterplot_from_graph(name_array,dim_red=kind_dim) {

global_arr_names = name_array

svgg.selectAll("*").remove(); 
var Box = svgg.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", 2*width-360)
.attr("height", height-69)
.attr("fill", window_color)
.attr("opacity", 0.1);
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
            };
      
            
      for(i=0;i<index_array.length;i++){
            if(index_array[i]==cryptonames.indexOf(name_array.slice().pop())) continue

            var i_ = index_array[i]

            let g = svgg.append('g').attr("id", i_)
            let crypto_name = cryptonames[i_]
            let name_x = x(data[i_][0])+10
            let name_y = y(data[i_][1])


            var dot = g.append("circle")
                  .attr("cx", x(data[i_][0]))
                  .attr("cy", y(data[i_][1]))
                  .attr("r", 4)
                  .style("fill", dot_color)
                  .attr("id", crypto_name)
                  .attr("opacity", "1.0")
                  .style("stroke","black").style("stroke-width","2px")
                  .on("click", function(d,i){
                        clicked_graph = false
                        createSingleGraphsOfMyCrypto(crypto_name)
                        highlight_subgraph_from_scatterplot(crypto_name)
                        last_clicked_scatterplot = crypto_name

                  })
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

            }



      i_yellow = cryptonames.indexOf(name_array.slice().pop())
      
      var g = svgg.append('g').attr("id", cryptonames.indexOf(name_array.slice().pop()))
      var crypto_name = cryptonames[i_yellow]
      var name_x = x(data[i_yellow][0])+10
      var name_y = y(data[i_yellow][1])


      var dot = g.append("circle")
            .attr("cx", x(data[i_yellow][0]))
            .attr("cy", y(data[i_yellow][1]))
            .attr("r", 4)
            .style("fill", window_color)
            .attr("id", crypto_name)
            .attr("opacity", "1.0")
            .style("stroke","black").style("stroke-width","2px")
            .on("click", function(d,i){
                  clicked_graph = false
                  createSingleGraphsOfMyCrypto(crypto_name)
                  highlight_subgraph_from_scatterplot(crypto_name)
                  last_clicked_scatterplot = crypto_name

            })
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
      
      //global_arr_names = []
      })

}
