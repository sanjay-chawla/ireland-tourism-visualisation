const AreaOfResidence = {
    USA : 'usa',
    GBR : 'gbr',
    FRA : 'fra',
    GER : 'ger',
    ITA : 'ita',
    EUR : 'eur',
    AUS : 'aus',
    OTHER : 'other'
}

function getAreaOfResidence(str){
    switch(str){
        case "United States and Canada":
            return AreaOfResidence.USA
            break
        case "Great Britain (includes England, Scotland, Wales)":
            return AreaOfResidence.GBR
            break
        case "France":
            return AreaOfResidence.FRA
            break
        case "Germany":
            return AreaOfResidence.GER
            break
        case "Italy":
            return AreaOfResidence.ITA
            break
        case "Australia and New Zealand":
            return AreaOfResidence.AUS
            break
        case "Other Europe (14)":
            return AreaOfResidence.EUR
            break
        case "Other countries (18)":
            return AreaOfResidence.OTHER
            break
    }
}

var sets = [
    {
        name: 'Great Britain (includes England, Scotland, Wales)',
        code: 'gbr',
        set: d3.set(['GBR']),
    },
    {
        name: 'France',
        code: 'fra',
        set: d3.set(['FRA'])
    },
    {
        name: 'Germany',
        code: 'ger',
        set: d3.set(['DEU'])
    },
    {
        name: 'Italy',
        code: 'ita',
        set: d3.set(['ITA'])
    },
    {
        name: 'Other Europe',
        code: 'eur',
        set: d3.set(['DNK', 'FRO', 'FIN', 'ISL', 'NOR', 'SWE', 'SRB',
            'BEL', 'CHE', 'AUT', 'ESP', 'ATF', 'GGY', 'IMN', 'SVK', 
            'JEY', 'FLK', 'SGS', 'GRC', 'MLT', 'LUX', 'NLD', 'MNE',
            'AND', 'POL', 'PRT', 'TUR', 'CYP', 'CYN', 'MON', 'ALD', 'MKD',
            'LTU', 'LVA', 'EST', 'BLR', 'UKR', 'MDA', 'ROU', 'HUN', 'ALB',
            'SVN', 'HRV', 'BIH', 'CZE', 'BGR', 'KOS'])
    },
    {
        name: 'United States and Canada',
        code: 'usa',
        set: d3.set(['CAN', 'USA'])
    },
    {
        name: 'Australia and New Zealand',
        code: 'aus',
        set: d3.set(['AUS', 'NZL'])
    },
    {
        name: 'Other countries',
        code: 'other',
        set: d3.set(['BTN', 'CHN', 'JPN', 'IDN', 'MNG', 'NPL', 'MMR', 'THA', 
            'KHM', 'LAO', 'VNM', 'PRK', 'KOR', 'TWN', 'MYS', 'PNG', 'SLB', 
            'VUT', 'NCL', 'BRN', 'PHL', 'TLS', 'HKG', 'FJI', 'GUM', 'PLW', 
            'FSM', 'MNP', 'KAS', 'MEX', 'BLZ', 'CRI', 'CUB', 'GTM', 'HND', 
            'NIC', 'PAN', 'SLV', 'HTI', 'JAM', 'DOM', 'PRI', 'BHS', 'TCA', 
            'ATG', 'DMA', 'BRB', 'GRD', 'ARG', 'BOL', 'BRA', 'CHL', 'COL', 
            'ECU', 'FLK', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN', 'TTO',
            'AGO', 'BDI', 'BEN', 'BFA', 'BWA', 'CAF', 'CIV', 'CMR', 'COD', 
            'COD', 'COG', 'COM', 'CPV', 'DJI', 'DZA', 'EGY', 'ERI', 'ETH', 
            'GAB', 'GHA', 'GIN', 'GMB', 'GNB', 'GNQ', 'KEN', 'LBR', 'LBY', 
            'LSO', 'MAR', 'MDG', 'MLI', 'MOZ', 'MRT', 'MUS', 'MWI', 'MYT', 
            'NAM', 'NER', 'NGA', 'REU', 'RWA', 'ESH', 'SDN', 'SDS', 'SEN', 
            'SHN', 'SHN', 'SLE', 'SOM', 'SOL', 'SSD', 'STP', 'STP', 'SWZ', 
            'SYC', 'TCD', 'TGO', 'TUN', 'TZA', 'TZA', 'UGA', 'ZAF', 'ZMB', 
            'ZWE', 'IND', 'BGD', 'LKA', 'AZE', 'ARE', 'QAT', 'IRN', 'AFG', 
            'PAK', 'BHR', 'SAU', 'YEM', 'OMN', 'SYR', 'JOR', 'IRQ', 'KWT', 
            'ISR', 'LBN', 'PSX', 'PSR', 'GEO', 'ARM', 'RUS', 'KAZ', 'UZB', 
            'TKM', 'KGZ', 'TJK', 'GRL'])
    }
];


$(document).ready(function(){
    const vw = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const vh = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    var allPartData = []
    // Loading data
    var areaOfResidenceData = d3.csv("data/areaOfResidence.csv", function(d) {
        if (d.Year >= 2012 && d.Category != "All Countries") {
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
                region : getAreaOfResidence(d.Category),
                durationOfStay : durationOfStayValue,
                numberOfVisitors: numberOfVisitorsValue,
                expenditure: expenditureValue
            };
        }
    })
    .then(function(data) {
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
                    }, d => d.year, d => d.region)
        allPartData = Array.from(reducedData)

        var mapRatio = 1;
        var svg = d3.select(".map")
        width = svg._groups[0][0].clientWidth
        height = width * mapRatio
        svg.attr("preserveAspectRatio", "xMinYMin")
        .attr("width", width)
        .attr("height", height)
        var rotation = d3.geoRotation([-11, 0])
        var projection = d3.geoMercator()
            .scale(width / 3 / Math.PI)
            .rotate(rotation)
            .translate([(width) / 2, height / 2 ])
            .precision(.1);
        var path = d3.geoPath().projection(projection);
        
      
        // Add a scale for bubble size
        var visitorsValueExtent = d3.extent(Array.from(allPartData[7][1]), function(d) { return +d[1].numberOfVisitors; })
        var expenditureValueExtent = d3.extent(Array.from(allPartData[7][1]), function(d) { return +d[1].expenditure; })
        var size = d3.scalePow()
            .exponent(1/2)
            .domain(visitorsValueExtent)  
            .range([ 1, 40])  
        
        var strokeLength = d3.scaleLinear()
            .domain([0, 16])  
            .range([ 0, 2*Math.PI])
        
        var expenditureScale = d3.scaleLinear()
            .domain(expenditureValueExtent)  
            .range([ 1, 60])
        
        var colorScale = d3.scaleOrdinal()
            .domain(Array.from(sets.map(d => d.code)))
            .range(d3.schemeDark2);
        console.log(allPartData[7][1])
        var x = d3.rollups(
            allPartData[7][1],
            xs => d3.mean(xs, x => x[1].durationOfStay),
            d => d.region
          )
        var averageStay = x[0][1]

        x = d3.rollups(
            allPartData[7][1],
            xs => d3.sum(xs, x => x[1].numberOfVisitors),
            d => d.region
          )
        var totalNumberOfVistors = x[0][1]

        var x = d3.rollups(
            allPartData[7][1],
            xs => d3.mean(xs, x => x[1].expenditure),
            d => d.region
          )
        var averageExpenditure = x[0][1]
        document.querySelector('.regionLegend').innerText = 'Worldwide';
        document.querySelector('.duration').innerText = 'Overseas trips to Ireland: ' + (totalNumberOfVistors*1000).toLocaleString();
        document.querySelector('.numberOfVisitors').innerText = 'Average Length of Stay: ' + averageStay + ' Nights';
        
        d3.json("data/countries.json").then( function(data){
            svg.append("path").datum(topojson.merge(data, data.objects.units.geometries.filter(function (d) {
                        return d.id !== 'ATA'; 
                    })))
                    .attr("class", "border")
                    .attr("d", path);
                    var irelandPath = topojson.merge(data, data.objects.units.geometries.filter(function (d) {
                        return d.id == 'IRL'; 
                    }))
                    var irelandCentroid = path.centroid(irelandPath)
            for (var i = 0; i < sets.length; i++) {
                    var currentCountryData = allPartData[7][1].get(sets[i].code)
                    var mergedPart = topojson.merge(data, data.objects.units.geometries.filter(function (d) {
                                return sets[i].set.has(d.id);
                            }))
                    var partCentroid = path.centroid(mergedPart)
                    var adjustForIta = function(d){
                        if (d == AreaOfResidence.ITA){
                            return -1.5
                        } else if (d == AreaOfResidence.OTHER){
                            return 3
                        }
                        return 1
                    }
                    var adjustForOthers = function(d){
                        if (d == AreaOfResidence.OTHER){
                            return 2
                        } else if (d == AreaOfResidence.FRA || d == AreaOfResidence.GER || d == AreaOfResidence.ITA ){
                            return 3
                        }
                        return 1
                    }
                    var r = size(+currentCountryData.numberOfVisitors)
                    var cy = adjustForOthers(sets[i].code)*Math.sign(partCentroid[1] - irelandCentroid[1])*4*r + partCentroid[1]
                    var cx = adjustForIta(sets[i].code)*Math.sign(partCentroid[0] - projection([0,0])[0])*r + partCentroid[0]
                    svg
                    .append("circle")
                        .attr("cx", cx)
                        .attr("cy", cy)
                        .attr("r", r)
                        .attr('data-code', sets[i].code)
                        .style('fill','lightgrey')
                        .attr("stroke", "orange")
                        .attr("stroke-width", 0)
                        .attr("fill-opacity", .4)
                        .attr('data-duration', currentCountryData.durationOfStay)
                        .attr('data-visitors', currentCountryData.numberOfVisitors)

                    svg.append("path").datum(mergedPart)
                        .attr('class', "regions selected " + sets[i].code)
                        .attr("d", path)
                        .attr('data-name', sets[i].name)
                        .attr('data-code', sets[i].code)
                        //.attr('fill', colorScale(sets[i].code))
                        .on('mouseover', function () {
                            var region = d3.select(this);
                            document.querySelector('.regionLegend').innerText = region.attr('data-name');
                            d3.selectAll('circle')
                            .each(function(d, i){ 
                                if(d3.select(this).attr('data-code') == region.attr('data-code')){
                                    var currentCircle = d3.select(this)
                                    currentCircle.attr("fill-opacity", .7)
                                    currentCircle.style("fill", "grey")
                                    document.querySelector('.duration').innerText = 'Overseas trips to Ireland: ' + (currentCircle.attr('data-visitors')*1000).toLocaleString();
                                    document.querySelector('.numberOfVisitors').innerText = 'Average Length of Stay: ' +currentCircle.attr('data-duration') + ' Nights';
                                } 
                            })
                            
                        })
                        .on('mouseout', function () {
                            var region = d3.select(this);
                            document.querySelector('.regionLegend').innerText = 'Worldwide';
                            d3.selectAll('circle')
                            .each(function(d, i){ 
                                if(d3.select(this).attr('data-code') == region.attr('data-code')){
                                    var currentCircle = d3.select(this)
                                    currentCircle.attr("fill-opacity", .4)
                                    currentCircle.style("fill", "lightgrey")
                                    document.querySelector('.duration').innerText = 'Overseas trips to Ireland: ' + (totalNumberOfVistors*1000).toLocaleString();
                                    document.querySelector('.numberOfVisitors').innerText = 'Average Length of Stay: ' + averageStay + ' Nights';
                                } 
                            })
                        })
                    
                    svg
                    .append("path")
                    .datum([[partCentroid[0], partCentroid[1]], [cx,partCentroid[1]]])
                    .attr('d', d3.line().curve(d3.curveLinear)
                          .x(function(d) { return d[0]; })
                          .y(function(d) { return d[1]; }))
                    .attr('stroke', 'orange')
                    .attr('stroke-width', '1')
                    .style('stroke-dasharray', ('2,1'))
                    
                    svg
                    .append("path")
                    .datum([[cx,cy-Math.sign(partCentroid[1] - irelandCentroid[1])*r],[cx, partCentroid[1]]])
                    .attr('d', d3.line().curve(d3.curveLinear)
                          .x(function(d) { return d[0]; })
                          .y(function(d) { return d[1]; }))
                    .attr('stroke', 'orange')
                    .attr('stroke-width', '1')
                    .style('stroke-dasharray', ('2,1'))
                    
                    console.log(currentCountryData.durationOfStay, strokeLength(currentCountryData.durationOfStay))
                    svg
                    .append("path")
                    .attr('d', d3.arc()
                        .innerRadius(r)
                        .outerRadius(r)
                        .startAngle(0)
                        .endAngle(strokeLength(currentCountryData.durationOfStay)))
                    .attr('transform', 'translate('+ cx +', ' + cy +')')
                    .attr('stroke', 'orange')
                    .attr('stroke-width', '2')
                    .attr('fill', 'none')

                    // Expenditure
                    var angle = 7*Math.PI/4
                    var expenditureData
                    if (currentCountryData.expenditure > averageExpenditure) {
                        expenditureData = [['orange', currentCountryData.expenditure],['grey', averageExpenditure]]
                    } else {
                        expenditureData = [['grey', averageExpenditure],['orange', currentCountryData.expenditure]]
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
                    
                }
          
        });
        // legend
        var valuesToShow = [1000,4000]
        var angleValuesToShow = [4, 8]
        var expenditureValuesToShow = [1000, 2000]
        var expenditureScaleAngle = 7*Math.PI/4
        var xCircle = [110, 40]
        var xLabel = 150
        var legendPosition = height/1.5

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
        .attr('stroke', 'orange')
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
            .attr('stroke', function(d,i) { return i==0?"orange":"grey"; })
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
            .attr('stroke', 'orange')
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
            .attr('stroke', 'orange')
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
            .attr('stroke', 'orange')
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
            .style('font-color', 'orange')
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
            .style('font-color', 'orange')
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
            .style('font-color', 'orange')
            .attr('alignment-baseline', 'middle')

        svg.append('text')
            .attr("y", function(d) { return height - 150; })
            .attr('dominant-baseline',"middle")
            .attr('text-anchor',"middle")
              .append('svg:tspan')
              .attr("x", "50%")
              .attr('dy', 5)
              .text("This map indicates the number of visitors to Ireland based on their area of residence.")
              .append('svg:tspan')
              .attr("x", "50%")
              .attr('dy', 20)
              .text("It also indicates their duration of stay and average expenditure in Ireland")
              
        });

});
