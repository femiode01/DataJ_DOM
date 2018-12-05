// @TODO: YOUR CODE HERE!
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads, remove it
  // and replace it with a resized version of the chart


var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;





var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================

var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform",`translate(${margin.left} , ${margin.top})`)


  
// Initial Params
var chosenXAxis = "poverty";


// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
        d3.max(censusData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }


// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var label = "In Poverty:";
    }
    else {
      var label = "Age(Median):";
    }


  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
        return (`<center>${d.state}<center/> Lacks Healthcare: ${d.healthcare}% <br>${label} ${d[chosenXAxis]}%`);
      });
      
   
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

  // Import data from the data.csv file

d3.csv("data.csv", function(error, censusData) {
            if (error) throw error;
    
 // Format the data
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
    });

// xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);

// xLinearScale 
 var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.healthcare)])
    .range([height, 0]);



// Step 6: Create Axis 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// Append x and y axis
var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

   
// Create Circles

var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 12)
    .attr("fill", "green")
    .attr("opacity", ".5");
    

// Add state abbr to circles 
  chartGroup.selectAll("text")
    .data(censusData)
    .enter()
    .append("text")
    .text(function (d) {
        return d.abbr;
    })
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y",  d => yLinearScale(d.healthcare))
    .attr("font-size", "8px")
    .attr("text-anchor", "middle")
    .attr("class","stateText")
    .attr("fill", "black")
    
   
   

// Create x axes labels
var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);


var inpoverty = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty(%)");

var age = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 50)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");

chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (530/2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lack of Healthcare(%)");

    

 // updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

 // x axis labels event listener
 labelsGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenXAxis) {

       // replaces chosenXAxis with value
       chosenXAxis = value;

       xLinearScale = xScale(censusData, chosenXAxis);


       xAxis = renderAxes(xLinearScale, xAxis);

       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

       circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

if (chosenXAxis === "poverty") {
       inpoverty
       .classed("active", true)
       .classed("inactive", false);
        age
       .classed("active", false)
       .classed("inactive", true);
   }
   else {
     age
       .classed("active", false)
       .classed("inactive", true);
     inpoverty
       .classed("active", true)
       .classed("inactive", false);

       d3.selectAll(".stateText")
       .transition()
       .duration(1000)
       .ease(d3.easeLinear)
       .attr("x", function (d) {
           return xLinearScale(d[chosenXAxis]);
       })

   }
  }
 

});
});
}


makeResponsive();

// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);