var theALPHA_VAR = 2 //swap var

function alph_order() {
    
    theALPHA_VAR = ((theALPHA_VAR +1) % 3)
    
    changeVisualization()
    
}

function changeVisualization(){
    if (document.getElementById('t0_radio').checked) {
      var radio = document.getElementById("t0_radio").value;
    }
    else {
      var radio = document.getElementById("year_radio").value;
    }
    var attribute = document.getElementById("attribute_selection").value;
    var year = document.getElementById("year_selection").value;

    

    if (radio == 't0'){
        document.getElementById("year_selection").hidden = true;
        document.getElementById("year_selection_text").hidden = true;
        switch (attribute) {
        case 'high':
            data_json = "data_high"
            set_node_pos(theALPHA_VAR,1)
            create_graph(1)
            break;
        case 'low':
            data_json = "data_low";
            set_node_pos(theALPHA_VAR,1)
            create_graph(2)
            break;
        case 'market_cap':
            data_json = "data_market_cap";
            set_node_pos(theALPHA_VAR,3)
            create_graph(3)
            break;
        case 'open':
            data_json = "data_open";
            set_node_pos(theALPHA_VAR,4)
            create_graph(4)
            break;
        case 'volume':
            data_json = "data_volume";
            set_node_pos(theALPHA_VAR,5)
            create_graph(5)         
            break;
        case 'close':
            data_json = "data_close";
            set_node_pos(theALPHA_VAR,0)
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
            set_node_pos(theALPHA_VAR,7)
            create_graph(7)
            }
            else if (year == '2016') {
            data_json = "data_high_2016"
            set_node_pos(theALPHA_VAR,13)
            create_graph(13)
            }
            else {
            data_json = "data_high_2017"
            set_node_pos(theALPHA_VAR,19)
            create_graph(19)
            }
            break;
        case 'low':
            if (year == '2015') {
            data_json = "data_low_2015";
            set_node_pos(theALPHA_VAR,8)
            create_graph(8)
            }
            else if (year == '2016') {
            data_json = "data_low_2016";
            set_node_pos(theALPHA_VAR,14)
            create_graph(14)
            }
            else {
            data_json = "data_low_2017";
            set_node_pos(theALPHA_VAR,20)
            create_graph(20)
            }
            break;
        case 'market_cap':
            if (year == '2015') {
            data_json = "data_market_cap_2015";
            set_node_pos(theALPHA_VAR,9)
            create_graph(9)
            }
            else if (year == '2016') {
            data_json = "data_market_cap_2016";
            set_node_pos(theALPHA_VAR,15)
            create_graph(15)
            }
            else {
            data_json = "data_market_cap_2017";
            set_node_pos(theALPHA_VAR,21)
            create_graph(21)
            }
            break;
        case 'open':
            if (year == '2015') {
            data_json = "data_open_2015";
            set_node_pos(theALPHA_VAR,10)
            create_graph(10)
            }
            else if (year == '2016') {
            data_json = "data_open_2016";
            set_node_pos(theALPHA_VAR,16)
            create_graph(16)
            }
            else {
            data_json = "data_open_2017";
            set_node_pos(theALPHA_VAR,22)
            create_graph(22)
            }
            break;
        case 'volume':
            if (year == '2015') {
            data_json = "data_volume_2015";
            set_node_pos(theALPHA_VAR,11)
            create_graph(11)
            }
            else if (year == '2016') {
            data_json = "data_volume_2016";
            set_node_pos(theALPHA_VAR,17)
            create_graph(17)
            }
            else {
            data_json = "data_volume_2017";
            set_node_pos(theALPHA_VAR,23)
            create_graph(23)
            }      
            break;
        case 'close':
            if (year == '2015') {
            data_json = "data_close_2015";
            set_node_pos(theALPHA_VAR,6)
            create_graph(6)           
            }
            else if (year == '2016') {
            data_json = "data_close_2016";
            set_node_pos(theALPHA_VAR,12)
            create_graph(12)
            }
            else {
            data_json = "data_close_2017";
            set_node_pos(theALPHA_VAR,18)
            create_graph(18)
            }
            break;
        }
    }
    if(last_clicked!="")
    setTimeout(() => {CLICK(last_clicked)
        
    }, 50); 
  }
