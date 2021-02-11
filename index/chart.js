







//function p(x) {console.log(x)}
// var a,b
// d3.csv("dataset/ZCoin.csv", function(data) {
//   a = data[0].Low
//   p("SONO IN ZCOIN  ----- ----- -----"); p(a)
// })

// d3.csv("dataset/Zcash.csv", function(data) {
//   b = data[0].Low
//   p("SONO IN ZCash  ----- ----- -----"); p(b)
//   p("A qui vale");p(a)
// })
// d3.csv("", function(data) {
//   p("NOMI VAR DALLA 3ZA CSV FUNZ  ----- ----- -----")
//   p(a)
//   p(b)
// })
// p("NOMI FUORI CSV  ----- ----- -----")
// p(a)
// p(b)



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
var margin = {top: 10, right: 30, bottom: 30, left: 60};
var width1 = 230 - margin.left - margin.right;
var height1 = 200 - margin.top - margin.bottom;
//-------------------------------------------------------


var need_candlestick = false;
//how many graphs do I want to create?
number_of_graphs=2


//let's create the svgs for each graph!
var svg_arr=[]

for(i=0;i<number_of_graphs;i++){
    svg_arr[i] = d3.select("#my_dataviz").append("svg").attr("width", width1 + margin.left + margin.right)
    .attr("height", height1 + margin.top + margin.bottom).append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")").attr("id", i)
}


//-------ROBA DROP DOWN MENU--------------

// function myFunction() {
//     document.getElementById("myDropdown").classList.toggle("show");
//     }

// for(let i=0;i<cryptonames.length;i++){
//     var liItem = document.createElement("a");
//     liItem.href = "#"
//     liItem.text = cryptonames[i]
//     liItem.id = cryptonames[i]
//     let cryptonames_ = cryptonames[i]
//     var dropdown = document.getElementById("myDropdown").appendChild(liItem).addEventListener("click", function(){createGraphsOfMyCrypto(cryptonames_) });
//     };
//----------------------------------------

//--------------------------------------------------------------------------------------------------------------------



//----------FUNZIONE CHIAMATA ONCLICK PER OGNI CRYPTO---------------------------------------


function createGraphsOfMyCrypto(name){
    let name1 = name
    var path_ = 'dataset/' + String(name)+ '.csv';

    var _data_ = d3.csv(path_, function(data) {

        for(i=0;i<svg_arr.length;i++){ svg_arr[i].selectAll("*").remove(); }


        data_charts = []


        attr_to_plot = ["close", "market cap", "volume", "high", "low", "open"]


        if(need_candlestick==false){var data_final = {"name": name1,"date": [], "high": [],"low": [],"market cap": [],"open": [],"close": [],"volume": []}}
        else var data_final = {"key": keyword,"values": []}

        data_final, _ = preprocess_data(data,need_candlestick=need_candlestick,data_summary=false,data_final)

        // draw_time_chart(svg_arr[0],margin, data_final, attr_to_plot[0], [1,2,3], 0,number_of_graphs)

        // draw_time_chart(svg_arr[1],margin, data_final, attr_to_plot[1], [0,2,3], 1,number_of_graphs)

        // draw_time_chart(svg_arr[2],margin, data_final, attr_to_plot[2], [0,1,3], 2,number_of_graphs)

        // draw_time_chart(svg_arr[3],margin, data_final, attr_to_plot[3], [0,1,2], 3,number_of_graphs)

        draw_time_chart(svg_arr[0],margin, data_final, attr_to_plot[0], [1], 0,number_of_graphs, rel_or_abs='absolute')

        draw_time_chart(svg_arr[1],margin, data_final, attr_to_plot[1], [0], 1,number_of_graphs, rel_or_abs='absolute')
    })


}
//-----------------------------------------------------------------------------------------






//------------------------------------------UTILITIES------------------------------------------

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


function draw_time_chart(svg,margin,data_final,attr,param,id_graph,number_of_graphs,rel_or_abs){
    //FUNZIONE PER DISEGNARE GRAFICI INTERCONNESSI FRA LORO
    //-----------------------------------------------------
    //id is the identification number for the graph.
    //param is a tuple. Contains the identification numbers of all the graphs you want
    //to link the graph to
    print(data_final['date'].length)

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

        data_array.push(data_charts[id_graph][5])
        //print(data_charts[id_graph][5])
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
        else
        {
            for(i=0;i<number_of_graphs;i++){
                x_array[i].domain([ x_array[i].invert(extent[0]), x_array[i].invert(extent[1]) ])
                dataFiltered_array[i] = data_array[i].filter(function(d, i) {                           //dataFiltered_array = [dataFiltered,dataFiltered_new,...]
                    if ( (d.date >= x.domain()[0]) && (d.date <= x.domain()[1]) ) {return d.value;}
                })

                max_array[i] = maxArrObj(dataFiltered_array[i],'value') //max_array = [max, max_new,max_new_2]
                if(rel_or_abs=='relative') min_array[i] = minArrObj(dataFiltered_array[i],'value') //min_array = [min, min_new, min_new_2]
                else if(rel_or_abs=='absolute') min_array[i]=0
            }

            for(i=0;i<number_of_graphs;i++){
                y_array[i].domain([min_array[i],max_array[i]])};

            svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been don
        }

        for(i=0;i<number_of_graphs;i++){

            xAxis_array[i].transition().duration(1000).call(d3.axisBottom(x_array[i]))
            yAxis_array[i].transition().duration(1000).call(d3.axisLeft(y_array[i]))
            line_array[i].select(".line").transition().duration(1000).attr("d", d3.line().x(function(d) {
                return x_array[i](d.date) }).y(function(d) { return y_array[i](d.value) }))
        }

        // If user double click, reinitialize the chart
        svg.on("dblclick",function(){

            for(i=0;i<number_of_graphs;i++){
                x_array[i].domain(d3.extent(data_array[i], function(d) { return d.date; }))
                y_array[i].domain([0, d3.max(data_array[i], function(d) { return +d.value; })]).range([ height1, 0 ]);
                xAxis_array[i].transition().duration(1000).call(d3.axisBottom(x_array[i]))
                yAxis_array[i].transition().duration(1000).call(d3.axisLeft(y_array[i]))

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
    .attr("y", 10 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text(attr + ' vs Date Graph');

    data_charts.push([x,xAxis,line,y,yAxis,data])


}


function draw_single_time_chart1(svg,margin,data_final,attr)
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
        print(attr)
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
    .attr("y", 10 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text(attr + ' vs Date Graph');


}

//draw_single_time_chart1(svg_arr[0], margin, data_final, 'close')

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


















 //snippet per tentativo automatizzazione draw_time_chart function call. Non funge. Per qualche motivo
 //una volta che chiama il primo draw_time_chart, il loop usato per chiamare la funzione iterativamente
 // si blocca! Sicuro qualche stranezza asincrona. Peccato!

// for(i=0;i<number_of_graphs;i++){
//     var id_other_graphs = []
//     for(j=0;j<number_of_graphs;j++){ id_other_graphs.push(j) }
//     id_other_graphs.splice(i,1)
//     print(id_other_graphs)
//     draw_time_chart(svg_arr[i],margin, data_final, attr_to_plot[i],id_other_graphs,i,number_of_graphs)
//non posso automatizzare questo? Quando chiama la prima draw_time_chart si blocca,per qualche motivo. Peccato!
// }
