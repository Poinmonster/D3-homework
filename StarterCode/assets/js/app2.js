// 1. Pre-data setup
// We need to set the margin


// Grab the width of the containing box
var width = 600

// How to set the height?
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 20;

// Assign some space for labels?
var labelArea = 110;

// Also assign some space for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// Create the actual canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");
  

// Set the radius for each dot that will appear in the graph.
// Note: Making this a function allows us to easily call
// it in the mobility section of our code.
var circRadius;
// what's next?
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();


// Create a group element to nest labels
svg.append("g").attr("class", "xText");
// xText will allows us to select the group without excess code.
var xText = d3.select(".xText");

// We give xText a transform property that places it at the bottom of the chart.
// By nesting this attribute in a function, we can easily change the location of the label group
// whenever the width of the window changes.
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

// append the text, for example:
// 1. Poverty
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

var leftLabelMargin = margin + tPadLeft
var yLabelMargin = (height + tPadBot)/labelArea

svg.append("g").attr("class", "yText");

var yText = d3.select(".yText");
// You do the same thing for left label - Yaxes
function yTextRefresh() {
  yText
  .attr("transform", "translate(" + leftLabelMargin + "), " + yLabelMargin + ")rotate(-90)");
}
yTextRefresh();

// append the text
yText
  .append("text")
  // .attr("x", 45)
  .attr("y", height/2)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obesity (%)");


// import the data
d3.csv("data.csv")
.then(function(data) {
  // Visualize the data
  visualize(data);
  // console.log(data);
});

// visualize is the function that you need to implement for scatter plot
function visualize(theData){
  // PART 1: Essential Local Variables and Functions

  // variable for data representation
  var curX = "poverty";
  var curY = "obesity";

  // Empty variables for min and max of x and y axes
  var xMin; 
  var yMin;
  var xMax;
  var yMax;

  // This function allows us to set up tooltip rules (see d3-tip.js).
  // var toolTip = d3
  //   .tip()
  //   .attr("class", "d3-tip")
  //   .offset([40, -60])
  //   .html(function(d) {
  //     // x key
  //     var theX;
  //     // Grab the state name.
  //     var theState = "<div>" + d.state + "</div>";
  //     // Snatch the y value's key and value.
  //     var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
  //     // If the x key is poverty
  //     if (curX === "poverty") {
  //       // Grab the x key and a version of the value formatted to show percentage
  //       theX = "<div>" + curX + ": " + d[curX] + "%</div>";
  //     }
  //     else {
  //       // Otherwise
  //       // Grab the x key and a version of the value formatted to include commas after every third digit.
  //       theX = "<div>" + curX + ": " + parseFloat(d[curX]).toLocaleString("en") + "</div>";
  //     }
  //     // Display what we capture.
  //     return theState + theX + theY;
  //   });
  // // Call the toolTip function.
  // svg.call(toolTip);


  // min will grab the smallest datum from the selected column.
  function xMinMax() {
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });
    xMax = d3.max(theData, function(d){
      return parseFloat(d[curX]) * 1.10
    });
  }
  function yMinMax() {  
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });
    yMax = d3.max(theData, function(d){
      return parseFloat(d[curY]) * 1.10
    });
  }
  xMinMax();
  yMinMax();
  // Part 3: Instantiate the Scatter Plot
  // ====================================
  // This will add the first placement of our data and axes to the scatter plot. 

  // With the min and max values now defined, we can create our scales.
  // Notice in the range method how we include the margin and word area.
  // This tells d3 to place our circles in an area starting after the margin and word area.
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);

  var yScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([height - margin - labelArea, margin])

  // We pass the scales into the axis methods to create the axes.
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);


  // Determine x and y tick counts.
  // Note: Saved as a function for easy mobile updates.
// function ticks() {
//   if (width > 500) {
//     var xAxis.ticks(10);
//     var yAxis.ticks(10);
//   }
//   else {
//     var xAxis.ticks(5);
//     var yAxis.ticks(5);
//   }
// } 
// ticks();
  


  // We append the axes in group elements. By calling them, we include
  // all of the numbers, borders and ticks.
  // The transform attribute specifies where to place the axes.
  svg
  .append("g")
  .call(xAxis)
  .attr("class", "xAxis")
  .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  // You will need to do for yAxis as well
  svg.append("g")
  .call(yAxis)
  .attr("class", "yAxis")
  .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll('g theCircles')
    .data(theData)
    .enter();
  
  // We append the circles for each row of data (or each state, in this case).
  theCircles
    .append('circle')
    // These attr's specify location, size and class.
    .attr("cx", function(d){
      return xScale(d[curX]);
  
    })
    .attr("cy", function(d){
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d){
      return "state circle " + d.abbr;
    });

  // With the circles on our graph, we need matching labels.
  // Let's grab the state abbreviations from our data
  // and place them in the center of our dots.
  // theCircles
  //   .append("text")
  //   .text(function(d) {
  //     d.state
  //   })
    // We return the abbreviation to .text, which makes the text the abbreviation.
    

    // Now place the text using our scale.

      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.


}







