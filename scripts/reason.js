const Reasons = {
    BUSINESS : 'Business',
    HOLIDAY : 'Holiday/leisure/recreation',
    FRIENDS : 'Visit to friends/relatives',
    OTHER : 'Other reason for journey',
    ALL : 'All reasons for journey'
}
function getReasons(str){
	switch(str){
		case "Business":
			return Reasons.BUSINESS
			break
		case "Holiday/leisure/recreation":
			return Reasons.HOLIDAY
			break
		case "Visit to friends/relatives":
			return Reasons.FRIENDS
			break
		case "Other reason for journey":
			return Reasons.OTHER
			break
	}
}
$(document).ready(function(){
	const vw = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const vh = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    var svg = d3.select(".reasonSvg")
        width = svg._groups[0][0].clientWidth
        height = width
        margin = 40
        
    var reasonForJourney2019 = d3.csv("data/reasonThisYear.csv", function(d) {
    	if (d.Category != Reasons.ALL) {
    		return {
                year : +d.Year,
                quarter : d.Quarter,
                reason : getReasons(d.Category),
                numberOfVisitors : +d.Value
            };
    	}
    }).then(function(data){
    	data = d3.rollup(data, v=> Array.from(v).map(d=>d.numberOfVisitors), d => d.year, d => d.quarter, d => d.reason)
    	var cx = width/1.5
    	var cy = height/2
    	g = svg.append("g")
    		.attr("transform", "translate(" + cx + "," + cy + ")");
        var radius = Math.min(width, height) / 3 - margin
        
    	var reasonValueExtent = d3.extent(data.get(2019).get("Q1").keys(), function(d) { return +d; })
        var reasonColor = d3.scaleOrdinal()
			  .domain(reasonValueExtent)
			  .range(["#bebada","#fccde5", "#8dd3c7","#fb8072"]);
    	
    	d3.map(Array.from(data.get(2019)))
    		.each(function(k,i){
    			var pie = d3.pie()
				  .value(function(d) {
				  	//console.log(d); 
				  	return d.value[1]; 
				  })
				  .startAngle(-Math.PI/2)
		          .endAngle(+Math.PI/2)
				var data_ready = pie(d3.map(Array.from(k[1]), d=>d[0]).entries())
				
				// The arc generator
				var arc = d3.arc()
				  .innerRadius(radius * (1 + 0.125*i))         // This is the size of the donut hole
				  .outerRadius(radius * (1.1 + 0.125*i))

				// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
				g
				  .selectAll('allSlices')
				  .data(data_ready)
				  .enter()
				  .append('path')
				  .attr('class', 'slice')
				  .attr('d', arc)
				  .attr('fill', function(d){ 
				  	//console.log(d)
				  	return(reasonColor(d.data.key)) 
				  })
				  .attr('data-name', function(d){ return d.data.key; })
				  .attr('data-code', function(d){ return getReasons(d.data.key)})
				  .attr("stroke", "white")
				  .style("stroke-width", "2px")
				  .attr('fill-opacity', 0.3)
				  .on('mouseover', function () {
				      var region = d3.select(this);
				      region.attr('fill-opacity', 0.7)
				      document.querySelector('.reasonLegend').innerText = region.attr('data-name');
				      d3.selectAll('circle')
				      .each(function(d, i){ 
				          if(d3.select(this).attr('data-code') == region.attr('data-code')){
				              var currentCircle = d3.select(this)
				              currentCircle.attr("fill-opacity", 0.7)
				              currentCircle.style("fill", "grey")
				              document.querySelector('.reasonDuration').innerText = 'Overseas trips to Ireland: ' + (currentCircle.attr('data-visitors')*1000).toLocaleString();
				              document.querySelector('.reasonNumberOfVisitors').innerText = 'Average Length of Stay: ' +currentCircle.attr('data-duration') + ' Nights';
				          } 
				      })
				      
				  })
				  .on('mouseout', function () {
				      var region = d3.select(this);
				      region.attr('fill-opacity', 0.3)
				      document.querySelector('.reasonLegend').innerText = 'Worldwide';
				      d3.selectAll('circle')
				      .each(function(d, i){ 
				          if(d3.select(this).attr('data-code') == region.attr('data-code')){
				              var currentCircle = d3.select(this)
				              currentCircle.attr("fill-opacity", 0.3)
				              currentCircle.style("fill", "lightgrey")
				              //currentCircle.style("fill", function(d){ return reasonColor(currentData[0])})
				              var total = document.querySelector('.reasonDuration').getAttribute('total')
				              var average = document.querySelector('.reasonNumberOfVisitors').getAttribute('average')
				              document.querySelector('.reasonDuration').innerText = 'Overseas trips to Ireland: ' + (total*1000).toLocaleString();
				              document.querySelector('.reasonNumberOfVisitors').innerText = 'Average Length of Stay: ' + average + ' Nights';
				          } 
				      })
				  })
				  
				
    		})	

    		var reasonForJourneyData = d3.csv("data/reasonForJourney.csv", function(d) {
			    	if (d.Year >= 2012 && d.Category != "All reasons for journey") {
			    		var expenditureValue = 0, durationOfStayValue = 0, numberOfVisitorsValue = 0
			            if (d.Statistic == "Average Length of Stay by Overseas Travellers to Ireland (Nights)") {
			                durationOfStayValue = d.Value
			            } else if (d.Statistic == "Overseas Trips to Ireland by Non-Residents (Thousand)") {
			                numberOfVisitorsValue = d.Value
			            } else if (d.Statistic == "Expenditure by Overseas Travellers in Ireland (excluding fares) (Euro Million)") {
			                expenditureValue = d.Value
			            }
			            return {
			                year : d.Year,
			                reason : getReasons(d.Category),
			                durationOfStay : durationOfStayValue,
			                numberOfVisitors: numberOfVisitorsValue,
			                expenditure: expenditureValue
			            };
			    	}
			    }).then(function(data) {
			    	var reducedData = d3
			                    .rollup(data, function(v) {
			                        v[0].durationOfStay = d3.sum(v, function(d) { 
			                            return d.durationOfStay; 
			                        });
			                        v[0].expenditure = d3.sum(v, function(d) { 
			                            return d.expenditure; 
			                        });
			                        v[0].numberOfVisitors = d3.sum(v, function(d) { 
			                            return d.numberOfVisitors; 
			                        }); 
			                        return v[0];
			                    }, d => d.year, d => d.reason)
			        var allData = Array.from(reducedData)
			        //console.log(allData[7][1])

			        var x = d3.rollups(
			            allData[7][1],
			            xs => d3.mean(xs, x => x[1].durationOfStay),
			            d => d.reason
			          )
			        var averageStay = x[0][1]

			        x = d3.rollups(
			            allData[7][1],
			            xs => d3.sum(xs, x => x[1].numberOfVisitors),
			            d => d.reason
			          )
			        var totalNumberOfVistors = x[0][1]

			        var x = d3.rollups(
			            allData[7][1],
			            xs => d3.mean(xs, x => x[1].expenditure),
			            d => d.reason
			          )
			        var averageExpenditure = x[0][1]
			        
			        document.querySelector('.reasonLegend').innerText = 'All Reasons';
			        document.querySelector('.reasonDuration').setAttribute('total', totalNumberOfVistors)
			        document.querySelector('.reasonDuration').innerText = 'Overseas trips to Ireland: ' + (totalNumberOfVistors*1000).toLocaleString();
			        document.querySelector('.reasonNumberOfVisitors').setAttribute('average', averageStay)
			        document.querySelector('.reasonNumberOfVisitors').innerText = 'Average Length of Stay: ' + averageStay + ' Nights';
			        
			        var data2019 = Array.from(allData[7][1]).slice().sort((a, b) => d3.ascending(a[1].numberOfVisitors, b[1].numberOfVisitors))
			        var visitorsValueExtent = d3.extent(data2019, function(d) { return +d[1].numberOfVisitors; })
			        var expenditureValueExtent = d3.extent(data2019, function(d) { return +d[1].expenditure; })
			        var durationValueMax = d3.max(data2019, function(d) { return +d[1].durationOfStay; })
			        var size = d3.scalePow()
			            .exponent(1/2)
			            .domain([100, 6000])  
			            .range([ 1, 80])  
			        
			        var strokeLength = d3.scaleLinear()
			            .domain([0, durationValueMax + 2])  
			            .range([ 0, 2*Math.PI])
			        
			        var expenditureScale = d3.scaleLinear()
			            .domain(expenditureValueExtent)  
			            .range([ 1, 60])
			        
			        var maxSize = 250
			        
			        for (var i = 0; i < data2019.length; i++) {
			        	var currentData = data2019[i]
			        	console.log(data2019[i][1].numberOfVisitors)
			        	var r = size(+data2019[i][1].numberOfVisitors)
			        	svg
                    	.append("circle")
                        .attr("cx", (1.5 - i)*110)
                        .attr("cy", 200 - r)
                        .attr("r", r)
                        .attr('data-code', currentData[0])
                        .attr('fill', 'lightgrey')
                        //.attr('fill', function(d){ return reasonColor(currentData[0])})
                        .attr("stroke", function(d){ return reasonColor(currentData[0])})
                        .attr("stroke-width", 0)
                        .attr("fill-opacity", .4)
                        .attr("transform", "translate(" + cx + "," + cy + ")")
                        .attr('data-duration', data2019[i][1].durationOfStay)
                        .attr('data-visitors', data2019[i][1].numberOfVisitors)
			        	
			        	svg
			        	.append("path")
			        	.attr('d', d3.arc()
			        	    .innerRadius(r)
			        	    .outerRadius(r)
			        	    .startAngle(0)
			        	    .endAngle(strokeLength(data2019[i][1].durationOfStay)))
			        	.attr('transform', 'translate('+ (cx + (1.5 - i)*110) +', ' + (cy + (200 - r)) +')')
			        	.attr('stroke', function(d){ return reasonColor(currentData[0])})
			        	.attr('stroke-width', '4')
			        	.attr('fill', 'none')

			        	// Expenditure
			        	var angle = 7*Math.PI/4
			        	var expenditureData
			        	var color = reasonColor(currentData[0])
			        	if (data2019[i][1].expenditure > averageExpenditure) {
			        	    expenditureData = [[color, data2019[i][1].expenditure],['grey', averageExpenditure]]
			        	} else {
			        	    expenditureData = [['grey', averageExpenditure],[color, data2019[i][1].expenditure]]
			        	}
			        	svg
			        	.selectAll("expenditure")
			        	.data(expenditureData)
			        	.enter()
			        	.append("line")
			        	    .attr('x1', cx )
			        	    .attr('x2', function(d){ return cx - Math.cos(angle)*expenditureScale(d[1])})
			        	    .attr('y1', cy )
			        	    .attr('y2', function(d){ return cy + Math.sin(angle)*expenditureScale(d[1])})
			        	    .attr('stroke', function(d,i) { return d[0]; })
			        	    .attr('stroke-width', '2')
			        	    //.attr('transform', 'translate('+ (cx + (1.5 - i)*110) +', ' + (cy + (200 - r)) +')')
			        		.attr('transform', 'translate('+ (0 + (1.5 - i)*110)+', ' + (200-r) +')')
			        	
			        	/*console.log(draw(d3.path()))
			        	g
				        .append("path")
				        .attr('class', 'visitorPath')
				        .attr('d', draw(d3.path(), i, expenditureScale(data2019[i][1].expenditure)))
				        //.attr('transform', 'translate('+ 0 +', ' + (cy - 200) +')')
				        .attr('stroke', function(d){ return reasonColor(currentData[0])})
				        .attr('stroke-width', '0.5')
				        .attr('fill', function(d){ return reasonColor(currentData[0])})
				        .attr('fill-opacity', '0.3')
				        */

				        // legend
				        var valuesToShow = [1000,4000]
				        var angleValuesToShow = [4, 8]
				        var expenditureValuesToShow = [1000, 2000]
				        var expenditureScaleAngle = 7*Math.PI/4
				        var xCircle = [700, 800]
				        var xLabel = 850
				        var legendPosition = height

				        svg
				          .selectAll("legend")
				          .data(valuesToShow)
				          .enter()
				          .append("circle")
				            .attr("cx", function(d,i){ return xCircle[i]})
				            .attr("cy", function(d){ return legendPosition - size(d) } )
				            .attr("r", function(d){ return size(d) })
				            .style('fill','lightgrey')
				            .attr("fill-opacity", .4)

				        
				        svg
				        .selectAll("legend")
				        .data(valuesToShow)
				        .enter()
				        .append("path")
				        .attr('d', d3.arc()
				            .innerRadius(function(d) { return size(d); })
				            .outerRadius(function(d) { return size(d); })
				            .startAngle(0)
				            .endAngle(function(d, i){ return strokeLength(angleValuesToShow[i])}))
				        .attr('transform', function(d, i){return 'translate('+ xCircle[i] +', ' + (legendPosition - size(d)) +')'})
				        .attr('stroke', "#386cb0")
				        .attr('stroke-width', '2')
				        .attr('fill', 'none')

				        svg
				        .selectAll("legend")
				        .data(expenditureValuesToShow)
				        .enter()
				        .append("line")
				            .attr('x1', function(d,i){ return xCircle[i] } )
				            .attr('y1', function(d,i){ return legendPosition - size(valuesToShow[i]) } )
				            .attr('x2', function(d,i){ return xCircle[i] - Math.cos(expenditureScaleAngle)*expenditureScale(d)})
				            .attr('y2', function(d,i){ return legendPosition - size(valuesToShow[i]) + expenditureScale(d)*Math.sin(expenditureScaleAngle)})
				            .attr('stroke', function(d,i) { return i==0?"#386cb0":"grey"; })
				            .attr('stroke-width', '2')
				        
				        
				        // Add legend: segments
				        svg
				          .selectAll("legend")
				          .data(valuesToShow)
				          .enter()
				          .append("line")
				            .attr('x1', function(d,i){ return xCircle[i] } )
				            .attr('x2', xLabel)
				            .attr('y1', function(d){ return legendPosition - 2*size(d) } )
				            .attr('y2', function(d){ return legendPosition - 2*size(d) } )
				            .attr('stroke', "#386cb0")
				            .style('stroke-dasharray', ('2,1'))

				        svg
				          .selectAll("legend")
				          .data(angleValuesToShow)
				          .enter()
				          .append("line")
				            .attr('x1', function(d,i){ return xCircle[i] + size(valuesToShow[i])*Math.sin(strokeLength(d)) } )
				            .attr('x2', xLabel)
				            .attr('y1', function(d,i){ return (legendPosition - size(valuesToShow[i]) - size(valuesToShow[i])*Math.cos(strokeLength(d))) } )
				            .attr('y2', function(d,i){ return (legendPosition - size(valuesToShow[i]) - size(valuesToShow[i])*Math.cos(strokeLength(d))) } )
				            .attr('stroke', "#386cb0")
				            .style('stroke-dasharray', ('2,1'))

				        svg
				        .selectAll("legend")
				        .data(expenditureValuesToShow)
				        .enter()
				        .append("line")
				            .attr('x1', xLabel )
				            .attr('y1', function(d,i){ return legendPosition - size(valuesToShow[i]) + expenditureScale(d)*Math.sin(expenditureScaleAngle)})
				            .attr('x2', function(d,i){ return xCircle[i] - Math.cos(expenditureScaleAngle)*expenditureScale(d)})
				            .attr('y2', function(d,i){ return legendPosition - size(valuesToShow[i]) + expenditureScale(d)*Math.sin(expenditureScaleAngle)})
				            .attr('stroke', "#386cb0")
				            .style('stroke-dasharray', ('2,1'))
				        // Add legend: labels
				        svg
				          .selectAll("legend")
				          .data(valuesToShow)
				          .enter()
				          .append("text")
				            .attr('x', xLabel + 5)
				            .attr('y', function(d){ return legendPosition - 2*size(d) } )
				            .text( function(d){ return (d*1000).toLocaleString() + ' trips'} )
				            .style("font-size", 10)
				            .style('font-color', "#386cb0")
				            .attr('alignment-baseline', 'middle')

				        svg
				          .selectAll("legend")
				          .data(angleValuesToShow)
				          .enter()
				          .append("text")
				            .attr('x', xLabel + 5)
				            .attr('y', function(d,i){ return (legendPosition - size(valuesToShow[i]) - size(valuesToShow[i])*Math.cos(strokeLength(d))) } )
				            .text( function(d){ return d+' Nights'} )
				            .style("font-size", 10)
				            .style('font-color', "#386cb0")
				            .attr('alignment-baseline', 'middle')

				        svg
				          .selectAll("legend")
				          .data(expenditureValuesToShow)
				          .enter()
				          .append("text")
				            .attr('x', xLabel + 5)
				            .attr('y', function(d,i){ return legendPosition - size(valuesToShow[i]) + expenditureScale(d)*Math.sin(expenditureScaleAngle)})
				            .text( function(d,i){ 
				                var prefix = i==0? "Worldwide average ": "Area average "
				                return '\u20AC ' + d.toLocaleString()+'M'
				            })
				            .style("font-size", 10)
				            .style('font-color', "#386cb0")
				            .attr('alignment-baseline', 'middle')

				        svg.append('text')
				            .attr("y", function(d) { return height - 50; })
				            .attr('dominant-baseline',"middle")
				            .attr('text-anchor',"middle")
				              .append('svg:tspan')
				              .attr("x", "50%")
				              .attr('dy', 5)
				              .text("This chart provides a comparison of statistics")
				              .append('svg:tspan')
				              .attr("x", "50%")
				              .attr('dy', 20)
				              .text("based on given reasons for journey.")
				 
				        
				        
			        }
			        
			    });

    		// Add one dot in the legend for each name.
			var size = 15
			console.log(data.get(2019).get("Q1"))
			g.selectAll("reasonLegend")
			  .data(Array.from(data.get(2019).get("Q1")))
			  .enter()
			  .append("rect")
			    .attr("x", 0)
			    .attr("y", function(d,i){ return i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
			    .attr("width", size)
			    .attr("height", size)
			    .style("fill", function(d){ console.log(d); return reasonColor(d[0])})
			    .attr("transform", "translate(" + -1*radius/2 + "," + -5*size + ")");

			// Add one dot in the legend for each name.
			g.selectAll("reasonLabels")
			  .data(Array.from(data.get(2019).get("Q1")))
			  .enter()
			  .append("text")
			    .attr("x", size*1.2)
			    .attr("y", function(d,i){ return i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
			    //.style("fill", function(d){ console.log(d); return reasonColor(d[0])})
			    .text(function(d){ return d[0]})
			    .attr("text-anchor", "left")
			    .style("alignment-baseline", "middle")		
			    .attr("transform", "translate(" + -1*radius/2 + "," + -5*size + ")");
    })

    
});
