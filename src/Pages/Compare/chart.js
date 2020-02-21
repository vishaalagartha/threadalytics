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

export const drawSentimentChart = (data, key) => {
    const id = '#'+key.toLowerCase()+'Chart'
    const svg = d3.select(id)
    if(svg.size()===0) return
    svg.selectAll('g').remove()

    const margin = {top: 80, right: 50, bottom: 150, left: 50}
    const width = svg.node().getBoundingClientRect().width - margin.right - margin.left
    const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom
    
    const chart = d3.select(id).append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`)
                .style('z-index', 1)

    let sortable = [] 
    let absMax = 0
    for(const team in data){
      const sorted = data[team][key].sort()
      const mean = d3.mean(sorted)
      const median = d3.median(sorted)
      const q1 = d3.quantile(sorted, 0.25)
      const q3 = d3.quantile(sorted, 0.75)
      const min = d3.min(sorted)
      const max = d3.max(sorted)
      if(max>absMax)
        absMax = max
      const points = data[team][key]
      sortable.push({x: team, mean, median, q1, q3, min, max, points})
    }
    sortable.sort((a, b) => a.mean-b.mean)
    let xScale = d3.scaleBand().domain(sortable.map(d => d.x))
                                 .range([0, width-margin.right])
    let yScale = d3.scaleLinear().domain([-1, 1])
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

    let div = d3.select('#'+key.toLowerCase()+'Tooltip') 

    chart.selectAll('.box1')
                .data(sortable)
                .enter().append('rect')
                .attr('class', 'box1')
                .attr('fill', d => colors[d.x].main_color)
                .attr('x', d => xScale(d.x)+3)
                .attr('width', xScale.bandwidth()-5)
                .attr('y', d => yScale(d.median))
                .attr('height', 0)
                .on('mouseover', d => { 
                   div.transition()   
                     .duration(200)   
                     .style('opacity', 1)
                   const median = d.median.toPrecision(3)
                   const q1 = d.q1.toPrecision(3)
                   const q3 = d.q3.toPrecision(3)
                   let htmlStr = `Subreddit: r/${d.x}<br/>${key} Sentiment Median:${median}<br/>Q1:${q1}<br/>Q3:${q3}`
                   div.html(htmlStr)  
                      .style('left', xScale(d.x)+20+'px')    
                      .style('top', yScale(d.q3)-50+'px')
                })
                .on('mouseout', () => { 
                  div.transition()   
                    .duration(200)   
                    .style('opacity', 0)
                })

    chart.selectAll('.box1')
                .transition()
                .duration(3000)
                .attr('height', d => Math.abs(yScale(d.median)-yScale(d.q1)))

    chart.selectAll('.box2')
                .data(sortable)
                .enter().append('rect')
                .attr('class', 'box2')
                .attr('fill', d => colors[d.x].main_color)
                .attr('x', d => xScale(d.x)+3)
                .attr('width', xScale.bandwidth()-5)
                .attr('y', d => yScale(d.median))
                .attr('height', 0)
                .on('mouseover', d => { 
                   div.transition()   
                     .duration(200)   
                     .style('opacity', 1)
                   const median = d.median.toPrecision(3)
                   const q1 = d.q1.toPrecision(3)
                   const q3 = d.q3.toPrecision(3)
                   let htmlStr = `Subreddit: r/${d.x}<br/>${key} Sentiment Median:${median}<br/>Q1:${q1}<br/>Q3:${q3}`
                   div.html(htmlStr)  
                      .style('left', xScale(d.x)+20+'px')    
                      .style('top', yScale(d.q1)+100+'px')
                })
                .on('mouseout', () => { 
                  div.transition()   
                    .duration(200)   
                    .style('opacity', 0)
                })

    chart.selectAll('.box2')
                .transition()
                .duration(3000)
                .attr('y', d => yScale(d.q3))
                .attr('height', d => Math.abs(yScale(d.q3)-yScale(d.median))) 
    d3.timeout(() => {
      chart.selectAll('.median')
           .data(sortable)
           .enter().append('line')
           .attr('class', 'median')
           .attr('x1', d => xScale(d.x)+3)
           .attr('x2', d => xScale(d.x)+xScale.bandwidth()-3)
           .attr('y1', d => yScale(d.median))
           .attr('y2', d => yScale(d.median))
           .style('stroke', 'black')
           .style('stroke-width', '1px')

      chart.selectAll('.q1')
           .data(sortable)
           .enter().append('line')
           .attr('class', ' q1')
           .attr('x1', d => xScale(d.x)+3)
           .attr('x2', d => xScale(d.x)+xScale.bandwidth()-3)
           .attr('y1', d => yScale(d.q1))
           .attr('y2', d => yScale(d.q1))
           .style('stroke', 'black')
           .style('stroke-width', '1px')

      chart.selectAll('.q3')
           .data(sortable)
           .enter().append('line')
           .attr('class', 'q3')
           .attr('x1', d => xScale(d.x)+3)
           .attr('x2', d => xScale(d.x)+xScale.bandwidth()-3)
           .attr('y1', d => yScale(d.q3))
           .attr('y2', d => yScale(d.q3))
           .style('stroke', 'black')
           .style('stroke-width', '1px')

      chart.selectAll('range')
           .data(sortable)
           .enter().append('line')
           .attr('class', 'q3')
           .attr('x1', d => xScale(d.x)+xScale.bandwidth()/2)
           .attr('x2', d => xScale(d.x)+xScale.bandwidth()/2)
           .attr('y1', d => yScale(d.min))
           .attr('y2', d => yScale(d.max))
           .style('stroke', 'black')
           .style('stroke-width', '0.2px')
    }, 4000)

    const title = key + ' Sentiment'

    chart.append('text')
         .text(title + 's by Subreddit (sorted from least to most happiest)')
         .style('font-size', '18px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(${width/2-20}, -20)`)
    chart.append('text')
         .text('Subreddit')
         .style('font-size', '11px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(${width/2-20}, ${height+120})`)
    chart.append('text')
         .text(title + ' Score')
         .style('font-size', '11px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(-35, ${height/2+20})rotate(-90)`)


}

export const drawDonutChart = (data, key) => {
  let selector
  if(key==='F*CK Count'){
    selector = 'fChart'
  }
  else{
    selector = 'refChart'
  }
  const svg = d3.select('#'+selector)
  if(svg.size()===0) return
  svg.selectAll('g').remove()

  const margin = {top: 100, right: 50, bottom: 150, left: 50}
  const width = svg.node().getBoundingClientRect().width - margin.right - margin.left
  const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom
  
  const chart = d3.select('#'+selector).append('g')
              .attr('transform', `translate(${width/2+margin.left}, ${height/2+margin.top})`)
              .style('z-index', 1)
  let pieData = []
  for(const team in data){
    pieData.push({team, value: data[team][key]})
  }

  let angles = d3.pie()
                 .value(d => d.value)(pieData)

  let arc = d3.arc()
      .innerRadius(50)
      .outerRadius(200)

  let outerArc = d3.arc()
    .innerRadius(200* 0.9)
    .outerRadius(200 * 0.9)

  chart
    .selectAll('.arc')
    .data(angles)
    .enter()
    .append('path')
    .attr('class', 'arc')
    .attr('d', arc)
    .attr('fill', d => colors[d.data.team].main_color)
    .attr('stroke', 'black')
    .style('stroke-width', '2px')
    .style('opacity', 0.7)
    .on('mouseover', d => {
      chart.select('#'+d.data.team+'Polyline')
           .style('opacity', 1)
      chart.select('#'+d.data.team+'PolylineText')
           .style('opacity', 1)
    })
    .on('mouseout', d => {
      chart.select('#'+d.data.team+'Polyline')
           .style('opacity', 0)
      chart.select('#'+d.data.team+'PolylineText')
           .style('opacity', 0)
    })

  chart
    .selectAll('line')
    .data(angles)
    .enter()
    .append('polyline')
    .attr('class', 'line')
    .attr('id', d => d.data.team+'Polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', d => {
        const posA = arc.centroid(d)
        const posB = outerArc.centroid(d)
        const posC = outerArc.centroid(d)
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        posC[0] = 200 * 0.95 * (midangle < Math.PI ? 1 : -1)
        return [posA, posB, posC]
      })
      .style('opacity', 0)

  chart
    .selectAll('polylineText')
    .data(angles)
    .enter()
    .append('text')
    .style('z-index', 1)
    .text(d => {
      let s = `r/${d.data.team}`
      return s 
    })
    .attr('class', 'polylineText')
    .attr('id', d => d.data.team+'PolylineText')
    .attr('transform', d => {
        const pos = outerArc.centroid(d)
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = 200 * 0.99 * (midangle < Math.PI ? 1 : -1)
        return 'translate(' + pos + ')'
    })
    .style('text-anchor', d => {
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return (midangle < Math.PI ? 'start' : 'end')
    })
    .style('opacity', 0)


  chart.append('text')
       .text(key + ' by Subreddit')
       .style('font-size', '18px')
       .style('text-anchor', 'middle')
       .attr('transform', `translate(0, -${height/2})`)

}
