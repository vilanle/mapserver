
// (function(d3) {
//   "use strict";



//     function findRating(total){
//         var returnVal = 1;
//         if(total>=100000 && total < 200000)
//             returnVal =  1;
//         if(total>=200000 && total < 300000)
//             returnVal =  2;
//         if(total>=300000 && total < 400000)
//             returnVal =  3;
//         if(total>=400000 && total < 500000)
//             returnVal =  4;
//         if(total>=500000 && total < 600000)
//             returnVal =  5;
//         if(total>=600000 && total < 700000)
//             returnVal =  6;
//         if(total>=700000 && total < 800000)
//             returnVal =  7;
//         if(total>=800000 && total < 900000)
//             returnVal =  8;
//         if(total>=900000 && total < 1000000)
//             returnVal =  9;
//         if(total >= 1000000)
//             returnVal =  10;

//         return returnVal;
//     }


//     d3.json("/delphidata", function(err, data) {


//         var margin = {top: 20, right: 20, bottom: 30, left: 40},
//         width = 960 - margin.left - margin.right,
//         height = 500 - margin.top - margin.bottom;

//         var x = d3.scale.ordinal()
//             .rangeRoundBands([0, width], .1, 1);

//         var y = d3.scale.linear()
//             .range([height, 0]);

//         var xAxis = d3.svg.axis()
//             .scale(x)
//             .orient("bottom");

//         var yAxis = d3.svg.axis()
//             .scale(y)
//             .orient("left")

//         var svg = d3.select("body").append("svg")
//             .attr("width", width + margin.left + margin.right)
//             .attr("height", height + margin.top + (margin.bottom+ 100))//added
//           .append("g")
//             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//         var avgIncome = 0;
//         var medHouseVal = 0;
//         var povertyCount = 0;
//         var crimeCount = 0;
//         var value = 0;
//         var dataJson = {
//             "area": String,
//             "rating": Number
//         };

//         var array = [];
//         var value = 0;
//         for(var i = 0; i < data.length; i++){
//             value = 0;
//             dataJson = {};
//             avgIncome  = data[i]["Avg Income"];
//             medHouseVal  = data[i]["Median house value"];
//             povertyCount  = data[i]["Poverty_Count"];
//             crimeCount  = data[i]["Number_of_Crimes"];
//             value = avgIncome + medHouseVal - povertyCount - parseInt(crimeCount);
//             dataJson.area = data[i]["Area"];
//             dataJson.rating = findRating(value);
//             array.push(dataJson);
//         }
//         console.log(array);
//         /*d3.tsv("data.tsv", function(error, data) {

//           data.forEach(function(d) {
//             d.frequency = +d.frequency;
//           });*/

//           x.domain(array.map(function(d) { return d.area; }));
//           y.domain([0, d3.max(array, function(d) { return d.rating; })]);

//           svg.append("g")
//               .attr("class", "x axis")
//               .attr("transform", "translate(0," + height + ")")
//               .call(xAxis)
//     	  .selectAll("text")
//     	  .attr("text-anchor", "end")
//     	  .attr("dx", "-5.5em")
//     	  .attr("transform", "rotate(-65)");

//           svg.append("g")
//               .attr("class", "y axis")
//               .call(yAxis)
//             .append("text")
//     	  .style("text-anchor", "end")
//               .attr("dy", ".71em")
//     	  .attr("transform", "rotate(-90)")
//               .attr("y", 6)
//               .text("Rating");

//         // reveal calculations
//         var tip = d3.tip()
//           .attr('class', 'd3-tip')
//           .offset([-10, 0])
//           .html(function(d){ return "<strong>Frequency:</strong>" + d.rating});

//         svg.call(tip);

//          // determining bar colors
//         var max = d3.max(array, function(d) {return d.rating;});
//         // var threshold = max/3;
//         var length = array.length/3;
//         console.log("length: " + array.length + " " + "division: " + Math.ceil(array.length/3));

//         var tempData = [];
//           array.forEach(function(d){
//             tempData.push(d.rating);
//           });

//           tempData.sort();

//         var redT = tempData[Math.ceil(length)];
//         var yellowT = tempData[Math.ceil(length*2)];

//         d3.select("#red-text").text("(" + tempData[0] + " - " + redT + ")");
//         d3.select("#yellow-text").text("(" + redT + " - " + yellowT + ")");
//         d3.select("#green-text").text("(" + yellowT + " - " + tempData[tempData.length - 1] + ")");

//           svg.selectAll(".bar")
//               .data(array)
//             .enter().append("rect")
//               .attr("class", "bar")
//               .attr("x", function(d) { return x(d.area); })
//               .attr("width", x.rangeBand())
//               .attr("y", function(d) { return y(d.rating); })
//               .attr("height", function(d) { return height - y(d.rating); })
//               .on('mouseover', tip.show)
//               .on('mouseout', tip.hide)
//               .attr("fill", function(d){
//                 if (d.rating < redT) {
//                   return "red";
//                 } else if (d.rating <= yellowT) {
//                   return "yellow";
//                 }
//                   else{
//                   return "green";
//                 }
//               });

//           d3.select("input").on("change", change);


//           var sortTimeout = setTimeout(function() {
//             d3.select("input").property("checked", true).each(change);
//           }, 2000);

//           function change() {
//             clearTimeout(sortTimeout);

//             // Copy-on-write since tweens are evaluated after a delay.
//             var x0 = x.domain(array.sort(this.checked
//                 ? function(a, b) { return b.rating - a.rating; }
//                 : function(a, b) { return d3.ascending(a.area, b.area); })
//                 .map(function(d) { return d.area; }))
//                 .copy();

//             svg.selectAll(".bar")
//                 .sort(function(a, b) { return x0(a.area) - x0(b.area); });

//             var transition = svg.transition().duration(750),
//                 delay = function(d, i) { return i * 50; };

//             transition.selectAll(".bar")
//                 .delay(delay)
//                 .attr("x", function(d) { return x0(d.area); });

//             transition.select(".x.axis")
//                 .call(xAxis)
//               .selectAll("g")
//                 .delay(delay);
//           }

//     });


// })(d3);


   var map = new Datamap({
      element: document.getElementById('container'),
      geographyConfig: {
        dataUrl: './zips_us_topo.json'
      },
      scope: "states",
      setProjection: function(element, options) {
         var projection = d3.geo.equirectangular()
           .center([-97, 25])
           .rotate([4.4, 0])
           .scale(800)
           .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

        var path = d3.geo.path()
               .projection(projection);

        return {path: path, projection: projection};
        }
    });