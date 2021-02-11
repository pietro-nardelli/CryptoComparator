



{
///SLIDER
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;
actual_t = 1; //slider initial value is 1

slider.oninput = function() {
  output.innerHTML = this.value;
  actual_t = Math.round(this.value/10); // slider range 0-100 rounded in 1 10
  slider_update(actual_t)
}

function slider_update(t) {
  svg.selectAll(".link ").data(links).filter(function(x) { return x.k < t}).style("stroke"," rgba(53, 53, 53,0.0)")
  svg.selectAll(".link ").data(links).filter(function(x) { return x.k >= t}).style("stroke","rgba(247, 243, 0, 0.61)")
}

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

//X Y to create a node
function getX(n) {
  return data_reg[n][0][0]
}

function getY(n) {
  return data_reg[n][0][1]
}

//get n node from the hat
function get_links(node,n_links) {
  links = []
  for (var i = 0; i < n_links; i++) {
      namecoin = name_arr[i] //Math.round(Math.random()*100)]
      links = links.concat(namecoin)
    }
  return links
}

//UP DATAREG setting the links
function update_reg_links() {
  for (var i = 0; i < name_arr.length; i++) {
    namecoin = name_arr[i]
    data_reg[namecoin] = data_reg[namecoin].concat([get_links(namecoin,5)])
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
    x = x_c+Math.cos(theta*i)*aux_radius + 540*Math.cos(theta*i)
    y = y_c+Math.sin(theta*i)*aux_radius //+ 400*Math.sin(theta*i)

    data_reg[namecoin] = [[x,y],namecoin]
  }
  update_reg_links(); //set in datareg all the links
});

console.log(data_reg)

var last_clicked="";

function clicked(node_name) {
  console.log(node_name)
  console.log("dataset/"+node_name+".csv")
  d3v3.csv("dataset/"+node_name+".csv", function(json) {
    console.log(json)
    //TODO
  })
  //if(last_clicked == node_name){ last_clicked=""; return;}
  last_clicked=node_name;
  svg.selectAll(".node circle").data(nodes).filter(function(x) {return x.name == last_clicked}).style('fill', 'rgb(255, 0, 0)')
  .style("stroke-width", "15px") ; //.attr("r", "15") ; per la dim
  svg.selectAll(".node text").data(nodes).filter(function(x) {return x.name == last_clicked}).style('fill', 'rgb(255, 0, 0)') ;

}

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

d3v3.csv("", function() {  // !
  nodes = name_arr;
  links = [];
  for (var i = 0; i < name_arr.length; i++) {
    namecoin=nodes[i]
    link_to_add = data_reg[namecoin][2]

    for(j=0;j<link_to_add.length;j++){
      if(link_to_add[j]!=null){
        links.push({source:nodes.indexOf(namecoin) , target:nodes.indexOf(link_to_add[j]), k:j*2 })}// id:nodes.indexOf(namecoin) }
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
      .style("stroke-width", function(d) { return 2; });

  var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force_graph.drag)
      .on("mouseover", function (d) {  ///TO UPDATE con data_reg e non selectall, e d.source.name
        //if(last_clicked=="101") return;
        svg.selectAll(".node circle")
        .data(nodes).filter(function(x) { return x.name != d.name }).style('fill', 'rgb(100,100,100)') ;

        svg.selectAll(".node text")
        .data(nodes).filter(function(x) { return x.name != d.name }).style('fill', 'rgb(100,100,100)');

        svg.selectAll(".link").data(links).filter(function(x) { return x.source.name != d.name || x.k< actual_t}) //&& x.k< actual_t
        .style('stroke', 'rgba(100,100,100,0.0)');


        var target_nodes = svg.selectAll(".link ").data(links).filter(function(x) {return x.source.name == d.name  && x.k>= actual_t}) //&& x.k>= actual_t
        .style("stroke-width", "6px")

        n=target_nodes[0].length
        target_name = "";
        for(var a = 0; a <= n-1 ; a++){  //AFTER V3 NEED n-1 INSTEAD OF n
          if ( target_nodes[0][a] != undefined)
            target_name = target_nodes[0][a].getAttribute("target");
          else console.log("[ERR]GETATTR. ON EMPTY LINKS"+ a)
          ///TODO FOR +1 LINKS!DONE
        svg.selectAll(".node circle").data(nodes).filter(function(x) {return x.name == target_name}).style('fill', 'rgb(255, 102, 0)') ;
        svg.selectAll(".node text").data(nodes).filter(function(x) {return x.name == target_name}).style('fill', 'rgb(255, 255, 255)') ;
        }

        test = target_nodes
      })
      .on("mouseout", function (d) {
        //if(last_clicked==d.name)return;
          svg.selectAll(".node circle")
          .data(nodes)
          .style('fill', 'rgb(255, 102, 0)') ;
          svg.selectAll(".node text")
          .data(nodes)
          .style('fill', 'rgb(255, 255, 255)');
          svg.selectAll(".link ")   //.filter(function(x) {return  x.k>= actual_t})
          .data(links).filter(function(x) { return  x.k >= actual_t})
          .style('stroke', 'rgba(247, 243, 0, 0.61)')
          .style("stroke-width", "2px") ;

      })
      .on('click', function(d){
          //clicked(d.name);
          svg.selectAll(".node circle").data(nodes).style("stroke-width", "0px");
          last_clicked=d.name;
          matrixReduction(d.name);
          svg.selectAll(".node circle").data(nodes).filter(function(x) {return x.name == last_clicked}).style('fill', 'rgb(255, 0, 0)')
          .style("stroke-width", "15px") ; //.attr("r", "15") ; per la dim
          svg.selectAll(".node text").data(nodes).filter(function(x) {return x.name == last_clicked}).style('fill', 'rgb(255, 0, 0)') ;
          createGraphsOfMyCrypto(d.name);
      });


  node.append("circle")
      .attr("r","7");

  node.append("text")
      .attr("dx", 12) //function(d) { if(d.name=="Bitcoin") return 12;else return -30  })
      .attr("dy", 3)
      .text(function(d) { return d.name });

  force_graph.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
        .attr("k", function(d) { return d.k;  });  //useless 4 now

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


  });

  slider_update(actual_t)
});



}
