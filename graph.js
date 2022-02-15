threshold0 = 0.9599203439955711
threshold1 = 0.9814371590335464
threshold2 = 0.978382766168612


var T_ARR = //min value to create the link, baseline
  [0.9598377676355152, 0.954764086916276, 0.9622385796804991, 0.9645476488315503, 0.9596504472418033, 0.7364907572231746,
    0.8056734344857461, 0.7936566007331114, 0.8328306417437831, 0.81590715368864, 0.8076139591599294, 0.6039178481792998,
    0.8464393369708181, 0.8248564605749555, 0.8684098260423625, 0.8641256103078544, 0.8460754586966066, 0.5810492687935018,
    0.9612183299008994, 0.955265558604166, 0.9651361562564238, 0.9621548425249444, 0.9615374515893493, 0.7109360307806543]

var T_ARR_medium =
  [0.9707866582742337, 0.9663051532728639, 0.9724622317908826, 0.9737050596019544, 0.970739808238023, 0.7751710048056932,
    0.8755368460119818, 0.8525403070280532, 0.8849086304570315, 0.8693784719261519, 0.8779509978401979, 0.6499696404162836,
    0.8846514988995254, 0.8661238905177455, 0.9046736926881773, 0.8963319233570297, 0.8846202991274328, 0.6208326636832797,
    0.968590606214579, 0.9637139370053984, 0.9720694445348708, 0.969683864564796, 0.9689080337364345, 0.7520614302411703]

var T_ARR_high =
  [0.9813954101833389, 0.9794888225067592, 0.9833422513215253, 0.9836507594831148, 0.9815176142468249, 0.8375238046535366,
    0.9458688876311849, 0.9434885371355382, 0.9413695962605968, 0.934077859242332, 0.9466111312671828, 0.7791958868136004,
    0.9353941057665913, 0.9273717925677756, 0.9495205345608297, 0.9387866240312474, 0.9387779057158157, 0.716473440337532,
    0.9792464720602758, 0.9761449321224998, 0.981012989448163, 0.98049324004802, 0.979151084613305, 0.8251534557954563]

//var T_ARR_MAX = [1.0,1.0,1.0,1.0,1.0,1.0,
//                  1.0,1.0,1.0,1.0,1.0,1.0,
//                  1.0,1.0,1.0,1.0,1.0,1.0]

var index_of_similarity_in_use = 0 //initial graph index used
//var old_index_of_similarity = 0

///DATABASE
var data_reg = {}  //REG NAME ID ECC
var name_arr = []  //ARR with names only
var name_arr_not_sorted = []

//D3 OBJ
var width = 2700;  //d3 object width
var height = 1500; //d3 obj height

//GRAPH VALUESs
var x_c = (width + 100) / 2;
var y_c = height / 2;

var radius = 600;
var theta = 2 * Math.PI / 100 //split 2pi into 2pi/n_nodes

if(navigator.userAgent.indexOf("opr") > -1 && !!window.opr){ theta = 1.999 * Math.PI / 100}
var ellisse = false


//CSS VAR NAMES

//COLOR LINKS FOR SLIDER UPDATE AND MOUSEOVER
color_links = color1//"rgb(2, 200, 255)"
stroke_width_links_mouseover = "10px"  //on mouseout
stroke_width_links_mouseout = "1px"
links_stroke_when_filtered_out = 'rgba(100,100,100,0.0)'

///NODE TEXT
fill_node_text = 'rgb(255, 255, 255)'
fill_node_text_when_pressed = 'rgb(255, 196, 0)'
size_node_text_when_pressed = '60px'
size_node_text = '35px'

//NODES VALUES
fill_node_circle = color2//"#FF6600"//'rgb(255, 102, 0)'
stroke_width_node_circle = '100px'
radius_node_circle = '15  '

///SLIDER
var initial_threshold = T_ARR[0]; //THRESHOLD MIN x creare il nodo!
var initial_threshold_slider = initial_threshold; //THRESHOLD BASE OF THE SLIDER
var fix_val_slider = (1 - initial_threshold) * 100 //2 if 0.95, 0 if 0.9, 0.5 if 0.8 ..

// output.innerHTML=0.95
// actual_t = 0.95

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");   //0 - 0.1   0.9 + 0.1*x x = 1
// 0.95 + 0.1*x x=5
// 0.8 + 0.1*x   x=(1 - initial)*10

//
output.innerHTML = //String(90 + slider.value / 10) + "%(" +
  //rr((slider.value * fix_val_slider / 1000) + initial_threshold_slider)
  // Show show the percentage correlation value (instead of [0,1])
  ((rr((slider.value * fix_val_slider / 1000) + initial_threshold_slider))*100).toFixed(1)+"%"
  //+ ")";

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

formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

function rr(v) {
  return Number(String(v).slice(0, 5))
} //3rd decimal n

function getZeros(v) {
  if (v == undefined) return 0
  v = String(v).slice(0, 5)
  rest = v.split(".")
  if (rest == undefined || v == 0 || v == 1) return v.concat(".000")
  if (rest[1].length == 1) return v.concat("00")
  if (rest[1].length == 2) return v.concat("0")
  return v
}

slider.oninput = function () {
  //console.log(this.value* fix_val_slider / 10000)
  actual_t = rr(((this.value * fix_val_slider / 10000)) + initial_threshold_slider); // slider range 0-100 norm in 0 1
  //output.innerHTML =  getZeros(actual_t)  ;
  // From [0,1] to correlation percentage
  output.innerHTML =  (getZeros(actual_t)*100).toFixed(1)+"%"
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
    .style('stroke', function (x) { return ret_link_col(x) })

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
  d3.json("similarities/data_" + json_file + ".json", function (data) {
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
    aux = new Array(100).fill(0.000)
    for (var j = 0; j < 100; j++) {
      aux[j] = q[name_arr_not_sorted.indexOf(name_arr[i])][name_arr_not_sorted.indexOf(name_arr[j])]
    }
    w.push(aux)
  }
  return w;
}

function getJ(i) {
  if (i < 6) return 0
  if (i < 12) return 1
  if (i < 18) return 2
  return 3
}

//N buttons of similarity we want to use, to give to each link
n_similarities = 6
arr_similarity_matrix = []
year_arr = ["", "_2015", "_2016", "_2017"]
arr_path = ["close", "high", "low", "market_cap", "open", "volume"]

for (var i = 0; i < n_similarities * 4; i++) {
  var aux = []
  //get_random_simmetric(100);

  //console.log(String(arr_path[i%6])+year_arr[getJ(i)])
  create_100100_matrix(String(arr_path[i % 6]) + year_arr[getJ(i)], aux)
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

function Order_innerFirst_outerNext(list_to_order) { //the first of the list is even so goes on the outer ring //wrong is in the inner?
  //so we use [first outer,first inner,second outer,second inner..]
  //we have in the list [first inner, second inner..last inner, first outer, second outer... last outer]
  //from [0,1,2,3...49(last inner), 50(first outer), 51..99] to [50, 0, 51, 1, 52, 2..99, 49]
  aux_list_ordered = []
  for (i = 0; i < 50; i++) {
    for (j = 0; j < 2; j++) {
      if (j % 2 == 0)
        aux_list_ordered.push(list_to_order[i])
      else
        aux_list_ordered.push(list_to_order[i + 50])
    }
  }
  return aux_list_ordered
}


//get n node from the hat and give them to node namecoin in datareg
//if nodes are over a threshold from the(TODO each) similarity matrix we assign a link
function get_links(namecoin, similarity_idx) { //NON IN USO

  namecoin_idx = name_arr.indexOf(namecoin)
  links = []
  var namecoin_similarity_arr = []

  if (similarity_idx == -1) //non capita mai, ignora
    namecoin_similarity_arr = arr_sim_old[0][namecoin_idx]
  else
    namecoin_similarity_arr = arr_similarity_matrix[similarity_idx][namecoin_idx]

  //console.log(namecoin_similarity_arr)
  // console.log("l arr a cui collegarmi è!")
  // console.log(namecoin_similarity_arr)
  for (var i = 0; i < 100; i++) {   //was in n_links to keep n links max, now 100 coins
    //namecoin = name_arr[i*4] //Math.round(Math.random()*100)]
    if (namecoin_similarity_arr[i] >= initial_threshold && i != namecoin_idx)
      //!!! THRESHOLD MINIMA PER CREARE IL NODO (DEPRECATED)
      links = links.concat(name_arr[i])
  }
  return links
}

//same as before but for the new purpose of having a new node array to display in a different order
function get_links_new(namecoin, similarity_idx) {

  namecoin_idx = name_arr.indexOf(namecoin)
  links = []
  var namecoin_similarity_arr = []

  namecoin_similarity_arr = arr_similarity_matrix[similarity_idx][namecoin_idx]

  for (var i = 0; i < 100; i++) {
    if (namecoin_similarity_arr[i] >= initial_threshold && i != namecoin_idx) //&& namecoin_similarity_arr[i] <= T_ARR_MAX[similarity_idx]) 
      //!!! THRESHOLD MINIMA PER CREARE IL NODO(EFFETTIVA!)
      links = links.concat(name_arr[i])
  }
  return links
}

//UP DATAREG setting the links
function update_reg_links(index_of_similarity_in_use) {
  for (var i = 0; i < 100; i++) {
    namecoin = name_arr[i]
    data_reg[namecoin][2] = get_links_new(namecoin, index_of_similarity_in_use)

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



function get_array_of_ordered_nodes_in_use(CHANGE, index_used) {
  aux = name_arr_alp_sorted
  CHANGE_VAL = CHANGE


  if (CHANGE == 0) {   // Order_innerFirst_outerNext( SIMIL_CARD_ordered_list)//
    return Order_innerFirst_outerNext(Matrix_of_names_CARD[index_used])
  }

  else if (CHANGE == 1) {   // SIMIL_CARD_ordered_list //
    return Matrix_of_names_CARD[index_used]
  }

  return aux
}

//fill name_arr and sort it, set data_reg(name)=([x,y],name,[links])
function set_node_pos(CHANGE, index_used) {
  d3v3.csv("dataset/100List.csv", function (data) {

    for (var i = 0; i < data.length; i++) {
      name_arr = name_arr.concat(data[i].Name)  //fill name_arr with names
    }
    name_arr_not_sorted = name_arr.concat()
    name_arr.sort().reverse() //alphabetical order

    alp_name_arr_sorted = name_arr

    name_arr = get_array_of_ordered_nodes_in_use(CHANGE, index_used)


    for (var i = 0; i < name_arr.length; i++) {  //create in data reg[name] an entry with (x,y),name
      namecoin = name_arr[i]
      aux_radius = radius
      theta_i = -theta * i
      //theta_i -= Math.PI/2 //se partiamo da sopra

      if (i % 2 == 0) aux_radius = radius * 0.75 //if it's even reduce the radius
      x = x_c + Math.cos(theta_i) * aux_radius + 520 * Math.cos(theta_i)
      if (i % 2 != 0) x = x + 100 * Math.cos(theta_i) //if is odd space a bit more on the x
      y = y_c + Math.sin(theta_i) * aux_radius
      y += 100 * (Math.sin(theta_i)) * (Math.abs(Math.sin(theta_i))) ** 10
      if (i % 2 == 0) y += 10 * (Math.sin(theta_i)) * (Math.abs(Math.sin(theta_i))) ** 100
      /*
          if (namecoin == "Dogecoin") { y += 30, x -= 30 }
          if (namecoin == "Radium") { y -= 20, x -= 20 }
          if (namecoin == "DigitalNote") { y += 20, x -= 20 }
          if (namecoin == "Rise") { y += 0, x += 10 }
      */
      x += Math.sign(Math.cos(theta * i)) * 10
      data_reg[namecoin] = [[x, y], namecoin]
    }
    //update_reg_links(0); //set in datareg all the links
  });
}

var CHANGE_VAL = 2 //var per i link che uso sotto
set_node_pos(CHANGE_VAL, index_of_similarity_in_use)

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


colore0 = "rgba(0, 200, 255,1)"
colore1 = "rgba(0, 200, 255,0.75)"
colore2 = "rgba(0, 200, 255, 0.5)"

/*
colore1 = "rgba(255, 0, 0 ,0.75)" red high value
colore2 = "rgba(0, 255,0, 0.5)"  green medium value
*/

// Decommentate e mettete i colori qui
/*
colore0 = "rgba(0, 200, 255,1)" //colore importante (0% -> 0.1%)
colore1 = "rgba(242,226,210)"  //medio 0.1% -> 0.5%
colore2 = "rgba(79,180,119)"  //basso 0.5 -> 1%
*/

function ret_link_col(d) {
  threshold1 = T_ARR_high[index_of_similarity_in_use]
  threshold2 = T_ARR_medium[index_of_similarity_in_use]

  if (d.k >= threshold1) return colore0
  if (d.k >= threshold2) return colore1
  return colore2
}

function ret_node_col(d) {
  grade = //data_reg[d.name][2].length//
    matrix_of_simil_CARD[index_of_similarity_in_use][M_CAP_ordered_list.indexOf(d.name)]
  //prende dalle liste di cardinalità il relativo valore (es lista bitcoin, eth.. index di bitcoin = 0 
  //=> grado di bitcoin = 18)
  if (grade >= 26 - 1) return "rgb(255, 0, 0)" //-1 for the connection with itself
  if (grade >= 11 - 1) return "rgb(255, 125, 0)" //-1 for the connection with itself
  if (grade >= 3 - 1) return "rgb(180, 150, 0)"
  return "rgb(100, 100, 0)"
}

function ret_stroke(d) {
  threshold1 = T_ARR_medium[index_of_similarity_in_use]
  threshold2 = T_ARR_high[index_of_similarity_in_use]

  if (d.k >= threshold1) return "1.25px"
  if (d.k >= threshold2) return "1px"
  return " .75px"
}

function set_slider_params(idx) {
  initial_threshold = rr(T_ARR[idx]); //THRESHOLD MIN x creare il nodo!
  initial_threshold_slider = initial_threshold; //THRESHOLD BASE OF THE SLIDER
  fix_val_slider = (1 - initial_threshold) * 100
  //output.innerHTML = getZeros(initial_threshold);
  // From [0,1] to correlation percentage
  output.innerHTML =  (getZeros(initial_threshold)*100).toFixed(1)+"%"
  slider.value = 0
  actual_t = initial_threshold
  full_matrix_or_reduced(last_clicked, data_json, actual_t);
  //slider_update(actual_t)
}

var reshape_flag = 1; //1 iterazione quando apre la pagina DA METTERE PRIMA DEL CREATE_GRAPH
//update_reg_links(0); !! CI SERVE PURE QUESTO PRIMA?
var data_json = "data_close" //first attribute
var actual_graph_used = -1

create_graph(0)  //DA RIMETTERE A ZERO

function create_graph(new_graph_index) {

  if (actual_graph_used == 1212) return //DA commentare
  actual_graph_used = new_graph_index   //DA commentare
  if (reshape_flag != 1) //quindi se non è la prima volta
  {
    //console.log("cambio valori slider iniziali,e reshape flag è:" + String(reshape_flag))
    set_slider_params(new_graph_index)
  }


  d3v3.csv("similarities/data_close.json", function () {  // per ogni namecoin prendo i relativi link to add dal datareg

    svg.selectAll("*").remove()

    /* USED
     if (grade >= 26-1) return "rgb(255, 0, 0)" //-1 for the connection with itself
    if (grade >= 11-1) return "rgb(255, 125, 0)" //-1 for the connection with itself
    if (grade >= 3-1) return "rgb(180, 150, 0)"
    return "rgb(100, 100, 0)"  
    */
    y_first_row = 150
    y_second_row = 75
    y_third_row = 220
    x_rows = 30
    svg.append("circle").attr("cx", x_rows + 340).attr("cy", y_second_row).attr("r", 14)
      .style("fill", "rgb(255, 0, 0)").style("stroke", "black").style("stroke-width", "2px")

    svg.append("circle").attr("cx", x_rows + 505 - 50).attr("cy", y_second_row).attr("r", 14)
      .style("fill", "rgb(255, 125, 0)").style("stroke", "black").style("stroke-width", "2px")

    svg.append("circle").attr("cx", x_rows + 600).attr("cy", y_second_row).attr("r", 14)
      .style("fill", "rgb(180, 150, 0)").style("stroke", "black").style("stroke-width", "2px")

    svg.append("circle").attr("cx", x_rows + 710).attr("cy", y_second_row).attr("r", 14)
      .style("fill", "rgb(100, 100, 0)").style("stroke", "black").style("stroke-width", "2px")

    svg.append("text").attr("x", x_rows).attr("y", y_second_row + 5).text("Crypto node degree:" +
      "\n\n\xa0\xa0\xa0\xa025+,\xa0\xa0\xa0\xa0\xa024-10,\xa0\xa0\xa0\xa0\xa09-1,\xa0\xa0\xa0\xa0\xa00")
      .style("font-size", "35px").attr("alignment-baseline", "middle")
      .attr("fill", fill_node_text)

    svg.append("text").attr("x", x_rows).attr("y", y_third_row).text("⭯ \t Ordered counterclockwise")
      .style("font-size", "35px").attr("alignment-baseline", "middle")
      .attr("fill", fill_node_text)
/*
  if (d.k >= threshold1) return "1.25px"
  if (d.k >= threshold2) return "1px"
  return " .75px"
*/ x1 = 275
    x2 = 420
    x3 = 570
    svg.append("line")
      .style("stroke", "rgb(2, 200, 255)")
      .style("stroke-width", 7)
      .attr("x1", x1)
      .attr("y1", y_first_row - 20)
      .attr("x2", x1 + 23)
      .attr("y2", y_first_row + 6);

    svg.append("line")
      .style("stroke", "rgba(2, 200, 255,0.75)")
      .style("stroke-width", 7)
      .attr("x1", x2)
      .attr("y1", y_first_row - 20)
      .attr("x2", x2 + 23)
      .attr("y2", y_first_row + 6);

    svg.append("line")
      .style("stroke", "rgba(2, 200, 255,0.5)")
      .style("stroke-width", 7)
      .attr("x1", x3)
      .attr("y1", y_first_row - 20)
      .attr("x2", x3 + 23)
      .attr("y2", y_first_row + 6);

    // .attr("cx",70).attr("cy",140).attr("r", 12)
    // .style("fill", color_links)

    svg.append("text").attr("x", x_rows).attr("y", y_first_row).text("Correlation link:\xa0\xa0\xa0\xa0 top1%,\xa0\xa0\xa0\xa0top5%,\xa0\xa0\xa0\xa0top10%")
      .style("font-size", "35px").attr("alignment-baseline", "middle")
      .attr("fill", fill_node_text)

    old_index_of_similarity = index_of_similarity_in_use
    index_of_similarity_in_use = new_graph_index

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


    InnerAndOuter_nodes = Matrix_of_names_CARD[index_of_similarity_in_use]
    InnerF_outerL_nodes = Order_innerFirst_outerNext(Matrix_of_names_CARD[index_of_similarity_in_use])

    name_arr = name_arr_alp_sorted  //Order_innerFirst_outerNext(Matrix_of_names_CARD[index_of_similarity_in_use])

    //print("chiamo get con var " + CHANGE_VAL)
    //print(get_array_of_ordered_nodes_in_use(CHANGE_VAL))
    //print( name_arr)

    // Order_innerFirst_outerNext(Matrix_of_names_CARD[index_of_similarity_in_use]) //con questo va la prima schermata
    // get_array_of_ordered_nodes_in_use(new_graph_index)

    //if(index_of_similarity_in_use != old_index_of_similarity || index_of_similarity_in_use==0)

    update_reg_links(index_of_similarity_in_use)

    nodes = name_arr;
    links = [];
    for (var i = 0; i < 100; i++) {
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
      .style("stroke-width", function (d) { return stroke_width_links_mouseout; }); //NOT important?

    var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force_graph.drag)

      .on("mouseover", function (d) {  ///TO UPDATE con data_reg e non selectall, e d.source.name

        on_click_function(d)

      })
      .on("mousedown", function (d) {    //ricolora tutto come al normale
        last_x = parseInt(d.x)

        
        //on_click_function()
        //on_mouseout_function(d)

      })
      .on("mouseup", function (d) {
        CLICK(d)
      });


    node.append("circle")
      .attr("stroke", "black").style("stroke", "black").style("stroke-width", "3px")
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
z
    if (last_clicked != "") {
      on_mouseout_function(d)
      on_mouseover_function(last_clicked)
    }

    on_mouseout_function()
  });
}

function CLICK(d) {

  x = parseInt(d.x)
  if(last_x != x){ return}
  last_x = x

  if (last_clicked == d || last_clicked.name == d.name) {
    last_clicked = ""
    fullMatrix(data_json)
    on_mouseout_function(d)
    create_scatterplot()
    change_graphs = false
    return
  }
  on_mouseout_function(d)
  arr_tar_names = on_mouseover_function(d)
  last_clicked = d;
  full_matrix_or_reduced(last_clicked, data_json, actual_t);
  createSingleGraphsOfMyCrypto(d.name);
  clicked_graph = true
}

function highlight_subgraph_from_scatterplot(d) {
  CLICK({ name: d })
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
  var target_arr_names = []
  for (var a = 0; a <= n - 1; a++) {
    if (link_target_node[0][a] != undefined)
      target_name = link_target_node[0][a].getAttribute("target");
    else console.log("[ERR]GETATTR. ON EMPTY LINKS" + a)

    svg.selectAll(".node circle")
      .data(nodes)
      .filter(function (x) { return x.name == target_name })
      .style('fill', function (x) { return ret_node_col(x) });

    svg.selectAll(".node text")
      .data(nodes)
      .filter(function (x) { return x.name == target_name })
      .style('fill', fill_node_text);

    target_arr_names = target_arr_names.concat(target_name)

  }
  create_scatterplot_from_graph(target_arr_names.concat(d.name))
}


function on_mouseout_function(d) {

  svg.selectAll(".node circle")  //ricolora i cerchi
    .data(nodes)
    .style('fill', function (x) { return ret_node_col(x) });

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
    .style('stroke', function (x) { return ret_link_col(x) })
    .style("stroke-width", function (x) { return ret_stroke(x) });

}


function on_click_function(d) {

  svg.selectAll(".node circle") // rende la stroke rossa dei nodi a zero per tutti
    .data(nodes)
  //.style("stroke-width", "0px");

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

function setvals(baseline) {
  T_ARR[index_of_similarity_in_use] = baseline
  //T_ARR_MAX[index_of_similarity_in_use]=0.85
  update_reg_links(index_of_similarity_in_use)
  create_graph(index_of_similarity_in_use)
}





//set_node_pos(a), 374375namearr



/*
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
*/

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


//TO THINK
/*
X scatter interattivo
cursore on mouseover
X grafi iniziali vuoti/bianco se 1 solo?
X similitudini menù a tendina 
Cambiare value slider , 90% ?
Text dello scatter
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

span = 1 - T_ARR[0]
aux_span = span/3
threshold2 = T_ARR[0]+aux_span
threshold1 = threshold2 + aux_span


0.9599203439955711
0.9708419175354708
0.9814371590335464

//01 02 03
0.9814371590335464
0.978382766168612
0.9756817761737007

//TEST order flag
NO_ordering_flag = true


function changeGraphOrder(){
  NO_ordering_flag = !NO_ordering_flag
  //set_node_pos()
  //create_graph(0)
}

*/

/*

//recap funzione del grafo
      
raggio = costante

for i da 0 a 99:

  theta = -i * (2 * Math.PI / 100) //prendo l'angolo in senso antiorario

  if (i pari): // sono nella corona interna
    raggio = raggio *0.75
  
  y = y_centro + sin(theta) * raggio
  x = x_centro + cos(theta) * raggio + 520 * cos(theta) //incremento lineare sull'asse orizzontale

  //spike verticale
  y += sin(theta) * abs(sin(theta)) ^ 10 //incremento non lineare verticale

  //fine tuning
 
  if(i pari): //per aumentare lo spike nella corona esterna
    y += 10 * sin(theta) * abs(sin(theta)) ^ 100

  //per aumentare lo spazio centrale e dare spazio ai nomi
  x += sign(cos(theta))*10

  if(i dispari): //leggero incremento nella corona interna
    x = x + 100 * cos(theta)

  */


