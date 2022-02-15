var firstTime = true;
var margin = { top: 30, right: 380, bottom: 150, left: 120 },
  width = 430,
  height = 430;


/*
var x_m = d3.scaleBand().range([0, width]),
  z = d3.scaleLinear().domain([0, 1]).clamp(true),
  c = d3.scaleSequential(d3.interpolatePlasma)
    .domain([0,1]);
*/

// Transform the "similarity" to correlation:
var scaleCorr = d3.scaleLinear().domain([0, 1]).range([-1, 1]);

var powScale = d3.scalePow()
  .exponent(2)
  .domain([0, 1])
  .range([0, 1]);


var x_m = d3.scaleBand().range([0, width]),
  z = d3.scaleLinear().domain([0, 1]).clamp(true),
  c = d3.scaleSequential(
    //(d) => d3.interpolatePlasma(logScale.invert(d)))
    (d) => d3.interpolatePlasma(powScale(d)))
//(d) => d3.interpolateRdYlBu(powScale(d)))
//(d) => d3.interpolateSpectral(powScale(d)))


var svg_matrix = d3.select("#matrix_div").append("svg")
  .attr("id", "svg_matrix")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("margin-left", 0 + "px") // delete
  .append("g")
  .attr("transform", "translate(" + 110 + "," + 100 + ")");

d3.select("#svg_matrix")
  .on("mouseleave", mouseleave_matrix);

function mouseleave_matrix() {
  d3.selectAll(".row text").classed("non-active-x", false);
  d3.selectAll(".column text").classed("non-active-y", false);
  d3.selectAll(".row text").classed("active-x", false);
  d3.selectAll(".column text").classed("active-y", false);
  d3.selectAll(".row text").classed("activeReduced-x", false);
  d3.selectAll(".column text").classed("activeReduced-y", false);
  d3.selectAll(".text").attr('fill', 'red').attr('opacity', 1)


}



/* LEGEND MATRIX */
var w = width, h = 50;

var key = d3.select("#legend_matrix")
  .append("svg")
  .attr("id", "svg_legend_matrix")
  .attr("width", w)
  .attr("height", h)
  .attr("transform", "rotate(-90)")
  //.on("mouseover", brushed);



var legend = key.append("defs")
  .append("svg:linearGradient")
  .attr("id", "gradient")
  .attr("x1", "0%")
  .attr("y1", "100%")
  .attr("x2", "100%")
  .attr("y2", "100%")
  .attr("spreadMethod", "pad");

legend.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", c(0))
  .attr("stop-opacity", 1);

legend.append("stop")
  .attr("offset", "33%")
  .attr("stop-color", c(0.33))
  .attr("stop-opacity", 1);

legend.append("stop")
  .attr("offset", "66%")
  .attr("stop-color", c(0.66))
  .attr("stop-opacity", 1);

legend.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", c(1))
  .attr("stop-opacity", 1);

key.append("rect")
  .attr("width", w)
  .attr("height", h - 30)
  .style("fill", "url(#gradient)")
  .attr("transform", "translate(0,10)");

//Same width of the matrix
var y_leg = d3.scaleLinear()
  .range([width, 0])
  .domain([1, 0]);

var yAxis = d3.axisBottom()
  .scale(y_leg)
  .ticks(10);

key.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(0,30)")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(90)")
  .attr("y", 0)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("axis title");


// Add brushing
d3.select("#svg_legend_matrix")
  .append("g")
  .attr("class", "brushX")
  .on("click", deactivate_brush)
  .call(d3.brushX()                     // Add the brush feature using the d3.brush function
    .on("brush", brushed)
    .extent([[0, 10], [430, 31]])       // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  )

// removes handle to resize the brush
d3.selectAll('.brushX>.handle--e').remove();

var old_brush = undefined;
let brushScale = d3.scaleLinear()
  .domain([0, 430])
  .range([-1, 1]);
var legend_brush_x;
var old_brush;


var brushed_flag = false;
function brushed() {
  legend_brush_x = d3.select(".brushX").selectAll(".selection").attr("x");
  d3.selectAll('.brushX>.selection').attr("width", 430 - legend_brush_x)
  console.log("BRUSHED");
  brushed_flag = true;
  if (legend_brush_x && legend_brush_x != old_brush) {
    setvals(brushScale(legend_brush_x))
    old_brush = legend_brush_x;
  }
}

let T_ARR_OLD = Object.assign({}, T_ARR);

function deactivate_brush() {
  if (brushed_flag) {
    brushed_flag = false;
    setvals(T_ARR_OLD[index_of_similarity_in_use]);
  }
}

/****************/

var first_file_json = "data_close";
if (firstTime) {
  fullMatrix(first_file_json);
}


function fullMatrix(file_json) {
  actual_file_json = file_json;
  if (!firstTime) {
    svg_matrix.selectAll("*").remove();
    d3.selectAll('.brushX').remove();
    // Insert again the brush
    brush = d3.brushX()
    d3.select("#svg_legend_matrix")
      .append("g")
      .attr("class", "brushX")
      .on("click", deactivate_brush)
      .call(d3.brushX()                     // Add the brush feature using the d3.brush function
        .on("brush", brushed)
        .extent([[0, 10], [430, 31]])       // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      )
    // Display none the rectangle of the previous brush
    d3.selectAll('.brushX>.selection').style("display", "None")
    // removes handle to resize the brush
    d3.selectAll('.brushX>.handle--w').style("display", "None");
    // Set again the possibility to use the brush
    d3.selectAll('.brushX').attr("pointer-events", "All");
  }
  

  //data_close_2015
  d3.json("similarities/" + file_json + ".json", function (crypto_top_100) {
    var matrix = [],
      nodes = crypto_top_100.nodes,
      n = nodes.length;

    // Compute index per node.
    nodes.forEach(function (node, i) {
      node.index = i;     // Initialize attribute "index"
      node.count = 0;     // Initialize attribute "count"
      // Each row of the matrix contains an array in range n ([0,...,99])
      // and "map" will access this value and return an object {x,y,z}
      // In the end we have matrix[i][j]{x,y,z}
      matrix[i] = d3.range(n).map(function (j) { return { x: j, y: i, z: 0 }; });
    });
    // Convert links to matrix; count character occurrences.
    crypto_top_100.links.forEach(function (link) {
      // Between source and target (symmetric matrix)
      matrix[link.source][link.target].z = link.value;
      matrix[link.target][link.source].z = link.value;

      // Between source/source and target/target
      //matrix[link.source][link.source].z = link.value;
      //matrix[link.target][link.target].z = link.value;

      // Count express the sum of all the link between a node and all the others
      // So it's the sum of the distances between it and all the other values
      // In other words: express how much a coin is different from other
      nodes[link.source].count += link.value;
      nodes[link.target].count += link.value;
    });

    // Precompute the orders.
    var orders = {
      name: d3.range(n).sort(function (a, b) { return d3.ascending(nodes[a].Name, nodes[b].Name); }),
      count: d3.range(n).sort(function (a, b) { return nodes[b].count - nodes[a].count; }),
    };

    // The default sort order.
    var ord_val = document.getElementById("order").value;
    x_m.domain(orders[ord_val]);

    ///////////////////////////////////
    // Return top % on 
    similarity_array_unsorted = []
    k = 0;
    for (i = 0; i < 100; i++) {
      for (j = i + 1; j < 100; j++) {
        if (matrix[i][j].z == -1) {
          similarity_array_unsorted[k] = 0;
        }
        else {
          similarity_array_unsorted[k] = matrix[i][j].z;
        }
        k += 1;
      }
    }
    // similarity_array has length 4950
    similarity_array_sorted = similarity_array_unsorted.sort(function (a, b) { return a - b; }).reverse() //Ordered by number of similarity

    // This should be the number of links that has similarity value different from zero (if year, different from 4950)
    var n_of_links = 0
    for (i = 0; i < similarity_array_sorted.length; i++) {
      if (similarity_array_sorted[i] != 0) {
        n_of_links += 1;
      }
    }

    var top_10 = n_of_links * 0.1;
    var top_5 = n_of_links * 0.05;
    var top_1 = n_of_links * 0.01;
    // top 10%, top 5%, top 0.1%
    var threshold_array = [similarity_array_sorted[Math.round(top_10)],
    similarity_array_sorted[Math.round(top_5)],
    similarity_array_sorted[Math.round(top_1)]]


    cardinality_array = []
    for (i = 0; i < 100; i++) {
      k = 0;
      cardinality_array[i] = k
      for (j = 0; j < 100; j++) {
        // If that link has value greater than treshold for top 10%, add to cardinality array
        if (matrix[i][j].z >= threshold_array[0]) {
          k += 1;
          cardinality_array[i] = k;
        }
      }
    }

    console.log("similarity from: \t \t" + file_json + "\n" +
      "n_of_links: \t \t \t" + n_of_links + "\n" +
      "threshold_array: \t \t[" + threshold_array + "]" + "\n" +
      "cardinality_array:\t[" + cardinality_array + "] \n \n")
    /////////////


    // Generation of the matrix on the webpage
    // Rectangle background
    svg_matrix.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

    // Rows of the matrix
    var row = svg_matrix.selectAll(".row")
      .data(matrix)
      .enter().append("g")
      .attr("class", "row")
      .attr("transform", function (d, i) { return "translate(0," + x_m(i) + ")"; })
      .each(row);

    // Line dividing two rows
    row.append("line")
      .attr("x2", width);

    // Name of the crypto on the left
    row.append("text")
      .attr("x", -6)
      .attr("y", x_m.bandwidth() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .attr('fill', 'white')
      .text(function (d, i) { return nodes[i].Name; });

    // Columns
    var column = svg_matrix.selectAll(".column")
      .data(matrix)
      .enter().append("g")
      .attr("class", "column")
      .attr("transform", function (d, i) { return "translate(" + x_m(i) + ")rotate(-90)"; });

    // Line dividing two columns
    column.append("line")
      .attr("x1", -width);

    // Text on top of the matrix
    column.append("text")
      .attr("x", 6)
      .attr("y", 0)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .attr("transform", "rotate(30)")
      .attr('fill', 'white')
      .text(function (d, i) { return nodes[i].Name; });


    // Change the legend matrix from 0/1 to -1/+1
    var legend_texts = d3.select("#svg_legend_matrix").selectAll("text")
    legend_texts.text(function (d) {
      var textElem = d3.select(this);

      if (d == 0) {
        textElem.attr('x', "2.5")
        return scaleCorr(d).toFixed(0);
      }
      else if (d == 1) {
        textElem.attr('x', "-2")
        return scaleCorr(d).toFixed(0);
      }
      else {
        return scaleCorr(d).toFixed(1);
      }
    });


    /*
    legend_texts (function(d) { 
      console.log(d)
      if (d.text == 0){
        d.attr('x',"2");
      }
      else if (d.text == 1) {
        d.attr('x',"-2");
      }
    });*/
    function row(row) {
      
      var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function (d) { return d.z >= -1; }))
        .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function (d) { return x_m(d.x); })
        .attr("width", x_m.bandwidth())
        .attr("height", x_m.bandwidth())
        //.style("fill-opacity", function(d) { return z(d.z); })
        //.style("fill", function(d) {return d3.interpolateMagma(d.z); })
        .style("fill", function (d) { return d.z == -1 ? "rgb(53, 53, 53)" : c(d.z); })
        //.style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", mouseclick)

    }

    function mouseover(p) {
      d3.selectAll(".row text").classed("active-x", function (d, i) { return i == p.y; });
      d3.selectAll(".column text").classed("active-y", function (d, i) { return i == p.x; });
      d3.selectAll(".row text").classed("non-active-x", function (d, i) { return i != p.y; });
      d3.selectAll(".column text").classed("non-active-y", function (d, i) { return i != p.x; });

      var window_color = color1;
      //var value_to_show = p.z.toFixed(3);
      var value_to_show = scaleCorr(p.z).toFixed(3);
      if (p.z == -1) window_color = "grey";
      if (p.z == -1) value_to_show = "&#8709;";

      var g = svg_matrix.append('g').attr("id", "similarity");
      g.append('rect')
        .attr("x", function (d) { return x_m(p.x) - 45; })
        .attr("y", function (d) { return x_m(p.y) + 10; })
        .attr("width", 120)
        .attr("height", 47)
        .style("fill", window_color)
        .style("opacity", "0.9");
      //.style("rx", "0px");

      g.append("text")
        .style("fill", "white")
        .attr("x", function (d) { return x_m(p.x) - 40; })
        .attr("y", function (d) { return x_m(p.y) + 25; })
        .style("font-size", "15px")
        .text(nodes[p.y].Name);
      g.append("text")
        .style("fill", "white")
        .attr("x", function (d) { return x_m(p.x) - 40; })
        .attr("y", function (d) { return x_m(p.y) + 40; })
        .style("font-size", "15px")
        .text(nodes[p.x].Name);
      g.append("text")
        .style("fill", "white")
        .attr("x", function (d) { return x_m(p.x) - 40; })
        .attr("y", function (d) { return x_m(p.y) + 55; })
        .style("font-size", "15px")
        .html(value_to_show);

    }

    function mouseout() {
      d3.selectAll("text").classed("active", false);
      svg_matrix.selectAll("#similarity").remove();
    }

    function mouseclick(p) {
      // Each row text is ordered as d[k][i].x, given that d is now a list (instead of a matrix)
      // we just need to select the correct row inside a range between 0 and n (number of rows)
      // when the i-th x of d element is equal to p.y (or p.x) return true.
      d3.selectAll(".row text").classed("activeReduced", function (d, i) { return d[i].x == p.y; });
      d3.selectAll(".column text").classed("activeReduced", function (d, i) { return d[i].x == p.x; });

      crypto_name_matrix1 = nodes[p.y].Name;
      crypto_name_matrix2 = nodes[p.x].Name;
      createGraphsOfMyCrypto(nodes[p.y].Name, nodes[p.x].Name);
      create_scatterplot(crypto_name_matrix1, crypto_name_matrix2);
    }

    d3.select("#order").on("change", function () {
      order(this.value);
    });

    function order(value) {
      x_m.domain(orders[value]);

      var t = svg_matrix.transition().duration(2500);

      t.selectAll(".row")
        .delay(function (d, i) { return x_m(i) * 4; })
        .attr("transform", function (d, i) { return "translate(0," + x_m(i) + ")"; })
        .selectAll(".cell")
        .delay(function (d) { return x_m(d.x) * 4; })
        .attr("x", function (d) { return x_m(d.x); });

      t.selectAll(".column")
        .delay(function (d, i) { return x_m(i) * 4; })
        .attr("transform", function (d, i) { return "translate(" + x_m(i) + ")rotate(-90)"; });
    }

  });
  firstTime = false;
}


function matrixReduction(node_name, file_json, slider_value) {
  if (!firstTime) {
    svg_matrix.selectAll("*").remove();
  }


  /*
  // Remove elements to resize the brush
  d3.select("#svg_legend_matrix")
    .append("g")
    .attr("class", "brushX")
    .call(d3.brushX()                     // Add the brush feature using the d3.brush function
      .on("brush", brushed)
      .extent([[0, 10], [430, 31]])       // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    )
  */
  // removes handle to resize the brush
  d3.selectAll('.brushX>.handle--e').remove();
  d3.selectAll('.brushX>.handle--w').remove();
  // removes crosshair cursor
  d3.selectAll('.brushX>.overlay').remove();
  d3.selectAll('.brushX>.selection').attr("cursor", null);
  // Set fixed maximum brush
  legend_brush_x = d3.select(".brushX").selectAll(".selection").attr("x");
  d3.selectAll('.brushX>.selection').attr("width", 430 - legend_brush_x)
  
  d3.selectAll('.brushX').attr("pointer-events", "None")

  
  d3.json("similarities/" + file_json + ".json", function (crypto_top_100) {
    var matrix = [],
      nodes = crypto_top_100.nodes,
      n = nodes.length;

    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].Name == node_name) {
        var id = i;
        break;
      }
    }

    // Compute index per node
    nodes.forEach(function (node, i) {
      node.index = i;     // Initialize attribute "index"
      node.count = 0;     // Initialize attribute "count"
      // Each column of the matrix contains an array in range n ([0,...,99])
      // and "map" will access this value and return an object {x,y,z}
      // In the end we have matrix[i][j]{x,y,z}
      matrix[i] = d3.range(n).map(function (j) { return { x: j, y: i, z: 0 }; });
    });
    // Convert links to matrix; count sum of the value
    crypto_top_100.links.forEach(function (link, i) {
      // Between source and target (symmetric matrix)
      matrix[link.source][link.target].z = link.value;
      matrix[link.target][link.source].z = link.value;
      // Between source/source and target/target
      //matrix[link.source][link.source].z = link.value;
      //matrix[link.target][link.target].z = link.value;

      // Count express the sum of all the link between a node and all the others
      // So it's the sum of the distances between it and all the other values
      // In other words: express how much a coin is different from other

      nodes[link.source].count += link.value;
      nodes[link.target].count += link.value;
    });

    var order_distance = new Array(n).fill(0);
    for (var j = 0; j < n; j++) {
      order_distance[j] = matrix[id][j]; // Select the column of ID and loop in all the rows
    }
    //console.log(order_distance);
    // Sort the columns for row ID wrt Z in ascending order
    order_distance = order_distance.sort(function (a, b) { return a.z - b.z; }).reverse();
    //console.log(order_distance);

    for (var i = 0; i < n; i++) {
      if (Number(String(order_distance[i].z).slice(0, 5)) < slider_value) {
        n = i;
        break;
      }
    }
    if (i == 1) {
      n = 1;
    }

    order_distance = order_distance.slice(0, n);
    // Aggiunto per avere i nodi ordinati secondo index, una volta scelti gli n piu simili

    // Reorder the matrix based on the selected element
    var matrix2 = new Array(n).fill(0).map(() => new Array(n).fill(0));
    for (var col = 0; col < n; col++) {
      for (var r = 0; r < n; r++) {
        // E.g. matrix[0][9] -> x=9, y=0;
        matrix2[col][r] = matrix[order_distance[col].x][order_distance[r].x];
      }
    }
    var ordered_nodes = new Array(n).fill(0);
    // Before i<n... commentare fill color che da problemi con n=10
    for (var i = 0; i < n; i++) {
      ordered_nodes[i] = nodes[order_distance[i].x];
    }

    //nodes = ordered_nodes; NON FUNZIONAVA!
    //nodes = nodes.slice(0,n);
    matrix = matrix2;
    // Precompute the orders.
    var orders = {
      name: d3.range(n).sort(function (a, b) { return d3.ascending(ordered_nodes[a].Name, ordered_nodes[b].Name); }),
      count: d3.range(n).sort(function (a, b) { return ordered_nodes[b].count - ordered_nodes[a].count; }),
    };

    // The default sort order.
    var ord_val = document.getElementById("order").value;
    x_m.domain(orders[ord_val]);

    // Generation of the matrix on the webpage
    // Rectangle background
    svg_matrix.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

    // Rows of the matrix
    var row = svg_matrix.selectAll(".row")
      .data(matrix)
      .enter().append("g")
      .attr("class", "row")
      .attr("transform", function (d, i) { return "translate(0," + x_m(i) + ")"; })
      .each(row);

    // Line dividing two rows
    row.append("line")
      .attr("x2", width);

    // Name of the crypto on the left
    var dim_row_text = (n <= 10) ? 13 : 10;

    row.append("text")
      .attr("x", -6)
      .attr("y", x_m.bandwidth() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .attr('fill', function (d, i) { var selected_text_color = (node_name == ordered_nodes[i].Name) ? color2 : 'white'; return selected_text_color })
      .attr('font-size', dim_row_text + 'px')
      .text(function (d, i) { return ordered_nodes[i].Name; });

    // Columns
    var column = svg_matrix.selectAll(".column")
      .data(matrix)
      .enter().append("g")
      .attr("class", "column")
      .attr("transform", function (d, i) { return "translate(" + x_m(i) + ")rotate(-90)"; });

    // Line dividing two columns
    column.append("line")
      .attr("x1", -width);

    // Text on top of the matrix
    var rotation_col_text = (n <= 10) ? 90 : 30;
    var y_col_text = (n <= 10) ? -10 : 0;
    var dim_col_text = (n <= 10) ? 13 : 10;
    column.append("text")
      .attr("x", -25)
      .attr("y", y_col_text)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .attr('fill', function (d, i) { var selected_text_color = (node_name == ordered_nodes[i].Name) ? color1 : 'white'; return selected_text_color })
      .attr("transform", "rotate(" + rotation_col_text + ")translate(30)")
      .attr('font-size', +dim_col_text + 'px')
      .text(function (d, i) { return ordered_nodes[i].Name; });

    // Change the legend matrix from 0/1 to -1/+1
    var legend_texts = d3.select("#svg_legend_matrix").selectAll("text")
    legend_texts.text(function (d) {
      var textElem = d3.select(this);

      if (d == 0) {
        textElem.attr('x', "2.5")
        return scaleCorr(d).toFixed(0);
      }
      else if (d == 1) {
        textElem.attr('x', "-2")
        return scaleCorr(d).toFixed(0);
      }
      else {
        return scaleCorr(d).toFixed(1);
      }
    });

    function row(row) {
      var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function (d) { return d.z >= -1; }))
        .enter().append("rect")
        .attr("class", "cell")
        //.attr("x", function(d) { return x_m(d.x); }) In this case, no symmetric matrix.
        .attr("x", function (d, i) { return x_m(i); })
        .attr("width", x_m.bandwidth())
        .attr("height", x_m.bandwidth())
        //.style("fill-opacity", function(d) { return z(d.z); })
        .style("fill", function (d) { return d.z == -1 ? "grey" : c(d.z); })
        //.style("fill", function(d) { return ordered_nodes[d.x].group == ordered_nodes[d.y].group ? c(ordered_nodes[d.x].group) : null; }) // Da commentare con n = 10
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", mouseclick);
    }

    function mouseover(p) {
      // Each row text is ordered as d[k][i].x, given that d is now a list (instead of a matrix)
      // we just need to select the correct row inside a range between 0 and n (number of rows)
      // when the i-th x of d element is equal to p.y (or p.x) return true.
      d3.selectAll(".row text").classed("activeReduced-x", function (d, i) { return d[i].x == p.y; });
      d3.selectAll(".column text").classed("activeReduced-y", function (d, i) { return d[i].x == p.x; });
      d3.selectAll(".row text").classed("non-active-x", function (d, i) { return d[i].x != p.y; });
      d3.selectAll(".column text").classed("non-active-y", function (d, i) { return d[i].x != p.x; });

      var window_color = color1
      //var value_to_show = p.z.toFixed(3);
      var value_to_show = scaleCorr(p.z).toFixed(3);
      if (p.z == -1) window_color = "grey";
      if (p.z == -1) value_to_show = "&#8709;";


      for (var i = 0; i < n; i++) {
        if (matrix[0][i].x == p.x) {
          var simil_x = i;
        }
      }
      for (var i = 0; i < n; i++) {
        if (matrix[0][i].x == p.y) {
          var simil_y = i;
        }
      }


      var g = svg_matrix.append('g').attr("id", "similarity");
      g.append('rect')
        .attr("x", function (d) { return x_m(simil_x) - 45; })
        .attr("y", function (d) { return x_m(simil_y) + 50; })
        .attr("width", 120)
        .attr("height", 49)
        .style("fill", window_color)
        .style("opacity", "0.9");
      //.style("rx", "0px");

      g.append("text")
        .style("fill", "white")
        .attr("x", function (d) { return x_m(simil_x) - 40; })
        .attr("y", function (d) { return x_m(simil_y) + 65; })
        .style("font-size", "15px")
        .text(nodes[p.y].Name);
      g.append("text")
        .style("fill", "white")
        .attr("x", function (d) { return x_m(simil_x) - 40; })
        .attr("y", function (d) { return x_m(simil_y) + 80; })
        .style("font-size", "15px")
        .text(nodes[p.x].Name);
      g.append("text")
        .style("fill", "white")
        .attr("x", function (d) { return x_m(simil_x) - 40; })
        .attr("y", function (d) { return x_m(simil_y) + 95; })
        .style("font-size", "15px")
        .html(value_to_show);
    }

    function mouseout() {
      d3.selectAll("text").classed("activeReduced", false);
      svg_matrix.selectAll("#similarity").remove();
    }

    function mouseclick(p) {
      // Each row text is ordered as d[k][i].x, given that d is now a list (instead of a matrix)
      // we just need to select the correct row inside a range between 0 and n (number of rows)
      // when the i-th x of d element is equal to p.y (or p.x) return true.
      d3.selectAll(".row text").classed("activeReduced", function (d, i) { return d[i].x == p.y; });
      d3.selectAll(".column text").classed("activeReduced", function (d, i) { return d[i].x == p.x; });

      crypto_name_matrix1 = nodes[p.y].Name;
      crypto_name_matrix2 = nodes[p.x].Name;

      createGraphsOfMyCrypto(crypto_name_matrix1, crypto_name_matrix2);
      create_scatterplot(crypto_name_matrix1, crypto_name_matrix2);
    }

    d3.select("#order").on("change", function () {
      order(this.value);
    });

    function order(value) {
      x_m.domain(orders[value]);

      var t = svg_matrix.transition().duration(2500);

      t.selectAll(".row")
        .delay(function (d, i) { return x_m(i) * 4; })
        .attr("transform", function (d, i) { return "translate(0," + x_m(i) + ")"; })
        .selectAll(".cell")
        //.delay(function(d) { return x_m(d.x) * 4; })
        .delay(function (d, i) { return x_m(i) * 4; })
        //.attr("x", function(d) { return x_m(d.x); });
        .attr("x", function (d, i) { return x_m(i); });

      t.selectAll(".column")
        .delay(function (d, i) { return x_m(i) * 4; })
        .attr("transform", function (d, i) { return "translate(" + x_m(i) + ")rotate(-90)"; });
    }

  });
}

function full_matrix_or_reduced(last_clicked, data_json, actual_t) {
  if (!firstTime) {
    // Added to avoid refreshing of the matrix when brush is applied
    if (!(legend_brush_x && legend_brush_x != old_brush)) {
      if (last_clicked == "" && mouse_down_on_slider == -1) {
        fullMatrix(data_json);
      }
      else if (last_clicked != "" && (mouse_down_on_slider == 0 || mouse_down_on_slider == -1)) {
        matrixReduction(last_clicked.name, data_json, actual_t)
      }
    }
  }
  if (mouse_down_on_slider == 0) {
    mouse_down_on_slider = -1;
  }
}