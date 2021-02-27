//-----------SET DEI PARAMETRI NECESSARI PER DEFINIRE I VARI GRAFICI--------------------------------------------------

var cryptonames = ["Bitcoin", "Ethereum", "Bitcoin Cash", "Ripple", "Dash", "Litecoin", "NEM", "IOTA", "Monero",
                    "Ethereum Classic", "NEO", "BitConnect", "Lisk", "Zcash", "Stratis", "Waves", "Ark",
                "Steem", "Bytecoin", "Decred", "BitShares", "Stellar Lumens", "Hshare", "Komodo", "PIVX", "Factom",
                "Byteball Bytes", "Nexus", "Siacoin", "DigiByte", "BitcoinDark", "GameCredits", "GXShares", "Lykke",
                "Dogecoin", "Blocknet", "Syscoin", "Verge", "FirstCoin", "Nxt", "I-O Coin", "Ubiq", "Particl",
                "NAV Coin", "Rise", "Vertcoin", "Bitdeal", "FairCoin", "Metaverse ETP", "Gulden", "ZCoin", "CloakCoin",
                "NoLimitCoin", "Elastic", "Peercoin", "Aidos Kuneen", "ReddCoin", "LEOcoin", "Counterparty",
                "MonaCoin", "DECENT", "The ChampCoin", "Viacoin", "Emercoin", "Crown", "Sprouts", "ION", "Namecoin",
                "Clams", "BitBay", "OKCash", "Unobtanium", "Diamond", "Skycoin", "MonetaryUnit", "SpreadCoin",
                "Mooncoin", "Expanse", "SIBCoin", "ZenCash", "PotCoin", "Radium", "Burst", "LBRY Credits", "Shift",
                "DigitalNote", "Neblio", "Einsteinium", "Compcoin", "Omni", "ATC Coin", "Energycoin", "Rubycoin",
                "Gambit", "E-coin", "SaluS", "Groestlcoin", "BlackCoin", "Golos", "GridCoin"]

//-----------------dimensione dei grafici----------------
var margin1 = {top: 10, right: 0, bottom: 60, left: 80};
var width1 = (360 - margin1.left - margin1.right)*zoom;
var height1 = (330 - margin1.top - margin1.bottom)*zoom;
//-------------------------------------------------------

var need_candlestick = false;
//how many graphs do I want to create?
number_of_graphs=3
// number_of_boxplot=2

rel_or_abs = 'Absolute'
clicked = true
single_chart=true
already_draw=false
change_graphs=false
first_time_draw = true
//opacity_param=1.0
//let's create the svgs for each graph!
var svg_arr=[]
var svg_arr_boxplot=[]

for(i=0;i<number_of_graphs;i++){
    svg_arr[i] = d3.select("#my_dataviz").append("svg").attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom).append("g").attr("transform","translate(" + margin1.left + "," + margin1.top + ")").attr("id", i)
}




//----------FUNZIONE CHIAMATA ONCLICK PER OGNI CRYPTO---------------------------------------

createSingleGraphsOfMyCrypto("Bitcoin",false,true)

document.getElementById("MyBtn").addEventListener("click", function() {

    if(already_draw){
        if(single_chart){
            clicked = !clicked;
            if(clicked) {
                rel_or_abs = 'Absolute';
                document.getElementById("MyBtn").innerHTML = rel_or_abs+' scale';
                functionOnClickSingle(rel_or_abs,change_graphs)
            }
            else rel_or_abs = 'Relative'
            document.getElementById("MyBtn").innerHTML = rel_or_abs+' scale';
            functionOnClickSingle(rel_or_abs,change_graphs)
        }
        else{
            clicked = !clicked;
            if(clicked) {
                rel_or_abs = 'Absolute';
                document.getElementById("MyBtn").innerHTML = rel_or_abs+' scale';
                functionOnClick(rel_or_abs,change_graphs)
            }
            else rel_or_abs = 'Relative'
            document.getElementById("MyBtn").innerHTML = rel_or_abs+' scale';
            functionOnClick(rel_or_abs,change_graphs)

        }
    }
  });


document.getElementById("MyBtn2").addEventListener("click", function() {
    if(already_draw){
        if(single_chart){
            change_graphs = !change_graphs
            functionOnClickSingle(rel_or_abs,change_graphs)
        }
        else
        {
            change_graphs = !change_graphs
            functionOnClick(rel_or_abs,change_graphs)

        }

    }
});

var clicked_graph = false
var last_clicked_scatterplot

function functionOnClick(rel_or_abs=null,change_graphs=change_graphs){


    let name1 = crypto_name_matrix1
    var path_1 = 'dataset/' + String(name1)+ '.csv';
    let name2 = crypto_name_matrix2
    var path_2 = 'dataset/' + String(name2)+ '.csv';

    var _data_ = d3.csv(path_1, function(data1) {
        var __data_ =  d3.csv(path_2, function(data2) {

            for(i=0;i<svg_arr.length;i++){ svg_arr[i].selectAll("*").remove(); }


            data_charts = []


            attr_to_plot = ["close", "market cap", "volume", "high", "low", "open"]

            if(change_graphs) n=5
            else n=2

            if(need_candlestick==false){
                var data_final1 = {"name": name1,"date": [], "high": [],"low": [],"market cap": [],"open": [],"close": [],"volume": []}
                var data_final2 = {"name": name2,"date": [], "high": [],"low": [],"market cap": [],"open": [],"close": [],"volume": []}

            }
            else var data_final = {"key": keyword,"values": []}

            data_final1, _ = preprocess_data(data1,need_candlestick=need_candlestick,data_summary=false,data_final1)
            data_final2, _ = preprocess_data(data2,need_candlestick=need_candlestick,data_summary=false,data_final2)


            draw_multilines_time_chart(svg_arr[0],margin1, data_final1,data_final2, attr_to_plot[n-2], [1,2], 0,number_of_graphs,rel_or_abs=rel_or_abs)

            draw_multilines_time_chart(svg_arr[1],margin1, data_final1,data_final2, attr_to_plot[n-1], [0,2], 1,number_of_graphs,rel_or_abs=rel_or_abs)

            draw_multilines_time_chart(svg_arr[2],margin1, data_final1,data_final2, attr_to_plot[n], [0,1], 2,number_of_graphs,rel_or_abs=rel_or_abs)

            // draw_multilines_time_chart(svg_arr[3],margin1, data_final1,data_final2, attr_to_plot[3], [0,1,2], 3,number_of_graphs,rel_or_abs=rel_or_abs)



        })

    })
}

print(clicked_graph)
function functionOnClickSingle(rel_or_abs=null,change_graphs=change_graphs){

    //already_draw=true

    single_chart=true
    if(clicked_graph){
        if(last_clicked.name == undefined){
            name1 = "Bitcoin"
        }
        else name1 = last_clicked.name 

    }
    else{
        if(last_clicked_scatterplot == undefined){
            name1 = "Bitcoin"
        }
        else name1 = last_clicked_scatterplot 

    }

    var path_1 = 'dataset/' + String(name1)+ '.csv';

    var _data_ = d3.csv(path_1, function(data1) {
        for(i=0;i<svg_arr.length;i++){ svg_arr[i].selectAll("*").remove(); }


        data_charts = []


        attr_to_plot = ["close", "market cap", "volume", "high", "low", "open"]

        if(change_graphs) n=5
        else n=2

        if(need_candlestick==false)
        {
            var data_final1 = {"name": name1,"date": [], "high": [],"low": [],"market cap": [],"open": [],"close": [],"volume": []}
        }
        else var data_final1 = {"key": keyword,"values": []}

        data_final1, _ = preprocess_data(data1,need_candlestick=need_candlestick,data_summary=false,data_final1)




        draw_time_chart(svg_arr[0], margin1, data_final1, attr_to_plot[n-2], [1,2], 0 , number_of_graphs, rel_or_abs=rel_or_abs)

        draw_time_chart(svg_arr[1], margin1, data_final1, attr_to_plot[n-1], [0,2], 1 , number_of_graphs, rel_or_abs=rel_or_abs)

        draw_time_chart(svg_arr[2], margin1, data_final1, attr_to_plot[n], [0,1], 2 , number_of_graphs, rel_or_abs=rel_or_abs)


    })
}



//--------------------------------------------------------------------------------------------------------------------
function create_boxplot(svg,margin1,data_final,attr,color){
    //for(i=0;i<svg_arr_boxplot.length;i++){ svg_arr_boxplot[i].selectAll("*").remove(); }
    return  //na merda

    var data = []
    var data_ = data_final[attr]
    var height = height1
    var width = width1
    var scale_width_rect = 0.5

    var Box = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 2*width)
    .attr("height", height)
    .attr("fill", "rgb(2, 200, 255)")
    .attr("opacity", 0.1);


    if(color==1){
        var col1 = 'rgb(255, 102, 0)' // arancio
        var col2 = "rgb(2, 200, 255)" //azzurrino

    }
    else{
        var col1 = 'white' // bianco
        var col2 = "rgb(2, 200, 255)" //azzurrino
    }

    for(i=0;i<data_.length;i++){
        data.push(parseInt(data_[i]))
    }


    // Compute summary statistics used for the box:
    var data_sorted = data.sort(d3.ascending)
    var q1 = d3.quantile(data_sorted, .25)
    var median = d3.quantile(data_sorted, .5)
    var q3 = d3.quantile(data_sorted, .75)
    var interQuantileRange = q3 - q1
    var min = q1 - 1.5 * interQuantileRange
    var max = q1 + 1.5 * interQuantileRange

   // Show the Y scale
    var y = d3.scaleLinear()
    .domain([0,data.reduce(function(a, b) {return Math.max(a, b);})])
    .range([height, 0]);
    Y_axis = svg.call(d3.axisLeft(y).ticks(6))
    Y_axis.selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-45)").attr('fill', 'white');

    // a few features for the box
    var center = 150
    // var width = 100*(.75)

    // Show the main vertical line
    svg
    .append("line")
    .attr("x1", center)
    .attr("x2", center)
    .attr("y1", y(min))
    .attr("y2", y(max))
    .attr("stroke", col2)

    // Show the box
    svg
    .append("rect")
    .attr("x", center - width/2)
    .attr("y", y(q3) )
    .attr("height", (y(q1)-y(q3)) )
    .attr("width", width )
    .attr("stroke", col2)
    .style("fill", col1)

    // show median, min and max horizontal lines
    svg
    .selectAll("toto")
    .data([min, median, max])
    .enter()
    .append("line")
    .attr("x1", (center-width/2))
    .attr("x2", (center+width/2))
    .attr("y1", function(d){ return(y(d))} )
    .attr("y2", function(d){ return(y(d))} )
    .attr("stroke", col2)
}
//--------------------------------------------------------------------------------------------------------------------


function createGraphsOfMyCrypto(name1,name2='Dogecoin',change_graphs=false,reset=false){
    already_draw=true
    single_chart=false
    var path_1 = 'dataset/' + String(name1)+ '.csv';
    var path_2 = 'dataset/' + String(name2)+ '.csv';

    var _data_ = d3.csv(path_1, function(data1) {
        var __data_ =  d3.csv(path_2, function(data2) {

            for(i=0;i<svg_arr.length;i++){ svg_arr[i].selectAll("*").remove(); }
            for(i=0;i<svg_arr_boxplot.length;i++){ svg_arr_boxplot[i].selectAll("*").remove(); }


            data_charts = []


            attr_to_plot = ["close", "market cap", "volume", "high", "low", "open"]

            if(change_graphs) n=5
            else n=2

            if(reset) opacity_param = 0.0
            else opacity_param=1.0
    

            if(need_candlestick==false){
                var data_final1 = {"name": name1,"date": [], "high": [],"low": [],"market cap": [],"open": [],"close": [],"volume": []}
                var data_final2 = {"name": name2,"date": [], "high": [],"low": [],"market cap": [],"open": [],"close": [],"volume": []}


            }
            else var data_final = {"key": keyword,"values": []}

            data_final1, _ = preprocess_data(data1,need_candlestick=need_candlestick,data_summary=false,data_final1)
            data_final2, _ = preprocess_data(data2,need_candlestick=need_candlestick,data_summary=false,data_final2)



            draw_multilines_time_chart(svg_arr[0],margin1, data_final1,data_final2, attr_to_plot[n-2], [1,2], 0,number_of_graphs,rel_or_abs=rel_or_abs,opacity_value=opacity_param)

            draw_multilines_time_chart(svg_arr[1],margin1, data_final1,data_final2, attr_to_plot[n-1], [0,2], 1,number_of_graphs,rel_or_abs=rel_or_abs,opacity_value=opacity_param)

            draw_multilines_time_chart(svg_arr[2],margin1, data_final1,data_final2, attr_to_plot[n], [0,1], 2,number_of_graphs,rel_or_abs=rel_or_abs,opacity_value=opacity_param)




        })

    })


}

function createSingleGraphsOfMyCrypto(name1,change_graphs=false,reset=false){
    //PER ORA IL CONFRONTO E' FRA QUELLA CHE CLICCO,E Dogecoin.
   if(!first_time_draw) already_draw=true

    single_chart=true
    var path_1 = 'dataset/' + String(name1)+ '.csv';

    var _data_ = d3.csv(path_1, function(data1) {

        for(i=0;i<svg_arr.length;i++){ svg_arr[i].selectAll("*").remove(); }
        for(i=0;i<svg_arr_boxplot.length;i++){ svg_arr_boxplot[i].selectAll("*").remove(); }


        data_charts = []


        attr_to_plot = ["close", "market cap", "volume", "high", "low", "open"]

        if(change_graphs) n=5
        else n=2

        if(reset) opacity_param = 0.0
        else opacity_param=1.0

        if(need_candlestick==false){
            var data_final1 = {"name": name1,"date": [], "high": [],"low": [],"market cap": [],"open": [],"close": [],"volume": []}

        }
        else var data_final = {"key": keyword,"values": []}

        data_final1, _ = preprocess_data(data1,need_candlestick=need_candlestick,data_summary=false,data_final1)

        draw_time_chart(svg_arr[0], margin1, data_final1, attr_to_plot[n-2], [1,2], 0 , number_of_graphs, rel_or_abs=rel_or_abs,opacity_value=opacity_param)

        draw_time_chart(svg_arr[1], margin1, data_final1, attr_to_plot[n-1], [0,2], 1 , number_of_graphs, rel_or_abs=rel_or_abs,opacity_value=opacity_param)

        draw_time_chart(svg_arr[2], margin1, data_final1, attr_to_plot[n], [0,1], 2 , number_of_graphs, rel_or_abs=rel_or_abs,opacity_value=opacity_param)

        first_time_draw=false
    })


}
//FUNZIONE PER DISEGNARE GRAFICI INTERAGIBILI E INTERCONNESSI, CON DUE LINEE SOPRA

function draw_multilines_time_chart(svg,margin1,data_final1,data_final2,attr,param,id_graph,number_of_graphs,rel_or_abs,opacity_value=1.0){
    //FUNZIONE PER DISEGNARE GRAFICI INTERCONNESSI FRA LORO
    //-----------------------------------------------------
    //id is the identification number for the graph.
    //param is a tuple. Contains the identification numbers of all the graphs you want
    //to link the graph to

    var Box = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width1)
    .attr("height", height1)
    .attr("fill", "rgb(2, 200, 255)")
    .attr("opacity", 0.1);

    svg.append("circle").attr("cx",10).attr("cy",20).attr("r", 4).style("fill", 'rgb(255, 102, 0)').style("opacity", opacity_value).style("stroke","black").style("stroke-width","1px")
    svg.append("circle").attr("cx",10).attr("cy",30).attr("r", 4).style("fill", "white").style("opacity", opacity_value).style("stroke","black").style("stroke-width","1px")
    svg.append("text").attr("x", 25).attr("y", 20).text(data_final1['name'] + ' ' + attr+"(in $)").style("font-size", "10px").attr("alignment-baseline","middle").attr("fill", 'rgb(255, 102, 0)').style("opacity", opacity_value)
    svg.append("text").attr("x", 25).attr("y", 30).text(data_final2['name'] + ' ' + attr+"(in $)").style("font-size", "10px").attr("alignment-baseline","middle").attr("fill", "white").style("opacity", opacity_value)

    var data = []
    var data2 = []
    max_1_x = Math.max.apply(null, data_final1['date']);
    max_2_x = Math.max.apply(null, data_final2['date']);
    min_1_x = Math.min.apply(null, data_final1['date']);
    min_2_x = Math.min.apply(null, data_final2['date']);
    max_1_y = Math.max.apply(null, data_final1[attr]);
    max_2_y = Math.max.apply(null, data_final2[attr]);
    true_max_x = new Date(Math.max.apply(null,[max_1_x,max_2_x]))
    true_min_x = new Date(Math.min.apply(null,[min_1_x,min_2_x]))
    true_max_y = Math.max.apply(null,[max_1_y,max_2_y])


    for(var i=0;i<data_final1['date'].length;i++){
        data.push(new Object())
        data[i]['date'] = data_final1['date'][i]
        data[i]['value'] = data_final1[attr][i]
    }
    for(var i=0;i<data_final2['date'].length;i++){
        data2.push(new Object())
        data2[i]['date'] = data_final2['date'][i]
        data2[i]['value'] = data_final2[attr][i]
    }


    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }


    // A function that update the chart for given boundaries
    function updateChart() {
        data_array = []
        x_array = []
        xAxis_array = []
        y_array = []
        yAxis_array = []
        data_new_array = []
        line_array = []
        dataFiltered_array = []
        dataFiltered2_array = []
        min_array = []
        max_array = []
        line2_array = []
        data2_array = []

        data_array.push(data_charts[id_graph][5])
        data2_array.push(data_charts[id_graph][7])
        x_array.push(x)
        xAxis_array.push(xAxis)
        y_array.push(y)
        yAxis_array.push(yAxis)
        line_array.push(line)
        line2_array.push(line2)

        var min_time_span = 182529000 // roughly 2 days
        // select a region with boundaries
        var extent = d3.event.selection

        for(i=1;i<number_of_graphs;i++){
            x_array[i] = data_charts[param[i-1]][0]            // x_array = [x, x_new, x_new_2]
            xAxis_array[i] = data_charts[param[i-1]][1]        // xAxis_array = [xAxis, xAxis_new, xAxis_new_2]
            line_array[i] = data_charts[param[i-1]][2]         // line_array = ...
            y_array[i] = data_charts[param[i-1]][3]            // y_array = ...
            yAxis_array[i] = data_charts[param[i-1]][4]        // yAxis_array = ...
            data_array[i] = data_charts[param[i-1]][5]        // data_new_array = [data_,data_new, data_new_2]
            line2_array[i] = data_charts[param[i-1]][6]
            data2_array[i] = data_charts[param[i-1]][7]        // data_new_array = [data_,data_new, data_new_2]

        }


        // If no selection, back to initial coordinate. Otherwise, update X,Y axis domain
        if(!extent)
        {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            for(i=0;i<number_of_graphs;i++){x_array[i].domain([4,8])}

        }
        //se zoommo in una time window minore di due giorni,non faccio niente
        else if(Date.parse(x_array[0].invert(extent[1])) - Date.parse(x_array[0].invert(extent[0]))  < min_time_span){
            svg.select(".brush").call(brush.move, null)
        }
        //altrimenti zoomma tranquillamente
        else{


            //I compute the time window on the first chart only,since the domains are shared


            for(i=0;i<number_of_graphs;i++){



                x_array[i].domain([ x_array[i].invert(extent[0]), x_array[i].invert(extent[1]) ])
                dataFiltered_array[i] = data_array[i].filter(function(d, i) {                           //dataFiltered_array = [dataFiltered,dataFiltered_new,...]
                    if ( (d.date >= x.domain()[0]) && (d.date <= x.domain()[1]) ) {return d.value;}
                })
                dataFiltered2_array[i] = data2_array[i].filter(function(d, i) {                           //dataFiltered_array = [dataFiltered,dataFiltered_new,...]
                    if ( (d.date >= x.domain()[0]) && (d.date <= x.domain()[1]) ) {return d.value;}
                })

                var max_line_1 = maxArrObj(dataFiltered_array[i],'value')
                var max_line_2 = maxArrObj(dataFiltered2_array[i],'value')
                var min_line_1 = minArrObj(dataFiltered_array[i],'value')
                var min_line_2 = minArrObj(dataFiltered2_array[i],'value')

                max_array[i] = get_max(max_line_1,max_line_2)
                if(rel_or_abs=='Relative') min_array[i] = get_min(min_line_1,min_line_2)
                else if(rel_or_abs=='Absolute') min_array[i]=0

            }

            for(i=0;i<number_of_graphs;i++){
                y_array[i].domain([min_array[i],max_array[i]])
            };
            svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been don

            for(i=0;i<number_of_graphs;i++){

                xAxis_array[i].transition().duration(1000).call(d3.axisBottom(x_array[i]).ticks(7))
                xAxis_array[i].selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)").attr('fill', 'white');
                
                yAxis_array[i].transition().duration(1000).call(d3.axisLeft(y_array[i]).ticks(5))
                yAxis_array[i].selectAll("text").attr('fill', 'white');
                for(j=0;j<yAxis_array[i].selectAll("text")._groups[0].length; j++){
                    if(yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML.length>8){
                        text_tick = yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML
                        arr_text = text_tick.split(",")
                        significant_text = arr_text[0]
                        if(arr_text.length-1==2){//i have millions!
                            if(arr_text[1][0]!="0") yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML=significant_text+","+arr_text[1][0] + "mil"
                            else yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML=significant_text + "mil"
                        }
                        else if(arr_text.length-1 ==3){//billions!
                            if(arr_text[1][0]!="0") yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML=significant_text+","+arr_text[1][0] +"bil"
                            else yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML=significant_text +"bil"
                        }
            
                    } //////////////
                }
                line_array[i].select(".line").transition().duration(1000).attr("d", d3.line().x(function(d) {
                    return x_array[i](d.date) }).y(function(d) { return y_array[i](d.value) }))
                    line2_array[i].select(".line").transition().duration(1000).attr("d", d3.line().x(function(d) {
                        return x_array[i](d.date) }).y(function(d) { return y_array[i](d.value) }))
                    }

                }
        // If user double click, reinitialize the chart
        svg.on("dblclick",function(){

            for(i=0;i<number_of_graphs;i++){
                var min_for_dom = new Date( get_min( minArrObj(data_array[i],'date'), minArrObj(data2_array[i],'date') ) )
                var max_for_dom = new Date( get_max(maxArrObj(data_array[i],'date'),minArrObj(data2_array[i],'date') ) )
                var max_for_cod =get_max( maxArrObj( data_array[i],'value'),maxArrObj(data2_array[i],'value'))
                x_array[i].domain([min_for_dom,max_for_dom])

                y_array[i].domain([0, max_for_cod]).range([ height1, 0 ]);
                xAxis_array[i].transition().duration(1000).call(d3.axisBottom(x_array[i]).ticks(7))
                xAxis_array[i].selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)").attr('fill', 'white');

                local_yaxis = d3.axisLeft(y_array[i]).ticks(5)
                

                yAxis_array[i].transition().duration(1000).call(local_yaxis)
                yAxis_array[i].selectAll("text").attr('fill', 'white');
                for(j=0;j<yAxis_array[i].selectAll("text")._groups[0].length; j++){
                    if(yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML.length>8){
                        var text_tick = yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML
                        var arr_text = text_tick.split(",")
                        var significant_text = arr_text[0]
                        if(arr_text.length-1==2){//i have millions!
                            if(arr_text[1][0]!="0") yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML=significant_text+","+arr_text[1][0] + "mil"
                            else yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML=significant_text + "mil"
                        }
                        else if(arr_text.length-1 ==3){//billions!
                            if(arr_text[1][0]!="0") yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML=significant_text+","+arr_text[1][0] +"bil"
                            else yAxis_array[i].selectAll("text")._groups[0][j.toString()].innerHTML=significant_text +"bil"
                        }
            
                    } //////////////
                }
                line_array[i].select('.line').transition().duration(1000).
                attr("d", d3.line()
                .x(function(d) { return x_array[i](d.date) })
                .y(function(d) { return y_array[i](d.value) }))

                line2_array[i].select('.line').transition().duration(1000).
                attr("d", d3.line()
                .x(function(d) { return x_array[i](d.date) })
                .y(function(d) { return y_array[i](d.value) }))

            }
        });


    }


    var line = svg.append('g').attr("clip-path", "url(#clip)")
    var line2 = svg.append('g').attr("clip-path", "url(#clip)")

    // Add X axis --> it is a date format

    var x = d3.scaleTime().domain(d3.extent(data, function(d) { return d.date; })).range([ 0, width1 ]);

    x.domain([true_min_x,true_max_x])

    var xAxis = svg.append("g").attr("transform", "translate(0," + height1 + ")").call(d3.axisBottom(x).ticks(7))
    xAxis.selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)").attr('fill', 'white');


    // Add Y axis
    var y = d3.scaleLinear().domain([0, d3.max(data, function(d) { return +d.value; })]).range([ height1, 0 ]);
    y.domain([0,true_max_y])

    var yAxis = svg.append("g").call(d3.axisLeft(y).ticks(5));

    yAxis.selectAll("text").attr('fill', 'white');

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width1 )
        .attr("height", height1 )
        .attr("x", 0)
        .attr("y", 0);




    // Add brushing
    var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
    .extent( [ [0,0], [width1,height1] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart)              // Each time the brush selection changes, trigger the 'updateChart' function


    // Add the brushing
    line.append("g").attr("class", "brush").call(brush);
    //line2.append("g").attr("class", "brush").call(brush);

    // Add the line
    line.append("path").datum(data).attr("class", "line").attr("fill", "none").attr("stroke", 'rgb(255, 102, 0)').style("opacity",opacity_value)
    .attr("stroke-width", 1.5).attr("d", d3.line().x(function(d) { return x(d.date) }).y(function(d) { return y(d.value) }))

    line2.append("path").datum(data2).attr("class", "line").attr("fill", "none").attr("stroke", "white").style("opacity",opacity_value)
    .attr("stroke-width", 1.5).attr("d", d3.line().x(function(d) { return x(d.date) }).y(function(d) { return y(d.value) }))


    data_charts.push([x,xAxis,line,y,yAxis,data,line2,data2])


}

//FUNZIONE PER DISEGNARE GRAFICI INTERAGIBILI E INTERCONNESSI, MA CON SOLO UNA LINEA SOPRA

function draw_time_chart(svg,margin1,data_final,attr,param,id_graph,number_of_graphs,rel_or_abs,opacity_value=1.0){
    //FUNZIONE PER DISEGNARE GRAFICI INTERCONNESSI FRA LORO
    //-----------------------------------------------------
    //id is the identification number for the graph.
    //param is a tuple. Contains the identification numbers of all the graphs you want
    //to link the graph to


    var Box = svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width1)
    .attr("height", height1)
    .attr("fill", "rgb(2, 200, 255)")
    .attr("opacity", 0.1);

    svg.append("circle").attr("cx",10).attr("cy",20).attr("r", 4).style("fill", 'rgb(255, 102, 0)').style("opacity", opacity_value).style("stroke","black").style("stroke-width","1px")
    svg.append("text").attr("x", 25).attr("y", 20).text(data_final['name'] + ' ' + attr+"(in $)").style("font-size", "10px").attr("alignment-baseline","middle").attr("fill", 'rgb(255, 102, 0)').style("opacity", opacity_value)


    //print(data_final['date'].length)

    var data = []

    for(var i=0;i<data_final['date'].length;i++){
        data.push(new Object())
        data[i]['date'] = data_final['date'][i]
        data[i]['value'] = data_final[attr][i]
    }


    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }


    // A function that update the chart for given boundaries
    function updateChart() {
        data_array = []
        x_array = []
        xAxis_array = []
        y_array = []
        yAxis_array = []
        data_new_array = []
        line_array = []
        dataFiltered_array = []
        min_array = []
        max_array = []
        var min_time_span = 182529000 // roughly 2 days

        data_array.push(data_charts[id_graph][5])
        x_array.push(x)
        xAxis_array.push(xAxis)
        y_array.push(y)
        yAxis_array.push(yAxis)
        line_array.push(line)

        // select a region with boundaries
        var extent = d3.event.selection

        for(i=1;i<number_of_graphs;i++){
            x_array[i] = data_charts[param[i-1]][0]            // x_array = [x, x_new, x_new_2]
            xAxis_array[i] = data_charts[param[i-1]][1]        // xAxis_array = [xAxis, xAxis_new, xAxis_new_2]
            line_array[i] = data_charts[param[i-1]][2]         // line_array = ...
            y_array[i] = data_charts[param[i-1]][3]            // y_array = ...
            yAxis_array[i] = data_charts[param[i-1]][4]        // yAxis_array = ...
            data_array[i] = data_charts[param[i-1]][5]        // data_new_array = [data_,data_new, data_new_2]
        }

        // If no selection, back to initial coordinate. Otherwise, update X,Y axis domain
        if(!extent)
        {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            for(i=0;i<number_of_graphs;i++){x_array[i].domain([4,8])}

        }
        //se zoommo in una time window minore di due giorni,non faccio niente
        else if(Date.parse(x_array[0].invert(extent[1])) - Date.parse(x_array[0].invert(extent[0]))  < min_time_span){
            svg.select(".brush").call(brush.move, null)
        }
        //altrimenti zoomma tranquillamente
        else{
            for(i=0;i<number_of_graphs;i++){
                x_array[i].domain([ x_array[i].invert(extent[0]), x_array[i].invert(extent[1]) ])
                dataFiltered_array[i] = data_array[i].filter(function(d, i) {                           //dataFiltered_array = [dataFiltered,dataFiltered_new,...]
                    if ( (d.date >= x.domain()[0]) && (d.date <= x.domain()[1]) ) {return d.value;}
                })

                max_array[i] = maxArrObj(dataFiltered_array[i],'value') //max_array = [max, max_new,max_new_2]
                if(rel_or_abs=='Relative') min_array[i] = minArrObj(dataFiltered_array[i],'value') //min_array = [min, min_new, min_new_2]
                else if(rel_or_abs=='Absolute') min_array[i]=0

            }

            for(i=0;i<number_of_graphs;i++){
                y_array[i].domain([min_array[i],max_array[i]])};

            svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been don
        }

        for(i=0;i<number_of_graphs;i++){

            xAxis_array[i].transition().duration(1000).call(d3.axisBottom(x_array[i]).ticks(7))
            xAxis_array[i].selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)").attr('fill', 'white');
            yAxis_array[i].transition().duration(1000).call(d3.axisLeft(y_array[i]).ticks(5))
            yAxis_array[i].selectAll("text").attr('fill', 'white');
            line_array[i].select(".line").transition().duration(1000).attr("d", d3.line().x(function(d) {
                return x_array[i](d.date) }).y(function(d) { return y_array[i](d.value) }))
        }

        // If user double click, reinitialize the chart
        svg.on("dblclick",function(){

            for(i=0;i<number_of_graphs;i++){
                x_array[i].domain(d3.extent(data_array[i], function(d) { return d.date; }))
                y_array[i].domain([0, d3.max(data_array[i], function(d) { return +d.value; })]).range([ height1, 0 ]);
                xAxis_array[i].transition().duration(1000).call(d3.axisBottom(x_array[i]).ticks(7))
                xAxis_array[i].selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)").attr('fill', 'white');
                yAxis_array[i].transition().duration(1000).call(d3.axisLeft(y_array[i]).ticks(5))
                yAxis_array[i].selectAll("text").attr('fill', 'white');

                line_array[i].select('.line').transition().duration(1000).
                attr("d", d3.line()
                .x(function(d) { return x_array[i](d.date) })
                .y(function(d) { return y_array[i](d.value) }))

            }
        });


    }


    var line = svg.append('g').attr("clip-path", "url(#clip)")

    // Add X axis --> it is a date format
    var x = d3.scaleTime().domain(d3.extent(data, function(d) { return d.date; })).range([ 0, width1 ]);
    // var xAxis = svg.append("g")
    // .attr("transform", "translate(0," + height + ")")
    // .call(d3.axisBottom(x));
    var xAxis = svg.append("g").attr("transform", "translate(0," + height1 + ")").call(d3.axisBottom(x).ticks(7))
    xAxis.selectAll("text")	.style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-65)").attr('fill', 'white');


    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.value; })])
    .range([ height1, 0 ]);
    var yAxis = svg.append("g")
    .call(d3.axisLeft(y).ticks(5));
    yAxis.selectAll("text").attr('fill', 'white');

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width1 )
        .attr("height", height1 )
        .attr("x", 0)
        .attr("y", 0);




    // Add brushing
    var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
    .extent( [ [0,0], [width1,height1] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart)              // Each time the brush selection changes, trigger the 'updateChart' function


    // Add the brushing
    line.append("g").attr("class", "brush").call(brush);

    // Add the line
    line.append("path").datum(data).attr("class", "line").attr("fill", "none").attr("stroke", 'rgb(255, 102, 0)').style("opacity",opacity_value)
    .attr("stroke-width", 1.5).attr("d", d3.line().x(function(d) { return x(d.date) }).y(function(d) { return y(d.value) }))

    // svg.append("text")
    // .attr("x", (width1 / 2))
    // .attr("y", 10 - (margin1.top / 2))
    // .attr("text-anchor", "middle")
    // .style("font-size", "16px")
    // .style("text-decoration", "underline")
    // .text(attr + ' vs Date Graph');

    data_charts.push([x,xAxis,line,y,yAxis,data])

}


function preprocess_data(data,need_candlestick,data_summary,data_final){
    // the candlestick chart will be done through the usage of the d3-ez library.
    // the other kind of graphs only through basic d3. That's why we need two different
    // data structures for the two kinds of graphs: d3-ez asks for a different data organization
    /*
    The data are currently structured in this way:
    data[3] =
        {Close: "3630.7"
        Date: "Sep 22, 2017"
        High: "3758.27"
        Low: "3553.53"
        Market Cap: "60,152,300,000"
        Open: "3628.02"
        Volume: "1,194,830,000"}
    Data is a javscript object where the first
    */

    if(need_candlestick==false){
        var sum = ''
        var sum1 = ''
        var attr_arr = []
        for(i=0;i<data.length;i++){
            data_final['date'][i] = new Date(data[i].Date)
            data_final['open'][i] = data[i].Open
            data_final['high'][i] = data[i].High
            data_final['low'][i] = data[i].Low
            //data_final['swing'][i] = data[i].High/data[i].Low
            data_final['close'][i] = data[i].Close
            if(data[i].Volume != "-"){
                data_final['volume'][i] = data[i].Volume
            }
            else{data_final['volume'][i] = "0"}
            if(data[i]["Market Cap"] != "-"){
                data_final['market cap'][i] = data[i]['Market Cap']
            }
            else{data_final['market cap'][i] = "0"}
        }
        for(i=0;i<data_final['market cap'].length; i++){
            res = data_final['market cap'][i].split(",")
            res1 = data_final['volume'][i].split(",")
            for(j=0;j<res.length;j++){sum +=res[j]}
            for(k=0;k<res1.length;k++){sum1 +=res1[k]}
            data_final['market cap'][i] = sum
            data_final['volume'][i] = sum1
            sum = ''
            sum1 = ''
        }

        for(key in data_final){
            attr_arr.push(key)
        }
        //console.log(data_final)

    }
    else {
        for(i=0;i<data.length;i++){
            data_final['values'].push(new Object())
            data_final['values'][i]["date"] = new Date(data[i].Date).toISOString()
            data_final['values'][i]['open'] = data[i].Open
            data_final['values'][i]['high'] = data[i].High
            data_final['values'][i]['low'] = data[i].Low
            data_final['values'][i]['close'] = data[i].Close
        }
    }
    if(data_summary){
        var columns = [];
            if(need_candlestick){
                for(key in data_final['values'][0]){
                    columns.push(key)
                }
                var length=data_final['values'].length;

            }
            else {
                for(key in data_final) {columns.push(key)}
                var length=data_final[columns[1]].length;
            }
            console.log("DATA SUMMARY:")
            console.log("--------------------------------------------------------------------------")
            console.log("type of data_structure: " + typeof(data_final))
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ")
            console.log("the keys are: " + columns)
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ")
            console.log("number of data sample: " + length)
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ")
            console.log("example of data sample:")
            if(need_candlestick){
                console.log(data_final['values'][5])
            }
            else {
                for (key in data_final){
                    if(key=="name"){
                        console.log(key + ": " + data_final[key])
                        continue;}
                    console.log(key + ": " + data_final[key][0])
                }
            }
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ")
            console.log("in its totality, the data structure returned is:")
            console.log(data_final)
            console.log("--------------------------------------------------------------------------")

        }


        return data_final,attr_arr;
}


//FUNZIONE PER DISEGNARE GRAFICI INTERAGIBILI MA NON INTERCONNESSI, CON UNA SOLA LINEA SOPRA

function draw_single_time_chart1(svg,margin1,data_final,attr)
{   //FUNZIONE PER DISEGNARE UN SOLO GRAFICO, NON CONNESSO CON GLI ALTRI GRAFICI

    data = []

    for(i=0;i<data_final['date'].length;i++){
        data.push(new Object())
        data[i]['date'] = data_final['date'][i]
        data[i]['value'] = data_final[attr][i]
    }

    // A function that set idleTimeOut to null
    var idleTimeout
    function idled() { idleTimeout = null; }


    // A function that update the chart for given boundaries
    function updateChart() {  //x,xAxis,line,svg,brush,

        // select a region with boundaries
        var extent = d3.event.selection
        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if(!extent)
        {
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            x.domain([4,8])
        }
        else
        {

            x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
            svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done

        }

        // Update axis and circle position
        xAxis.transition().duration(1000).call(d3.axisBottom(x))

        line.select(".line").transition().duration(1000).attr("d", d3.line().x(function(d) {
            return x(d.date) }).y(function(d) { return y(d.value)
            }))

        // If user double click, reinitialize the chart
        svg.on("dblclick",function(){
            x.domain(d3.extent(data, function(d) { return d.date; }))
            xAxis.transition().call(d3.axisBottom(x))
            line.select('.line').transition().
            attr("d", d3.line()
            .x(function(d) { return x(d.date) })
            .y(function(d) { return y(d.value) }))
        });
    }

    var line = svg.append('g').attr("clip-path", "url(#clip)")

    // Add X axis --> it is a date format
    var x = d3.scaleTime().domain(d3.extent(data, function(d) { return d.date; })).range([ 0, width ]);

    // var xAxis = svg.append("g")
    // .attr("transform", "translate(0," + height + ")")
    // .call(d3.axisBottom(x));
    var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height1 + ")")
    .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.value; })])
    .range([ height1, 0 ]);
    var yAxis = svg.append("g")
    .call(d3.axisLeft(y));

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width1 )
        .attr("height", height1 )
        .attr("x", 0)
        .attr("y", 0);


    // Add brushing
    var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
    .extent( [ [0,0], [width1,height1] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart)              // Each time the brush selection changes, trigger the 'updateChart' function


    // Add the brushing
    line.append("g").attr("class", "brush").call(brush);

    // Add the line
    line.append("path").datum(data).attr("class", "line").attr("fill", "none").attr("stroke", "steelblue").style("opacity",1.0)
    .attr("stroke-width", 1.5).attr("d", d3.line().x(function(d) { return x(d.date) }).y(function(d) { return y(d.value) }))

    svg.append("text")
    .attr("x", (width1 / 2))
    .attr("y", 10 - (margin1.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text(attr + ' vs Date Graph');


}


function maxArrObj(obj,attr){
    //funzione per il calcolo del massimo valore fra
    //i valori associati ad un attributo di un javascript obj
    if(attr=='value'){
    return Math.max.apply(Math, obj.map(function(o) { return o.value; }))}
    else if(attr == 'date'){
        return Math.max.apply(Math, obj.map(function(o) { return o.date; }))
    }
}

function minArrObj(obj,attr){
    //funzione per il calcolo del minimo valore fra
    //i valori associati ad un attributo di un javascript obj
    if(attr=='value'){
        return Math.min.apply(Math, obj.map(function(o) { return o.value; }))}
    else if(attr == 'date'){
        return Math.min.apply(Math, obj.map(function(o) { return o.date; }))}
}

function print(text)
{
    //funzione di print
    console.log(text)
}

function get_max(value1,value2){
    if(value1>=value2) return value1
    else return value2
}

function get_min(value1,value2){
    if(value1>=value2) return value2
    else return value1
}

function type(element){
    return typeof(element)
}
