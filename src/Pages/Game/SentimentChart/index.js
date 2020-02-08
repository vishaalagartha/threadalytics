import React, {Component} from 'react'
import {Card} from 'react-bootstrap'
import {FaSmile} from 'react-icons/fa'
import * as d3 from 'd3'

const tipStyle = {
  position: 'absolute',
  opacity: '0',
  textAlign: 'center',     
  width: '150px',   
  height: '30px',         
  padding: '2px',      
  fontSize: '10px',
  background: 'lightsteelblue', 
  border: '0px',    
  borderRadius: '8px',  
  pointerEvents: 'none'     
}

export default class SentimentChart extends Component {

  constructor(props){
    super(props)
    this.state = {
      comments: []
    }
  }
  
  componentDidMount(){
    this.setState({...this.props})
    this.drawChart(this.props.comments)
  }

  drawChart(comments) {
    const svg = d3.select('#sentimentChart')
    const margin = {top: 50, right: 50, bottom: 50, left: 50}
    const width = svg.node().getBoundingClientRect().width - margin.right - margin.left
    const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom
    const chart = svg.append('g')
                     .attr('transform', `translate(${margin.left}, ${margin.top})`)
    const sentiments = comments.filter(c => 'tones' in c).map(c => {
      return {timestamp: c.created_utc*1000, compound: c.tones.compound}
    }).sort((a, b) => a.timestamp-b.timestamp)


    let data = []
    let last_timestamp =sentiments[0].timestamp+100*1000
    let num_points = 1
    data.push({'x': sentiments[0].timestamp, 'y': 0})
    for(let i=0; i<sentiments.length; i++){
      if(sentiments[i].timestamp>last_timestamp){
        last_timestamp+=100*1000
        data[data.length-1].y = data[data.length-1].y/num_points
        num_points = 0
        data.push({'x': last_timestamp, 'y': 0})
      }
      data[data.length-1].y+=sentiments[i].compound
      num_points+=1
    }

    const xScale = d3.scaleTime().domain([data[0].x, data[data.length-1].x])
                                 .range([0, width])
    const yScale = d3.scaleLinear().domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
                                 .range([height, 0])


    chart.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(yScale))

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${yScale(0)})`)
        .call(d3.axisBottom(xScale)
                .tickFormat(d3.timeFormat('%I:%M %p')))


    let valueline = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))

    chart.append('path')
       .data([data])  
       .attr('d', d => valueline(d)) 
       .style('fill', 'none')
       .style('stroke', 'steelblue')
       .style('stroke-width', '2px')

    let div = d3.select('#sentimentTooltip')

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
           let htmlStr = `Time: ${d3.timeFormat('%I:%M %p')(d.x)}<br/>Average Mood: ${d.y.toPrecision(3)}`
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
         .attr('transform', `translate(${width/2}, ${height})`)

    chart.append('text')
         .text('Sentiment Score')
         .style('font-size', '12px')
         .attr('transform', `translate(-30, ${height/2+20})rotate(-90)`)
  }

  render() {
    return (
      <Card style={{width: '100%', height: '100%'}}>
        <Card.Header>
          <FaSmile style={{marginRight: '10px'}} />
          Sentiment Chart
        </Card.Header>
        <div id='sentimentTooltip' style={tipStyle}>
        </div>
        <svg id='sentimentChart' style={{width:'100%', height:'100%'}}>
        </svg>
      </Card>
    )
  }
}

