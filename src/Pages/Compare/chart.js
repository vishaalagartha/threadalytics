import * as d3 from 'd3'

const colors = {'AtlantaHawks': {'main_color': 'red', 'secondary_color': 'white'},
   'GoNets': {'main_color': 'black', 'secondary_color': 'white'},
   'bostonceltics': {'main_color': 'green', 'secondary_color': 'white'},
   'CharlotteHornets': {'main_color': 'purple', 'secondary_color': 'teal'},
   'chicagobulls': {'main_color': 'red', 'secondary_color': 'black'},
   'clevelandcavs': {'main_color': 'wine', 'secondary_color': 'gold'},
   'mavericks': {'main_color': 'blue', 'secondary_color': 'silver'},
   'denvernuggets': {'main_color': 'blue', 'secondary_color': 'gold'},
   'DetroitPistons': {'main_color': 'blue', 'secondary_color': 'red'},
   'warriors': {'main_color': 'gold', 'secondary_color': 'blue'},
   'rockets': {'main_color': 'red', 'secondary_color': 'silver'},
   'pacers': {'main_color': 'blue', 'secondary_color': 'gold'},
   'LAClippers': {'main_color': 'red', 'secondary_color': 'blue'},
   'lakers': {'main_color': 'purple', 'secondary_color': 'gold'},
   'memphisgrizzlies': {'main_color': 'midnightBlue',
       'secondary_color': 'bealeStreetBlue'},
   'heat': {'main_color': 'red', 'secondary_color': 'black'},
   'MkeBucks': {'main_color': 'green', 'secondary_color': 'cream'},
   'timberwolves': {'main_color': 'blue', 'secondary_color': 'green'},
   'NOLAPelicans': {'main_color': 'blue', 'secondary_color': 'red'},
   'NYKnicks': {'main_color': 'blue', 'secondary_color': 'orange'},
   'Thunder': {'main_color': 'blue', 'secondary_color': 'orange'},
   'OrlandoMagic': {'main_color': 'blue', 'secondary_color': 'silver'},
   'sixers': {'main_color': 'blue', 'secondary_color': 'red'},
   'suns': {'main_color': 'orange', 'secondary_color': 'purple'},
   'ripcity': {'main_color': 'red', 'secondary_color': 'black'},
   'kings': {'main_color': 'purple', 'secondary_color': 'silver'},
   'NBASpurs': {'main_color': 'silver', 'secondary_color': 'black'},
   'torontoraptors': {'main_color': 'red', 'secondary_color': 'silver'},
   'UtahJazz': {'main_color': 'navy', 'secondary_color': 'yellow'},
   'washingtonwizards': {'main_color': 'navy', 'secondary_color': 'red'},
   'nba': {'main_color': 'red', 'secondary_color': 'blue'}}

export const drawChart = (sortable, key, devKey, title, id) => {
    const svg = d3.select('#'+id)
    if(svg.size()===0) return
    svg.selectAll('g').remove()
    const margin = {top: 80, right: 50, bottom: 150, left: 50}
    const width = svg.node().getBoundingClientRect().width - margin.right - margin.left
    const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom
    
    const chart = d3.select('#'+id).append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`)
                .style('z-index', 1)
    let xScale = d3.scaleBand().domain(sortable.map(d => d.x))
                                 .range([0, width-margin.right])
    let yScale = d3.scaleLinear().domain([0, sortable[sortable.length-1][key]])
                                 .range([height, 0])
    chart.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(yScale))

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
            .attr('y', 0)
            .attr('x', 9)
            .attr('dy', '.35em')
            .attr('transform', 'rotate(90)')
            .style('text-anchor', 'start')

    chart.selectAll('.bar')
                .data(sortable)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('fill', d => colors[d.x].main_color)
                .attr('x', d => xScale(d.x))
                .attr('width', xScale.bandwidth())
                .attr('y', height)
                .attr('height', 0)
                .transition()
                .duration(3000)
                .attr('y', d => yScale(d[key]))
                .attr('height', d => height-yScale(d[key]))

    d3.timeout(() => {
      chart.selectAll('.point')
               .data(sortable)
               .enter().append('circle')
               .attr('class', 'point')
               .attr('fill', 'black')
               .attr('r', 2)
               .attr('cx', d => xScale(d.x)+xScale.bandwidth()/2)
               .attr('cy', d => yScale(d[key]))
      chart.selectAll('.deviation')
               .data(sortable)
               .enter().append('line')
               .attr('class', 'deviation')
               .attr('x1', d => xScale(d.x)+xScale.bandwidth()/2)
               .attr('x2', d => xScale(d.x)+xScale.bandwidth()/2)
               .attr('y1', d => yScale(d[key]) + yScale(d[devKey]/2))
               .attr('y2', d => yScale(d[key]) - yScale(d[devKey]/2))
               .style('stroke-width', 1)
               .style('stroke', 'black')
    }, 3000)


    chart.append('text')
         .text(title + 's by Subreddit')
         .style('font-size', '18px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(${width/2-20}, -20)`)
    chart.append('text')
         .text('Subreddit')
         .style('font-size', '12px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(${width/2-20}, ${height+90})`)
    chart.append('text')
         .text(title)
         .style('font-size', '12px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(-35, ${height/2+20})rotate(-90)`)


}
