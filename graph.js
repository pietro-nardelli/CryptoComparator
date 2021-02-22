//TO THINK
/*
scatter interattivo
cursore on mouseover
grafi iniziali vuoti/bianco se 1 solo?
similitudini menù a tendina
*/

/*
- potremmo graficare similarità particolari evidenziandole
  nel grafo e nella matrice nella sottorete creata
+ DOne rami in base alla similarità random YHEEAA done
+ done ricrea il grafo premendo il tasto con altri rami yes
- TODO se passo su un nodo deve ingrandire la scritta(e colorarla?), e ridurla quando esce(e farla tornare bianca in caso)
       se premo su un nodo già premuto deve tornare tutto alla normalità* eccetto i 2 nodi colorati
       se premo su un nodo deve colorarlo ed evidenziare la sottorete(nodo,testo,archi*,nodoTarget*,testoTarget*)
            e nascondere il resto(nodi non connessi, archi non connessi*)
       se premo su un altro nodo deve tenere l'ultimo colorato e colorare anche quello nuovo(e con colori specifici)
       se premo di nuovo sull'ultimo premuto?
       se premo su un terzo nodo?
       se premo il primo nodo?
      * = relativamente alla soglia attuale, e se viene modificata bisogna tenerne conto
          (mantenendo solo alcune modifiche, tipo la sottorete deve restare evidenziata con i link più grandi)


- TODO animationhell
*/

var T_ARR = [ 0.95,0.95,0.95,0.95,0.95,0.8,
              0.8,0.75,0.95,0.95,0.95,0.95,
              0.95,0.95,0.95,0.95,0.95,0.95,
              0.95,0.95,0.95,0.95,0.95,0.60   ]


///DATABASE
var data_reg = {}  //REG NAME ID ECC
var name_arr = []  //ARR with names only
var name_arr_not_sorted = []

//D3 OBJ
var width = 2700;  //d3 object width
var height = 1500; //d3 obj height

//GRAPH VALUES
var x_c = (width - 150) / 2;
var y_c = height / 2;
var radius = 600;
var theta = 2 * Math.PI / 100 //split 2pi into 2pi/n_nodes
var ellisse = false

//CSS VAR NAMES

//COLOR LINKS FOR SLIDER UPDATE AND MOUSEOVER
color_links = "rgb(2, 200, 255)"
stroke_width_links_mouseover = "10px"  //on mouseout
stroke_width_links_mouseout = "1px"
links_stroke_when_filtered_out = 'rgba(100,100,100,0.0)'

///NODE TEXT
fill_node_text = 'rgb(255, 255, 255)'
fill_node_text_when_pressed = 'rgb(255, 196, 0)'
size_node_text_when_pressed = '60px'
size_node_text = '35px'

//NODES VALUES
fill_node_circle = 'rgb(255, 102, 0)'
stroke_width_node_circle = '100px'
radius_node_circle = '15  '

///SLIDER
var initial_threshold = 0.95; //THRESHOLD MIN x creare il nodo!
var initial_threshold_slider = initial_threshold; //THRESHOLD BASE OF THE SLIDER
var fix_val_slider = (1-initial_threshold)*100 //2 if 0.95, 0 if 0.9, 0.5 if 0.8 ..

// output.innerHTML=0.95
// actual_t = 0.95

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");   //0 - 0.1   0.9 + 0.1*x x = 1
                                                          // 0.95 + 0.1*x x=5
                                                          // 0.8 + 0.1*x   x=(1 - initial)*10

                                                          //
output.innerHTML = String(90+slider.value/10)+"%("+
                      rr((slider.value*fix_val_slider / 1000)  + initial_threshold_slider)
                      +")";

var actual_t = initial_threshold_slider; //slider initial value is ?  //NOT USED ANYMORE
// Useful to avoid refresh of the matrix too many times
function mouseDownOnSlider() {
  mouse_down_on_slider = 1; //Click
}
function mouseUpOnSlider() {
  mouse_down_on_slider = 0; // Unclick
  full_matrix_or_reduced(last_clicked, data_json, actual_t);
}
slider.addEventListener("mousedown", mouseDownOnSlider);
slider.addEventListener("mouseup", mouseUpOnSlider);
var mouse_down_on_slider = -1; // No click/unclick
//

function rr(v) { return Number(v.toFixed(3)) } //3rd decimal n

slider.oninput = function () {
  //console.log(this.value* fix_val_slider / 10000)
  actual_t = rr( ((this.value* fix_val_slider / 10000) ) + initial_threshold_slider); // slider range 0-100 norm in 0 1
  output.innerHTML = String(90+slider.value/10)+"%("+ actual_t +")";
  slider_update(actual_t)
}

function slider_update(t) {

  svg.selectAll(".link ")
    .data(links)
    .filter(function (x) { return x.k < t })
    .style("stroke", " rgba(53, 53, 53,0.0)")

  svg.selectAll(".link ")
    .data(links)
    .filter(function (x) { return x.k >= t })
    .style("stroke", color_links)

  full_matrix_or_reduced(last_clicked, data_json, t);
  if (last_clicked != "") {
    on_mouseover_function(last_clicked)
  }
  else
    on_mouseout_function()

}


//X Y to create a node
function getX(n) {
  return data_reg[n][0][0]
}

function getY(n) {
  return data_reg[n][0][1]
}

///given n returns a symm. square nxn matrix with random values(0-1)
function get_random_simmetric(n) {
  var matrix = [];
  for (var i = 0; i < n; i++) {
    matrix[i] = [];
    for (var j = 0; j <= i; j++) {
      r = (i != j ? Number(Math.random().toFixed(3)) : 1)
      matrix[i][j] = r;
      matrix[j][i] = r;
    }
  }
  return matrix;
}

var matrix_prova = [];

//create_100100_matrix("close", matrix_prova);

function create_100100_matrix(json_file, matrix) {
  d3.json("similarities/data_" + json_file +".json", function (data) {
    var nodes = data.nodes,
      n = nodes.length;
    // Compute index per node.
    nodes.forEach(function (node, i) {
      node.index = i;     // Initialize attribute "index"
      node.count = 0;     // Initialize attribute "count"
      // Each row of the matrix contains an array in range n ([0,...,99])
      // and "map" will access this value and return an object {x,y,z}
      // In the end we have matrix[i][j]{x,y,z}
      matrix[i] = d3.range(n).fill(0);
    });
    // Convert links to matrix; count character occurrences.
    data.links.forEach(function (link) {
      // Between source and target (symmetric matrix)
      matrix[link.source][link.target] = rr(link.value);
      matrix[link.target][link.source] = rr(link.value);
    });

    test = Array(100).fill(Array(100))

    for (var i = 0; i < 100; i++) {
      for (var j = 0; j < 100; j++) {
        test[i][j] = matrix[name_arr_not_sorted.indexOf(name_arr[i])][name_arr_not_sorted.indexOf(name_arr[j])]
      }
    }
    // var orders_name = d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].Name, nodes[b].Name); });
    // var matrix_temp = [new Array(100).map(() => new Array(100).fill(0))];
    // for (var r = 0; r < 100; r++) {
    //   for (var c = 0; c < 100; c++) {
    //     matrix_temp[r][c] = matrix[orders_name[r]][orders_name[c]]
    //   }
    // }
    matrix = test;
  });
  //return matrix;
}



function reshape(q) {
  var w = []
  for (var i = 0; i < 100; i++) {
    aux = new Array(100).fill(0)
    for (var j = 0; j < 100; j++) {
      aux[j] = q[name_arr_not_sorted.indexOf(name_arr[i])][name_arr_not_sorted.indexOf(name_arr[j])]
    }
    w.push(aux)
  }
  return w;
}

function getJ(i) {
  if(i<6)   return 0
  if(i<12)  return 1
  if(i<18)  return 2
  return 3
}

//N buttons of similarity we want to use, to give to each link
n_similarities = 6
arr_similarity_matrix = []
year_arr = ["","_2015","_2016","_2017"]
arr_path = ["close", "high", "low", "market_cap", "open", "volume"]

for (var i = 0; i < n_similarities*4; i++) {
  var aux = []
  //get_random_simmetric(100);

  //console.log(String(arr_path[i%6])+year_arr[getJ(i)])
  create_100100_matrix( String(arr_path[i%6])+year_arr[getJ(i)], aux)
  arr_similarity_matrix[i] = aux
}

arr_sim_old = []
for (var i = 0; i < n_similarities; i++) {
  arr_sim_old[i] = get_random_simmetric(100);
}


//return top n values from arr, use concat instead of sPlice(0) which gave me an error(?)
function get_top_n(arr, n) {
  return arr.concat()
    .sort((a, b) => b - a)
    .slice(0, n);
}


//get n node from the hat and give them to node namecoin in datareg
//if nodes are over a threshold from the(TODO each) similarity matrix we assign a link
function get_links(namecoin, similarity_idx) {
  namecoin_idx = name_arr.indexOf(namecoin)
  links = []
  var namecoin_similarity_arr = []
  if (similarity_idx == -1) { namecoin_similarity_arr = arr_sim_old[0][namecoin_idx] }
  else { namecoin_similarity_arr = arr_similarity_matrix[similarity_idx][namecoin_idx] }
  //console.log(namecoin_similarity_arr)
  // console.log("l arr a cui collegarmi è!")
  // console.log(namecoin_similarity_arr)
  for (var i = 0; i < 100; i++) {   //was in n_links to keep n links max, now 100 coins
    //namecoin = name_arr[i*4] //Math.round(Math.random()*100)]
    if (namecoin_similarity_arr[i] >= initial_threshold && i != namecoin_idx) //!!! THRESHOLD MINIMA PER CREARE IL NODO
      links = links.concat(name_arr[i])
  }
  return links
}

//UP DATAREG setting the links
function update_reg_links(index_of_similarity_in_use) {
  for (var i = 0; i < name_arr.length; i++) {
    namecoin = name_arr[i]
    data_reg[namecoin][2] = get_links(namecoin, index_of_similarity_in_use)
    if (false) { //ALL LINKS HAVE THRESHOLD OVER 0.9! TO VERIFY USE TRUE
      console.log("----TEST!--- link, namecoin, value of their sim.")
      console.log(get_links(namecoin))
      console.log(namecoin)
      console.log(arr_similarity_matrix[0][name_arr.indexOf(namecoin)][name_arr.indexOf(get_links(namecoin)[0])])
      console.log(arr_similarity_matrix[0][name_arr.indexOf(namecoin)][name_arr.indexOf(get_links(namecoin)[1])])
      console.log(arr_similarity_matrix[0][name_arr.indexOf(namecoin)][name_arr.indexOf(get_links(namecoin)[2])])
      console.log(arr_similarity_matrix[0][name_arr.indexOf(namecoin)][name_arr.indexOf(get_links(namecoin)[3])])
      console.log(arr_similarity_matrix[0][name_arr.indexOf(namecoin)][name_arr.indexOf(get_links(namecoin)[4])])
    }
  }
}

//fill name_arr and sort it, set data_reg(name)=([x,y],name,[links])
d3v3.csv("dataset/100List.csv", function (data) {

  for (var i = 0; i < data.length; i++) {
    name_arr = name_arr.concat(data[i].Name)  //fill name_arr with names
  }
  name_arr_not_sorted = name_arr.concat()
  name_arr.sort() //alphabetical order

  for (var i = 0; i < name_arr.length; i++) {  //create in data reg[name] an entry with (x,y),name
    namecoin = name_arr[i]
    aux_radius = radius
    if (i % 2 == 0) aux_radius = radius * 0.75
    x = x_c + Math.cos(theta * i) * aux_radius + 520 * Math.cos(theta * i)
    if (i % 2 != 0) x = x + 100 * Math.cos(theta * i)
    y = y_c + Math.sin(theta * i) * aux_radius
    if (!ellisse) y += 100 * (Math.sin(theta * i)) * (Math.abs(Math.sin(theta * i))) ** 10
    if (i % 2 == 0) y += 2 * (Math.sin(theta * i)) * (Math.abs(Math.sin(theta * i))) ** 400
    if (namecoin == "Dogecoin") { y += 30, x -= 30 }
    if (namecoin == "Radium") { y -= 20, x -= 20 }
    data_reg[namecoin] = [[x, y], namecoin]
  }
  //update_reg_links(0); //set in datareg all the links
});

//console.log(data_reg)

var last_clicked = "";



//SVG OBJs from d3v3
var svg = d3v3.select("#graph_div").append("svg")
  .attr("id", "svg_graph")
  .attr("width", width)
  .attr("height", height);

var force_graph = d3v3.layout.force()
  .gravity(.03)
  .distance(300)
  .charge(-100)
  .size([width, height]);


var test = [], test;
var links = [];
var nodes = [];

//could be better using only the simmMatrix to keep
//info about who links with who
function getThreshold(source, target, similarity_idx) {
  matrix = similarity_idx != -1 ? arr_similarity_matrix[similarity_idx] : arr_sim_old[0]
  s_idx = name_arr.indexOf(source)
  t_idx = name_arr.indexOf(target)
  ret = matrix[s_idx][t_idx]
  return ret
}




document.getElementById("SIMIL1").addEventListener("click", function () {
  data_json = "data_high"
  create_graph(1)
})

document.getElementById("SIMIL2").addEventListener("click", function () {
  data_json = "data_low";
  create_graph(2)
})

document.getElementById("SIMIL3").addEventListener("click", function () {
  data_json = "data_market_cap";
  create_graph(3)
})

document.getElementById("SIMIL4").addEventListener("click", function () {
  data_json = "data_open";
  create_graph(4)
})

document.getElementById("SIMIL5").addEventListener("click", function () {
  data_json = "data_volume";
  create_graph(5)
})

document.getElementById("SIMIL0").addEventListener("click", function () {
  data_json = "data_close";
  create_graph(0)
})

///////


document.getElementById("SIMIL1_15").addEventListener("click", function () {
  data_json = "data_high_2015"
  create_graph(7)
})

document.getElementById("SIMIL2_15").addEventListener("click", function () {
  data_json = "data_low_2015";
  create_graph(8)
})

document.getElementById("SIMIL3_15").addEventListener("click", function () {
  data_json = "data_market_cap_2015";
  create_graph(9)
})

document.getElementById("SIMIL4_15").addEventListener("click", function () {
  data_json = "data_open_2015";
  create_graph(10)
})

document.getElementById("SIMIL5_15").addEventListener("click", function () {
  data_json = "data_volume_2015";
  create_graph(11)
})

document.getElementById("SIMIL0_15").addEventListener("click", function () {
  data_json = "data_close_2015";
  create_graph(6)
})

////
document.getElementById("SIMIL1_16").addEventListener("click", function () {
  data_json = "data_high_2016"
  create_graph(13)
})

document.getElementById("SIMIL2_16").addEventListener("click", function () {
  data_json = "data_low_2016";
  create_graph(14)
})

document.getElementById("SIMIL3_16").addEventListener("click", function () {
  data_json = "data_market_cap_2016";
  create_graph(15)
})

document.getElementById("SIMIL4_16").addEventListener("click", function () {
  data_json = "data_open_2016";
  create_graph(16)
})

document.getElementById("SIMIL5_16").addEventListener("click", function () {
  data_json = "data_volume_2016";
  create_graph(17)
})

document.getElementById("SIMIL0_16").addEventListener("click", function () {
  data_json = "data_close_2016";
  create_graph(12)
})
//////

document.getElementById("SIMIL1_17").addEventListener("click", function () {
  data_json = "data_high_2017"
  create_graph(19)
})

document.getElementById("SIMIL2_17").addEventListener("click", function () {
  data_json = "data_low_2017";
  create_graph(20)
})

document.getElementById("SIMIL3_17").addEventListener("click", function () {
  data_json = "data_market_cap_2017";
  create_graph(21)
})

document.getElementById("SIMIL4_17").addEventListener("click", function () {
  data_json = "data_open_2017";
  create_graph(22)
})

document.getElementById("SIMIL5_17").addEventListener("click", function () {
  data_json = "data_volume_2017";

  create_graph(23)
})

document.getElementById("SIMIL0_17").addEventListener("click", function () {
  data_json = "data_close_2017";

  create_graph(18)
})

function set_slider_params(idx) {
  initial_threshold = T_ARR[idx]; //THRESHOLD MIN x creare il nodo!
  initial_threshold_slider = initial_threshold; //THRESHOLD BASE OF THE SLIDER
  fix_val_slider = (1-initial_threshold)*100
  output.innerHTML=String(90+slider.value/10)+"%("+initial_threshold+")";
  slider.value=0
  actual_t = initial_threshold
  full_matrix_or_reduced(last_clicked, data_json, actual_t);
  //slider_update(actual_t)
}


var reshape_flag = 1; //1 iterazione quando apre la pagina DA METTERE PRIMA DEL CREATE_GRAPH
//update_reg_links(0); !! CI SERVE PURE QUESTO PRIMA?
var data_json = "data_close" //first attribute
var actual_graph_used = -1

create_graph(0)

function create_graph(ididix) {


  console.log("last clicked è:")
  console.log(last_clicked==""?"nessuno":last_clicked.name)


  if(actual_graph_used==1212)return
  actual_graph_used=ididix
  if(reshape_flag != 1) //quindi se non è la prima volta
  {console.log("cambio valori slider iniziali,e reshape flag è:"+String(reshape_flag))
  set_slider_params(ididix)
  }


  d3v3.csv("similarities/data_close.json", function () {  // per ogni namecoin prendo i relativi link to add dal datareg

    svg.selectAll("*").remove()

    index_of_similarity_in_use = ididix

    if (reshape_flag == 1) {
      reshape_flag = 0
      for (var i = 0; i < 24; i++) {  //24!!!!
        try {
          arr_similarity_matrix[i] = reshape(arr_similarity_matrix[i])
        } catch (error) {
          window.location.reload();
        }
      }
    }
    update_reg_links(index_of_similarity_in_use)


    //console.log("SIMIL1!")

    //console.log(arr_similarity_matrix)

    nodes = name_arr;
    links = [];
    for (var i = 0; i < name_arr.length; i++) {
      namecoin = nodes[i]
      link_to_add = data_reg[namecoin][2]

      for (j = 0; j < link_to_add.length; j++) { //for each of them i eval. the tr. and push the link (s,t,tr)
        if (link_to_add[j] != null) {

          tr = getThreshold(namecoin, link_to_add[j], index_of_similarity_in_use)

          links.push({
            source: nodes.indexOf(namecoin),
            target: nodes.indexOf(link_to_add[j]),
            k: tr
          })

          // links.push({source:nodes.indexOf(link_to_add[j]) ,
          //             target:nodes.indexOf(namecoin),
          //             k:tr })
        }
      }
    }
    nodes = nodes.map(function (n) {
      return { name: n, fixed: true, x: getX(n), y: getY(n) }
    })

    force_graph.nodes(nodes).links(links).start();

    var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .attr("target", function (d) { return d.target.name; }) //per ora inutile
      .attr("k", function (d) { return d.k; })
      .style("stroke-width", function (d) { return stroke_width_links_mouseout; });

    var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force_graph.drag)

      .on("mouseover", function (d) {  ///TO UPDATE con data_reg e non selectall, e d.source.name

        on_click_function(d)

      })
      .on("mouseout", function (d) {    //ricolora tutto come al normale

        //on_click_function()
        //on_mouseout_function(d)

      })
      .on('click', function (d) {

        
        if (last_clicked == d || last_clicked.name==d.name) {
          last_clicked = ""
          fullMatrix(data_json)
          on_mouseout_function()
          return
        }

        on_mouseout_function(d)
        on_mouseover_function(d)


        last_clicked = d;

        //console.log(data_json)
        //matrixReduction(d.name, data_json, actual_t);
        full_matrix_or_reduced(last_clicked, data_json, actual_t);
        //createGraphsOfMyCrypto(d.name);
        createSingleGraphsOfMyCrypto(d.name);
        //createBoxPlotOfMyCrypto(d.name);
        //blink()


      });


    node.append("circle")
      .attr("r", radius_node_circle);

    node.append("text")
      .attr("dx", 12) //function(d) { if(d.name=="Bitcoin") return 12;else return -30  })
      .attr("dy", 3)
      .attr("fill", fill_node_text)
      .attr("webkit-text-fill-color", "white")
      .attr("display", "block")
      .attr("display", "inline-block")
      .text(function (d) { return d.name });

    force_graph.on("tick", function () {
      link.attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });
      //useless 4 now

      node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    });

    //slider_update(actual_t)
    if(last_clicked!=""){
    on_mouseout_function(last_clicked)
    on_mouseover_function(last_clicked)
    }
  });
  
}

function blink() {
  svg.selectAll(".node circle")
    .data(nodes)
    .filter(function (x) { return x.name == last_clicked.name })
    .transition()
    .duration(500)
    .style('fill', "red")
    .transition()
    .duration(500)
    .style('fill', fill_node_circle)
    .transition()
    .duration(500)
    .style('fill', "red")
    .transition()
    .duration(500)
    .style('fill', fill_node_circle)
  //.on("end", blink);
}


function on_mouseover_function(d) {
  svg.selectAll(".node text")     //se vado sopra con il mouse ingrandisce la scritta
    .data(nodes)
    .filter(function (x) { return x.name == d.name })
    // .style('fill', fill_node_text_when_pressed)
    .style("font-size", size_node_text_when_pressed)
    .style("z-index", '2');

  //spegne i nodi e text del coin non premuto
  svg.selectAll(".node circle")
    .data(nodes)
    .filter(function (x) { return x.name != d.name })
    .style('fill', 'rgb(100,100,100)');

  svg.selectAll(".node text")
    .data(nodes)
    .filter(function (x) { return x.name != d.name })
    .style('fill', 'rgb(100,100,100)');

  //e tutti i link non collegati OR se la soglia è minore della threshold
  svg.selectAll(".link")
    .data(links)
    .filter(function (x) { return x.source.name != d.name || x.k < actual_t })
    .style('stroke', links_stroke_when_filtered_out);

  //ingrandisce quelli che partono dal nodo
  var link_target_node = svg.selectAll(".link ")
    .data(links)
    .filter(function (x) { return x.source.name == d.name && x.k >= actual_t })
    .style("stroke-width", stroke_width_links_mouseover)

  //prende i target(ora si potrebbe rifare con x.target.name)
  //e li ricolora, ovvero cerchi e testi
  n = link_target_node[0].length
  target_name = "";
  for (var a = 0; a <= n - 1; a++) {
    if (link_target_node[0][a] != undefined)
      target_name = link_target_node[0][a].getAttribute("target");
    else console.log("[ERR]GETATTR. ON EMPTY LINKS" + a)

    svg.selectAll(".node circle")
      .data(nodes)
      .filter(function (x) { return x.name == target_name })
      .style('fill', fill_node_circle);

    svg.selectAll(".node text")
      .data(nodes)
      .filter(function (x) { return x.name == target_name })
      .style('fill', fill_node_text);
  }

}


function on_mouseout_function(d) {

  svg.selectAll(".node circle")  //ricolora i cerchi
    .data(nodes)
    .style('fill', fill_node_circle);

  svg.selectAll(".node text")   //ricolora i testi
    .data(nodes)
    .style('fill', fill_node_text);

  svg.selectAll(".node text")   //ridimensiona quelli grandi
    .data(nodes)
    .style("stroke-width", "0px")
    .style("font-size", size_node_text);

  svg.selectAll(".link ")     //ricolora i links sopra la soglia
    .data(links)
    .filter(function (x) { return x.k >= actual_t })
    .style('stroke', color_links)
    .style("stroke-width", stroke_width_links_mouseout);

}


function on_click_function(d) {

  svg.selectAll(".node circle") // rende la stroke rossa dei nodi a zero per tutti
    .data(nodes)
    .style("stroke-width", "0px");

  svg.selectAll(".node text")   // rende il testo grande uguale per tutti
    .data(nodes)
    .filter(function (x) { return x.name != last_clicked.name })
    .style("stroke-width", "0px")
    .style("font-size", size_node_text);


  svg.selectAll(".node circle")   // il cerchio di quello che preme diventa rosso
    .data(nodes)
    .filter(function (x) { return x.name == d.name })
    // .style('fill', 'rgb(255, 220, 0)')
    //.style("stroke-width", stroke_width_node_circle)
    //.attr("r", "15")
    .style("z-index", '0');

  svg.selectAll(".node text")     // il testo diventa grande
    .data(nodes)
    .filter(function (x) { return x.name == d.name })
    // .style('fill', fill_node_text_when_pressed)
    .style("font-size", size_node_text_when_pressed)
    .style("z-index", '2');


}



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

function ontick(n) {
  // link.attr("x1", function(d) { return d.source.x; })
  // .attr("y1", function(d) { return d.source.y; })
  // .attr("x2", function(d) { return d.target.x; })
  // .attr("y2", function(d) { return d.target.y; })
  // .attr("k", function(d) { return d.k;  });  //useless 4 now

  n.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

  svg.selectAll(".node").data(nodes)[0][50].transition()
    .duration(100).setAttribute("transform", "translate(100,100).transition()")

  svg.selectAll(".node circle").transition().duration(1000).attr("transform", "translate(1200,100)")
}
