function changeVisualization(){
    if (document.getElementById('t0_radio').checked) {
      var radio = document.getElementById("t0_radio").value;
    }
    else {
      var radio = document.getElementById("year_radio").value;
    }
    var attribute = document.getElementById("attribute_selection").value;
    var year = document.getElementById("year_selection").value;

    console.log(radio);
    console.log(attribute);
    console.log(year);

    if (radio == 't0'){
        document.getElementById("year_selection").hidden = true;
        document.getElementById("year_selection_text").hidden = true;
        switch (attribute) {
        case 'high':
            data_json = "data_high"
            create_graph(1)
            break;
        case 'low':
            data_json = "data_low";
            create_graph(2)
            break;
        case 'market_cap':
            data_json = "data_market_cap";
            create_graph(3)
            break;
        case 'open':
            data_json = "data_open";
            create_graph(4)
            break;
        case 'volume':
            data_json = "data_volume";
            create_graph(5)         
            break;
        case 'close':
            data_json = "data_close";
            create_graph(0)
            break;
        }
    }
    else {
        document.getElementById("year_selection").hidden = false;
        document.getElementById("year_selection_text").hidden = false;
        switch (attribute) {
        case 'high':
            if (year == '2015') {
            data_json = "data_high_2015"
            create_graph(7)
            }
            else if (year == '2016') {
            data_json = "data_high_2016"
            create_graph(13)
            }
            else {
            data_json = "data_high_2017"
            create_graph(19)
            }
            break;
        case 'low':
            if (year == '2015') {
            data_json = "data_low_2015";
            create_graph(8)
            }
            else if (year == '2016') {
            data_json = "data_low_2016";
            create_graph(14)
            }
            else {
            data_json = "data_low_2017";
            create_graph(20)
            }
            break;
        case 'market_cap':
            if (year == '2015') {
            data_json = "data_market_cap_2015";
            create_graph(9)
            }
            else if (year == '2016') {
            data_json = "data_market_cap_2016";
            create_graph(15)
            }
            else {
            data_json = "data_market_cap_2017";
            create_graph(21)
            }
            break;
        case 'open':
            if (year == '2015') {
            data_json = "data_open_2015";
            create_graph(10)
            }
            else if (year == '2016') {
            data_json = "data_open_2016";
            create_graph(16)
            }
            else {
            data_json = "data_open_2017";
            create_graph(22)
            }
            break;
        case 'volume':
            if (year == '2015') {
            data_json = "data_volume_2015";
            create_graph(11)
            }
            else if (year == '2016') {
            data_json = "data_volume_2016";
            create_graph(17)
            }
            else {
            data_json = "data_volume_2017";
            create_graph(23)
            }      
            break;
        case 'close':
            if (year == '2015') {
            data_json = "data_close_2015";
            create_graph(6)           
            }
            else if (year == '2016') {
            data_json = "data_close_2016";
            create_graph(12)
            }
            else {
            data_json = "data_close_2017";
            create_graph(18)
            }
            break;
        }
    }
  }
