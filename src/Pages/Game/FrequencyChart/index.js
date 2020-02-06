import React, {Component} from 'react'
import {Card} from 'react-bootstrap'
import {FaChartLine} from 'react-icons/fa'
import * as d3 from 'd3'

const tipStyle = {
  position: 'absolute',
  opacity: '0',
  textAlign: 'center',     
  width: '100px',   
  height: '30px',         
  padding: '2px',      
  fontSize: '10px',
  background: 'lightsteelblue', 
  border: '0px',    
  borderRadius: '8px',  
  pointerEvents: 'none'     
}

export default class FrequencyChart extends Component {

  constructor(props){
    super(props)
    this.state = {
      comments: []
    }
  }
  
  componentDidUpdate(){
    if(this.props.comments!==this.state.comments){
      this.setState({...this.props})
      this.drawChart(this.props.comments)
    }
  }

  drawChart(comments) {
    const svg = d3.select('#freqChart')
    const margin = {top: 50, right: 50, bottom: 50, left: 50}
    const width = svg.node().getBoundingClientRect().width - margin.right - margin.left
    const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom
    const chart = svg.append('g')
                     .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const timestamps = comments.map(c => c.created_utc*1000).sort()
    console.log(comments.filter(c => c.created_utc*1000===timestamps[0]))
    console.log(comments.filter(c => c.created_utc*1000===timestamps[1]))
    let data = []
    let last_timestamp = timestamps[0]+100*1000
    data.push({'x': timestamps[0], 'y': 0})
    for(let i=0; i<timestamps.length; i++){
      if(timestamps[i]>last_timestamp){
        last_timestamp+=100*1000
        data.push({'x': last_timestamp, 'y': 0})
      }
      data[data.length-1].y++
    }

    const xScale = d3.scaleTime().domain([data[0].x, data[data.length-1].x])
                                 .range([0, width])
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.y)])
                                 .range([height, 0])

    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    xAxis.tickFormat(d3.timeFormat('%I:%M %p'))

    chart.append('g')
        .attr('class', 'y-axis')
        .call(yAxis)

    chart.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)

    d3.select('.x-axis')
      .selectAll('text')
      .filter((d, i) => {
        if(i%2===0)
          return true
        return false
      })
      .remove()

    d3.select('.y-axis')
      .selectAll('text')
      .filter((d, i) => {
        if(i%2===0)
          return true
        return false
      })
      .remove()


    let valueline = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))

    chart.append('path')
       .data([data])  
       .attr('d', d => valueline(d)) 
       .style('fill', 'none')
       .style('stroke', 'steelblue')
       .style('stroke-width', '2px')

    let div = d3.select('#freqTooltip')

    let pointData = data.filter((d, i) => {
      if(i===0 || d.y!==data[i-1].y) return true
      return false
     })

    chart.selectAll('.point')
         .data(pointData)
         .enter()
         .append('circle')
         .attr('class', 'point')
         .attr('r', 3)
         .attr('cx', d => xScale(d.x))
         .attr('cy', d => yScale(d.y))
         .on('mouseover', function(d) {   
           div.transition()   
             .duration(200)   
             .style('opacity', 1)
           let htmlStr = `Time: ${d3.timeFormat('%I:%M %p')(d.x)}<br/>Comments: ${d.y}`
           div.html(htmlStr)  
              .style('left', xScale(d.x)+20+'px')    
              .style('top', yScale(d.y)+70+'px')
         })         
         .on('mouseout', function(d) {   
            div.transition()   
              .duration(200)   
              .style('opacity', 0)
         })

    chart.append('text')
         .text('Time')
         .style('font-size', '12px')
         .attr('transform', `translate(${width/2}, ${height+40})`)

    chart.append('text')
         .text('Number')
         .style('font-size', '12px')
         .attr('transform', `translate(-30, ${height/2+50})rotate(-90)`)
  }

  render() {
    return (
      <Card style={{width: '100%', height: '100%'}}>
        <Card.Header>
          <FaChartLine style={{marginRight: '10px'}}/>
          Comment Frequency
        </Card.Header>
        <div id='freqTooltip' style={tipStyle}>
        </div>
        <svg id='freqChart' style={{width:'100%', height:'100%'}}>
        </svg>
      </Card>
    )
  }
}

