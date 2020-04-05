// Make the chart responsive to the window size 
function makeResponsive() {

    // First remove existing svg area
    var svgArea = d3.select('body').select('svg');

    if (!svgArea.empty()) {
        svgArea.remove();
    };
  
    // Create svg area
    var svgWidth = window.innerWidth - 100;
    var svgHeight = window.innerHeight - 100;

    // Set up margins for the chart
    var margin = {
        top:50,
        bottom:50,
        right:50,
        left:50
    };

    // Calculate the chart's height and width
    var chartWidth = svgWidth - margin.right - margin.left;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    // Append svg element
    var svg = d3.select('#scatter')
        .append('svg')
        .attr('height', svgHeight)
        .attr('width', svgWidth);

    // Append group
    var chartGroup = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
        

    // Pull in the csv data
    d3.csv('./assets/data/data.csv').then(function (economyData) {
                
        // Parse the csv data
        economyData.forEach(function (data) {
            data.poverty = +data.poverty;
            data.povertyMoe = +data.povertyMoe;
            data.age = +data.age;
            data.ageMoe = +data.ageMoe;
            data.income = +data.income;
            data.incomeMoe = +data.incomeMoe;
            data.healthcare = +data.healthcare;
            data.healthcareLow = +data.healthcareLow;
            data.healthcareHigh = +data.healthcareHigh;
            data.obesity = +data.obesity;
            data.obesityLow = +data.obesityLow;
            data.obesityHigh = +data.obesityHigh;
            data.smokes = +data.smoke;
            data.smokesLow = +data.smokesLow
            data.smokesHigh = +data.smokesHigh
         });

        // Create scales
        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(economyData, d => d.poverty))
            .range([0,chartWidth]);
        

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(economyData, d => d.healthcare)])
            .range([chartHeight, 0]);

        // Create axes
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale).ticks(11);

        // Append axes
        chartGroup.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(xAxis);

        chartGroup.append('g')
            .call(yAxis);

        // Append circles 
        var circlesGroup = chartGroup.selectAll('circle')
            .data(economyData)
            .enter()
            .append('circle')
            .attr('cx', d => xLinearScale(d.poverty))
            .attr('cy', d => yLinearScale(d.healthcare))
            .attr('r', 10)
            .classed('stateCircle', true)
            .attr('opacity', '0.5');
        
        // Add states to circles
        chartGroup.selectAll('circle')
            .data(economyData)
            .append('text')
            .classed('stateText', true)
            .text(d => d.abbr);
         
        // Append x axis
        chartGroup.append('text')
            .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + 20})`)
            .attr('x', 0)
            .attr('y', 20)
            .classed('active', true)
            .text('In Poverty (%)');

        // Append y axis
        chartGroup.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (chartHeight / 2))
            .attr('dy', '1em')
            .classed('aText', true)
            .text('Lacks Healthcare (%)');
        
        
    });
};

// When open browser
makeResponsive();

// When browser window is resized
d3.select(window).on("resize", makeResponsive);
