var firstTime = true;
var margin = {top: 80, right: 0, bottom: 10, left: 80},
    width = 500,
    height = 500;


var x_m = d3.scaleBand().range([0, width]),
    //z = d3.scaleLinear().domain([0, 4]).clamp(true),
    z = d3.scaleLinear().domain([0, 1]).clamp(true),
    c = d3.scaleOrdinal(d3.schemeCategory10);
    //c = d3.scalePow().exponent(1.09).range(["yellow", "red"])



var svg_matrix = d3.select("body").append("svg")
    .attr("id", "svg_matrix")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px") // delete
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Senza => no nomi e attaccata


// Dropdown elements creation DA ELIMINARE DURANTE IL MERGE
/*
for (var k = 0; k < 100; k++) {
  navLink = document.createElement("a");
  navLink.id = k;
  navLink.text = k;
  navLink.href = "#";
  navLink.addEventListener("click", matrixReduction);
  document.getElementById("myDropdown").appendChild(navLink);
}
*/
if (firstTime){
  fullMatrix();
  firstTime = false;
}


function fullMatrix() {
  d3.json("data.json", function(crypto_top_100) {
    var matrix = [],
        nodes = crypto_top_100.nodes,
        n = nodes.length;

    // Compute index per node.
    nodes.forEach(function(node, i) {
      node.index = i;     // Initialize attribute "index"
      node.count = 0;     // Initialize attribute "count"
      // Each row of the matrix contains an array in range n ([0,...,99])
      // and "map" will access this value and return an object {x,y,z}
      // In the end we have matrix[i][j]{x,y,z}
      matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
    });

    // Convert links to matrix; count character occurrences.
    crypto_top_100.links.forEach(function(link) {
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
      name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].Name, nodes[b].Name); }),
      count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
    };

    // The default sort order.
    x_m.domain(orders.name);


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
        .attr("transform", function(d, i) { return "translate(0," + x_m(i) + ")"; })
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
        .text(function(d, i) { return nodes[i].Name; });

    // Columns
    var column = svg_matrix.selectAll(".column")
        .data(matrix)
      .enter().append("g")
        .attr("class", "column")
        .attr("transform", function(d, i) { return "translate(" + x_m(i) + ")rotate(-90)"; });

    // Line dividing two columns
    column.append("line")
        .attr("x1", -width);

    // Text on top of the matrix
    column.append("text")
        .attr("x", 6)
        .attr("y", x_m.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text(function(d, i) { return nodes[i].Name; });

    function row(row) {
      var cell = d3.select(this).selectAll(".cell")
          .data(row.filter(function(d) { return d.z>=0; }))
        .enter().append("rect")
          .attr("class", "cell")
          .attr("x", function(d) { return x_m(d.x); })
          .attr("width", x_m.bandwidth())
          .attr("height", x_m.bandwidth())
          .style("fill-opacity", function(d) { return z(d.z); })
          .style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; })
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);
    }

    function mouseover(p) {
      d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
      d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
    }

    function mouseout() {
      d3.selectAll("text").classed("active", false);
    }

    d3.select("#order").on("change", function() {
      order(this.value);
    });

    function order(value) {
      x_m.domain(orders[value]);

      var t = svg_matrix.transition().duration(2500);

      t.selectAll(".row")
          .delay(function(d, i) { return x_m(i) * 4; })
          .attr("transform", function(d, i) { return "translate(0," + x_m(i) + ")"; })
        .selectAll(".cell")
          .delay(function(d) { return x_m(d.x) * 4; })
          .attr("x", function(d) { return x_m(d.x); });

      t.selectAll(".column")
          .delay(function(d, i) { return x_m(i) * 4; })
          .attr("transform", function(d, i) { return "translate(" + x_m(i) + ")rotate(-90)"; });
    }

  });
}


function matrixReduction(node_name) {

  if (!firstTime) {
    svg_matrix.selectAll("*").remove();
  }
  firstTime = false;

  //var id = this.id;

  d3.json("data.json", function(crypto_top_100) {
    var matrix = [],
        nodes = crypto_top_100.nodes,
        n = nodes.length;

    for (var i = 0; i < nodes.length; i++){
      if (nodes[i].Name == node_name){
        var id = i;
        break;
      }
    }

    // Compute index per node
    nodes.forEach(function(node, i) {
        node.index = i;     // Initialize attribute "index"
        node.count = 0;     // Initialize attribute "count"
        // Each column of the matrix contains an array in range n ([0,...,99])
        // and "map" will access this value and return an object {x,y,z}
        // In the end we have matrix[i][j]{x,y,z}
        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
    });
    // Convert links to matrix; count sum of the value
    crypto_top_100.links.forEach(function(link, i) {
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
    for (var j=0; j < n; j++){
      order_distance [j] = matrix[id][j]; // Select the column of ID and loop in all the rows
    }
    //console.log(order_distance);
    // Sort the columns for row ID wrt Z in ascending order
    order_distance = order_distance.sort(function(a, b) { return a.z - b.z; });
    //console.log(order_distance);


    n = 10;
    order_distance = order_distance.slice(0,n);

    // Aggiunto per avere i nodi ordinati secondo index, una volta scelti i 10 piu simili
    //order_distance = order_distance.sort(function(a, b) { return a.x - b.x; });

    // Reorder the matrix based on the selected element
    var matrix2 = new Array(n).fill(0).map(() => new Array(n).fill(0));
    for (var col = 0; col < n; col++) {
      for (var r = 0; r < n; r++){
        // E.g. matrix[0][9] -> x=9, y=0;
        matrix2[col][r] = matrix[order_distance[col].x][order_distance[r].x];
      }
    }
    var ordered_nodes = new Array(n).fill(0);
    // Before i<n... commentare fill color che da problemi con n=10
    for (var i = 0; i < n; i++){
      ordered_nodes[i] = nodes[order_distance[i].x];
    }

    //nodes = ordered_nodes; NON FUNZIONAVA!
    //nodes = nodes.slice(0,n);
    matrix = matrix2;
    // Precompute the orders.
    var orders = {
      name: d3.range(n).sort(function(a, b) { return d3.ascending(ordered_nodes[a].Name, ordered_nodes[b].Name); }),
      count: d3.range(n).sort(function(a, b) { return ordered_nodes[b].count - ordered_nodes[a].count; }),
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
        .attr("transform", function(d, i) {return "translate(0," + x_m(i) + ")"; })
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
        .text(function(d, i) {return ordered_nodes[i].Name; });

    // Columns
    var column = svg_matrix.selectAll(".column")
        .data(matrix)
      .enter().append("g")
        .attr("class", "column")
        .attr("transform", function(d, i) { return "translate(" + x_m(i) + ")rotate(-90)"; });

    // Line dividing two columns
    column.append("line")
        .attr("x1", -width);

    // Text on top of the matrix
    column.append("text")
        .attr("x", 6)
        .attr("y", x_m.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text(function(d, i) { return ordered_nodes[i].Name; });

    function row(row) {
      var cell = d3.select(this).selectAll(".cell")
          .data(row.filter(function(d) { return d.z>=0; }))
        .enter().append("rect")
          .attr("class", "cell")
          //.attr("x", function(d) { return x_m(d.x); }) In this case, no symmetric matrix.
          .attr("x", function(d,i) { return x_m(i); })
          .attr("width", x_m.bandwidth())
          .attr("height", x_m.bandwidth())
          .style("fill-opacity", function(d) { return z(d.z); })
          //.style("fill", function(d) { return ordered_nodes[d.x].group == ordered_nodes[d.y].group ? c(ordered_nodes[d.x].group) : null; }) // Da commentare con n = 10
          .on("mouseover", mouseover)
          .on("mouseout", mouseout);
    }

    function mouseover(p) {
      // Each row text is ordered as d[k][i].x, given that d is now a list (instead of a matrix)
      // we just need to select the correct row inside a range between 0 and n (number of rows)
      // when the i-th x of d element is equal to p.y (or p.x) return true.
      d3.selectAll(".row text").classed("active", function(d, i) { return d[i].x == p.y; });
      d3.selectAll(".column text").classed("active", function(d, i) { return d[i].x == p.x; });
    }

    function mouseout() {
      d3.selectAll("text").classed("active", false);
    }

    d3.select("#order").on("change", function() {
      order(this.value);
    });

    function order(value) {
      x_m.domain(orders[value]);

      var t = svg_matrix.transition().duration(2500);

      t.selectAll(".row")
          .delay(function(d, i) { return x_m(i) * 4; })
          .attr("transform", function(d, i) { return "translate(0," + x_m(i) + ")"; })
        .selectAll(".cell")
          //.delay(function(d) { return x_m(d.x) * 4; })
          .delay(function(d,i) { return x_m(i) * 4; })
          //.attr("x", function(d) { return x_m(d.x); });
          .attr("x", function(d,i) { return x_m(i); });

      t.selectAll(".column")
          .delay(function(d, i) { return x_m(i) * 4; })
          .attr("transform", function(d, i) { return "translate(" + x_m(i) + ")rotate(-90)"; });
    }

  });
}
