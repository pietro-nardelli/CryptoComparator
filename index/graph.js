//TO THINK
/*
- potremmo graficare similarità particolari evidenziandole 
  nel grafo e nella matrice nella sottorete creata
+ DOne rami in base alla similarità random YHEEAA done
- TODO ricrea il grafo premendo il tasto con altri rami
- TODO animationhell
*/

///DATABASE
var data_reg = {}  //REG NAME ID ECC
var name_arr = []  //ARR with names only

//D3 OBJ
var width = 2700;  //d3 object width
var height = 1500; //d3 obj height

//GRAPH VALUES
var x_c= (width-150)/2;
var y_c= height/2;
var radius = 700;
var theta = 2*Math.PI/100 //split 2pi into 2pi/n_nodes

//CSS VAR NAMES 

//COLOR LINKS FOR SLIDER UPDATE AND MOUSEOVER
color_links = "rgb(2, 200, 255)"
stroke_width_links_mouseover = "10px"  //on mouseout
stroke_width_links_mouseout = "1px"
links_stroke_when_filtered_out = 'rgba(100,100,100,0.0)'

///NODE TEXT
fill_node_text = 'rgb(255, 255, 255)'
fill_node_text_when_pressed = 'orange'
size_node_text_when_pressed = '40px'
size_node_text = '35px'

//NODES VALUES
fill_node_circle = 'rgb(255, 102, 0)'
stroke_width_node_circle = '10px'

///SLIDER
var initial_threshold = 0.9; //THRESHOLD MIN x creare il nodo!
var initial_threshold_slider = 0.9; //THRESHOLD BASE OF THE SLIDER
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML =  rr(slider.value/1000+initial_threshold_slider) ;
actual_t = 0.4; //slider initial value is ?  //NOT USED ANYMORE

function rr(v){return Number(v.toFixed(3))} //3rd decimal n

slider.oninput = function() {
  output.innerHTML = rr(this.value/1000+initial_threshold_slider);
  actual_t = rr((this.value/1000)+initial_threshold_slider); // slider range 0-100 norm in 0 1
  slider_update(actual_t)
}

function slider_update(t) {
  svg.selectAll(".link ")
  .data(links)
  .filter(function(x) { return x.k < t})
  .style("stroke"," rgba(53, 53, 53,0.0)")

  svg.selectAll(".link ")
  .data(links)
  .filter(function(x) { return x.k >= t})
  .style("stroke", color_links)
}


//X Y to create a node
function getX(n) {
  return data_reg[n][0][0]
}

function getY(n) {
  return data_reg[n][0][1]
}

///given n returns a symm. square nxn matrix with random values(0-1)
function get_random_simmetric(n){
  var matrix = [];
  for(var i=0; i<n; i++) {
      matrix[i] = [];
      for(var j=0; j<=i; j++) {
          r=(i!=j?Number(Math.random().toFixed(3)):1)
          matrix[i][j] = r;
          matrix[j][i] = r;
      }
  }
  return matrix;
}

//N buttons of similarity we want to use, to give to each link
n_similarities = 5
arr_similarity_matrix = []
for (var i = 0 ; i < n_similarities; i++){
  arr_similarity_matrix[i] = get_random_simmetric(100);
}

//return top n values from arr, use concat instead of sPlice(0) which gave me an error(?)
function get_top_n(arr,n){
  return arr.concat().sort((a,b) => b-a).slice(0,n);
}

//get n node from the hat and give them to node namecoin in datareg
//if nodes are over a threshold from the(TODO each) similarity matrix we assign a link
function get_links(namecoin,similarity_idx) {
  namecoin_idx = name_arr.indexOf(namecoin)
  links = []
  namecoin_similarity_arr = arr_similarity_matrix[similarity_idx][namecoin_idx] //
  // console.log("l arr a cui collegarmi è!")
  // console.log(namecoin_similarity_arr)
  for (var i = 0; i < 100; i++) {   //was in n_links to keep n links max, now 100 coins
      //namecoin = name_arr[i*4] //Math.round(Math.random()*100)]
      if(namecoin_similarity_arr[i] > initial_threshold && i!=namecoin_idx ) //!!! THRESHOLD MINIMA PER CREARE IL NODO
        links = links.concat(name_arr[i])
    }
  return links
}

//UP DATAREG setting the links
function update_reg_links(index_of_similarity_in_use) {
  for (var i = 0; i < name_arr.length; i++) {
    namecoin = name_arr[i]
    data_reg[namecoin][2] =  get_links(namecoin,index_of_similarity_in_use)
    if(false){ //ALL LINKS HAVE THRESHOLD OVER 0.9! TO VERIFY USE TRUE
      console.log("----TEST!--- link, namecoin, value of their sim.")
      console.log(get_links(namecoin))
      console.log( namecoin)
      console.log(arr_similarity_matrix[0][name_arr.indexOf(namecoin)][name_arr.indexOf(get_links(namecoin)[0])])
      console.log(arr_similarity_matrix[0][name_arr.indexOf(namecoin)][name_arr.indexOf(get_links(namecoin)[1])])
      console.log(arr_similarity_matrix[0][name_arr.indexOf(namecoin)][name_arr.indexOf(get_links(namecoin)[2])])
      console.log(arr_similarity_matrix[0][name_arr.indexOf(namecoin)][name_arr.indexOf(get_links(namecoin)[3])])
      console.log(arr_similarity_matrix[0][name_arr.indexOf(namecoin)][name_arr.indexOf(get_links(namecoin)[4])])
    }
  }
}

//fill name_arr and sort it, set data_reg(name)=([x,y],name,[links])
d3v3.csv("dataset/100List.csv", function(data) {

  for (var i = 0; i < data.length; i++) {
    name_arr = name_arr.concat(data[i].Name)  //fill name_arr with names
  }
  name_arr.sort() //alphabetical order

  for (var i = 0; i < name_arr.length; i++) {  //create in data reg[name] an entry with (x,y),name
    namecoin = name_arr[i]
    aux_radius = radius
    if( i%2==0)aux_radius = radius *0.8
    x = x_c+Math.cos(theta*i)*aux_radius + 520*Math.cos(theta*i)
    y = y_c+Math.sin(theta*i)*aux_radius //+ 400*Math.sin(theta*i)

    data_reg[namecoin] = [[x,y],namecoin]
  }
  update_reg_links(0); //set in datareg all the links
});

console.log(data_reg)

var last_clicked="";



//SVG OBJs from d3v3
var svg = d3v3.select("body").append("svg")
    .attr("id", "svg_graph")
    .attr("width", width)
    .attr("height", height);

var force_graph = d3v3.layout.force()
    .gravity(.03)
    .distance(300)
    .charge(-100)
    .size([width, height]);


var test =[],test;
var links = [];
var nodes = [];

//could be better using only the simmMatrix to keep
//info about who links with who 
function getThreshold(source,target,similarity_idx) { 
  matrix = arr_similarity_matrix[similarity_idx]
  s_idx = name_arr.indexOf(source)
  t_idx = name_arr.indexOf(target)
  ret = matrix[s_idx][t_idx]
  return ret
}

d3v3.csv("", function() {  // !
  nodes = name_arr;
  links = [];
  for (var i = 0; i < name_arr.length; i++) {
    namecoin=nodes[i]
    link_to_add = data_reg[namecoin][2]

    for(j=0;j<link_to_add.length;j++){
      if(link_to_add[j]!=null){

        tr = getThreshold(namecoin,link_to_add[j],0)

        links.push({source:nodes.indexOf(namecoin) ,
                    target:nodes.indexOf(link_to_add[j]),
                    k:tr })// id:nodes.indexOf(namecoin) }

        links.push({source:nodes.indexOf(link_to_add[j]) ,
                    target:nodes.indexOf(namecoin),
                    k:tr })}
      }
  }
  nodes = nodes.map(function(n){return {name:n, fixed:true , x:getX(n) ,y:getY(n)}
  })

  force_graph
      .nodes(nodes)
      .links(links)
      .start();

  var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .attr("target", function(d) { return d.target.name; }) //per ora inutile
      .style("stroke-width", function(d) { return stroke_width_links_mouseout; });

  var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force_graph.drag)
      .on("mouseover", function (d) {  ///TO UPDATE con data_reg e non selectall, e d.source.name
        //if(last_clicked=="101") return;
        svg.selectAll(".node circle")
        .data(nodes)
        .filter(function(x) { return x.name != d.name })
        .style('fill', 'rgb(100,100,100)') ;

        svg.selectAll(".node text")
        .data(nodes)
        .filter(function(x) { return x.name != d.name })
        .style('fill', 'rgb(100,100,100)');

        svg.selectAll(".link")
        .data(links)
        .filter(function(x) { return x.source.name != d.name || x.k< actual_t}) //&& x.k< actual_t
        .style('stroke', links_stroke_when_filtered_out);

        var target_nodes = svg.selectAll(".link ")
        .data(links)
        .filter(function(x) {return x.source.name == d.name  && x.k>= actual_t}) //&& x.k>= actual_t
        .style("stroke-width", stroke_width_links_mouseover)

        n=target_nodes[0].length
        target_name = "";
        for(var a = 0; a <= n-1 ; a++){  //AFTER V3 NEED n-1 INSTEAD OF n
          if ( target_nodes[0][a] != undefined)
            target_name = target_nodes[0][a].getAttribute("target");
          else console.log("[ERR]GETATTR. ON EMPTY LINKS"+ a)

        svg.selectAll(".node circle")
        .data(nodes)
        .filter(function(x) {return x.name == target_name})
        .style('fill', fill_node_circle) ;

        svg.selectAll(".node text")
        .data(nodes)
        .filter(function(x) {return x.name == target_name})
        .style('fill', fill_node_text) ;
        }

        test = d
        console.log(test)
      })
      .on("mouseout", function (d) {
        //if(last_clicked==d.name)return;
          svg.selectAll(".node circle")
          .data(nodes)
          .style('fill', fill_node_circle) ;

          svg.selectAll(".node text")
          .data(nodes)
          .style('fill', fill_node_text);

          svg.selectAll(".link ")   //.filter(function(x) {return  x.k>= actual_t})
          .data(links).filter(function(x) { return  x.k >= actual_t})
          .style('stroke', color_links)
          .style("stroke-width", stroke_width_links_mouseout) ;

      })
      .on('click', function(d){
          //clicked(d.name);

          // /|\TRANSITION HELL/|\
          {
          // svg.selectAll(".node circle")
          // .data(nodes)
          // .filter(function(x) {return x.name == d.name})
          // .transition().duration(1000)
          // .attr("transform","translate(1300,0)") 

          // svg.selectAll(".link")
          // .data(links)
          // .filter(function(x) { return x.source.name == d.name })
          // .attr("x1", function(d) { return  1300;})
          // .attr("y1", function(d) { return 0; })

          // svg.selectAll(".link").attr("x1","2")

          // svg.selectAll(".node circle").transition().duration(1000).attr("transform","translate(1200,100)")

          // svg.selectAll(".link ")
          // .data(links).transition().duration(1000)
          // .attr("x1", function(d) { return d.source.x; })
          // .attr("y1", function(d) { return d.source.y; })
          // .attr("x2", function(d) { return d.target.x; })
          // .attr("y2", function(d) { return d.target.y; })
          }

          svg.selectAll(".node circle")
          .data(nodes)
          .style("stroke-width", "0px");
          
          svg.selectAll(".node text")
          .data(nodes)
          .style("stroke-width", "0px")
          .style("font-size", size_node_text);

          last_clicked=d;

          matrixReduction(d.name);

          svg.selectAll(".node circle")
          .data(nodes)
          .filter(function(x) {return x.name == d.name})
          .style('fill', 'rgb(255, 220, 0)')
          .style("stroke-width", stroke_width_node_circle)  //.attr("r", "15") ; per la dim
          .style("z-index", '0');

          svg.selectAll(".node text")
          .data(nodes)
          .filter(function(x) {return x.name == d.name})
          .style('fill', fill_node_text_when_pressed) 
          .style("font-size", size_node_text_when_pressed)
          .style("z-index", '2');

          createGraphsOfMyCrypto(d.name);
      });


  node.append("circle")
      .attr("r","7");

  node.append("text")
      .attr("dx", 12) //function(d) { if(d.name=="Bitcoin") return 12;else return -30  })
      .attr("dy", 3)
      .attr("fill", fill_node_text)
      .text(function(d) { return d.name });

  force_graph.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr("k", function(d) { return d.k;  });  //useless 4 now

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


  });

  //slider_update(actual_t)
});

// function clicked(node_name) {  //:(
  // console.log(node_name)
  // console.log("dataset/"+node_name+".csv")
  // d3v3.csv("dataset/"+node_name+".csv", function(json) {
  //   console.log(json)
  //   //TODO
  // })
  // //if(last_clicked == node_name){ last_clicked=""; return;}
  // last_clicked=node_name;

  // svg.selectAll(".node circle")
  // .data(nodes)
  // .filter(function(x) {return x.name == last_clicked})
  // .style('fill', 'rgb(255, 0, 0)')
  // .style("stroke-width", "15px") ; //.attr("r", "15") ; per la dim

  // svg.selectAll(".node text")
  // .data(nodes)
  // .filter(function(x) {return x.name == last_clicked})
  // .style('fill', 'rgb(255, 0, 0)') ;
// }

function ontick(n){
  // link.attr("x1", function(d) { return d.source.x; })
  // .attr("y1", function(d) { return d.source.y; })
  // .attr("x2", function(d) { return d.target.x; })
  // .attr("y2", function(d) { return d.target.y; })
  // .attr("k", function(d) { return d.k;  });  //useless 4 now

  n.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  svg.selectAll(".node").data(nodes)[0][50].transition()
  .duration(100).setAttribute("transform","translate(100,100).transition()")

  svg.selectAll(".node circle").transition().duration(1000).attr("transform","translate(1200,100)")
}










































function update_reg_links1(index_of_similarity_in_use) {
  for (var i = 0; i < name_arr.length; i++) {
    namecoin = name_arr[i]
    data_reg[namecoin][2] = get_links(namecoin,index_of_similarity_in_use)
  }
}

//SERVE data_reg con i nuovi links es data_reg["ATC Coin"][2] = new[]
// ^ RELATIVI alla tr
//



document.getElementById("SIMIL1").addEventListener("click", function () {
  testa(1)  
} )

document.getElementById("SIMIL2").addEventListener("click", function () {
  testa(2)  
} )

document.getElementById("SIMIL3").addEventListener("click", function () {
  testa(3)  
} )



function testa(ididix){

  svg.selectAll("*").remove()

  index_of_similarity_in_use = ididix

  update_reg_links(index_of_similarity_in_use)

  
  console.log("SIMIL1!")
  d3v3.csv("dataset/100List.csv", function(data) {

  
d3v3.csv("", function() {  // per ogni namecoin prendo i relativi link to add dal datareg 
  nodes = name_arr;
  links = [];
  for (var i = 0; i < name_arr.length; i++) {
    namecoin=nodes[i]
    link_to_add = data_reg[namecoin][2]

    for(j=0;j<link_to_add.length;j++){ //for each of them i eval. the tr. and push the link (s,t,tr)
      if(link_to_add[j]!=null){

        tr = getThreshold(namecoin,link_to_add[j],index_of_similarity_in_use)

        links.push({source:nodes.indexOf(namecoin) ,
                    target:nodes.indexOf(link_to_add[j]),
                    k:tr })

        links.push({source:nodes.indexOf(link_to_add[j]) ,
                    target:nodes.indexOf(namecoin),
                    k:tr })}
      }
  }
  nodes = nodes.map(function(n){return {name:n, fixed:true , x:getX(n) ,y:getY(n)}
  })

  force_graph.nodes(nodes).links(links).start();

  var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .attr("target", function(d) { return d.target.name; }) //per ora inutile
      .style("stroke-width", function(d) { return stroke_width_links_mouseout; });

  var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force_graph.drag)
      .on("mouseover", function (d) {  ///TO UPDATE con data_reg e non selectall, e d.source.name
        svg.selectAll(".node circle")
        .data(nodes)
        .filter(function(x) { return x.name != d.name })
        .style('fill', 'rgb(100,100,100)') ;

        svg.selectAll(".node text")
        .data(nodes)
        .filter(function(x) { return x.name != d.name })
        .style('fill', 'rgb(100,100,100)');

        svg.selectAll(".link")
        .data(links)
        .filter(function(x) { return x.source.name != d.name || x.k< actual_t})
        .style('stroke', links_stroke_when_filtered_out);

        var target_nodes = svg.selectAll(".link ")
        .data(links)
        .filter(function(x) {return x.source.name == d.name  && x.k>= actual_t}) 
        .style("stroke-width", stroke_width_links_mouseover)

        n=target_nodes[0].length
        target_name = "";
        for(var a = 0; a <= n-1 ; a++){  
          if ( target_nodes[0][a] != undefined)
            target_name = target_nodes[0][a].getAttribute("target");
          else console.log("[ERR]GETATTR. ON EMPTY LINKS"+ a)

        svg.selectAll(".node circle")
        .data(nodes)
        .filter(function(x) {return x.name == target_name})
        .style('fill', fill_node_circle) ;

        svg.selectAll(".node text")
        .data(nodes)
        .filter(function(x) {return x.name == target_name})
        .style('fill', fill_node_text) ;
        }

        test = d
        console.log(test)
      })
      .on("mouseout", function (d) {
          svg.selectAll(".node circle")
          .data(nodes)
          .style('fill', fill_node_circle) ;

          svg.selectAll(".node text")
          .data(nodes)
          .style('fill', fill_node_text);

          svg.selectAll(".link ")   //.filter(function(x) {return  x.k>= actual_t})
          .data(links).filter(function(x) { return  x.k >= actual_t})
          .style('stroke', color_links)
          .style("stroke-width", stroke_width_links_mouseout) ;

      })
      .on('click', function(d){

          svg.selectAll(".node circle")
          .data(nodes)
          .style("stroke-width", "0px");
          
          svg.selectAll(".node text")
          .data(nodes)
          .style("stroke-width", "0px")
          .style("font-size", size_node_text);

          last_clicked=d;

          matrixReduction(d.name);

          svg.selectAll(".node circle")
          .data(nodes)
          .filter(function(x) {return x.name == d.name})
          .style('fill', 'rgb(255, 220, 0)')
          .style("stroke-width", stroke_width_node_circle)  //.attr("r", "15") ; per la dim
          .style("z-index", '0');

          svg.selectAll(".node text")
          .data(nodes)
          .filter(function(x) {return x.name == d.name})
          .style('fill', fill_node_text_when_pressed) 
          .style("font-size", size_node_text_when_pressed)
          .style("z-index", '2');

          createGraphsOfMyCrypto(d.name);
      });


      node.append("circle")
          .attr("r","7");

      node.append("text")
          .attr("dx", 12) //function(d) { if(d.name=="Bitcoin") return 12;else return -30  })
          .attr("dy", 3)
          .attr("fill", fill_node_text)
          .text(function(d) { return d.name });

      force_graph.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .attr("k", function(d) { return d.k;  });  //useless 4 now

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


      });

  //slider_update(actual_t)
});

})

}
