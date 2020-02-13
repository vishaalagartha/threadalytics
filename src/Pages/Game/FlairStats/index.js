import React, {Component} from 'react'
import {Card} from 'react-bootstrap'
import {FaSmile} from 'react-icons/fa'
import {TEAM_ABBR_TO_TEAM} from 'helpers/constants'
import * as d3 from 'd3'

const fDerivatives = [/f+u+c+k.?/g, /phu+c+k.?/g, /f+u+k.?/g, /gtfo/g, /stfu/g, /fml/g, /lmfao/g, /bfd/g, /ffs/g, /wt.?f/g, /fyfi/g] 
const refDerivatives = [/refs/g, /referees/g] 

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

const descripStyle = {
  position: 'absolute',
  opacity: '0',
  padding: '2px',      
  fontSize: '15px',
  width: '300px',
  color: 'white',
  border: '0px',    
  borderRadius: '8px',  
  pointerEvents: 'none',
  zIndex: 1
}

const colors = {'Hawks': {'main_color': 'red', 'secondary_color': 'white'},
   'Bucks': {'main_color': 'green', 'secondary_color': 'cream'},
   'Celtics': {'main_color': 'green', 'secondary_color': 'white'},
   'Nets': {'main_color': 'black', 'secondary_color': 'white'},
   'Bulls': {'main_color': 'red', 'secondary_color': 'black'},
   'Hornets': {'main_color': 'purple', 'secondary_color': 'teal'},
   'Cavaliers': {'main_color': 'wine', 'secondary_color': 'gold'},
   'Mavericks': {'main_color': 'blue', 'secondary_color': 'silver'},
   'Nuggets': {'main_color': 'blue', 'secondary_color': 'gold'},
   'Pistons': {'main_color': 'blue', 'secondary_color': 'red'},
   'Warriors': {'main_color': 'gold', 'secondary_color': 'blue'},
   '76ers': {'main_color': 'blue', 'secondary_color': 'red'},
   'Rockets': {'main_color': 'red', 'secondary_color': 'silver'},
   'Pacers': {'main_color': 'blue', 'secondary_color': 'gold'},
   'Clippers': {'main_color': 'red', 'secondary_color': 'blue'},
   'Lakers': {'main_color': 'purple', 'secondary_color': 'gold'},
   'Timberwolves': {'main_color': 'blue', 'secondary_color': 'green'},
   'Grizzlies': {'main_color': 'midnightBlue',
       'secondary_color': 'bealeStreetBlue'},
   'Heat': {'main_color': 'red', 'secondary_color': 'black'},
   'Pelicans': {'main_color': 'blue', 'secondary_color': 'red'},
   'Knicks': {'main_color': 'blue', 'secondary_color': 'orange'},
   'Thunder': {'main_color': 'blue', 'secondary_color': 'orange'},
   'Magic': {'main_color': 'blue', 'secondary_color': 'silver'},
   'Suns': {'main_color': 'orange', 'secondary_color': 'purple'},
   'Blazers': {'main_color': 'red', 'secondary_color': 'black'},
   'Kings': {'main_color': 'purple', 'secondary_color': 'silver'},
   'Spurs': {'main_color': 'silver', 'secondary_color': 'black'},
   'Raptors': {'main_color': 'red', 'secondary_color': 'silver'},
   'Jazz': {'main_color': 'navy', 'secondary_color': 'yellow'},
   'Wizards': {'main_color': 'navy', 'secondary_color': 'red'},
   'unknown': {'main_color': 'black', 'secondary_color': 'black'}}

export default class SentimentChart extends Component {

  constructor(props){
    super(props)
    this.state = {
      comments: []
    }
  }
  
  componentDidMount(){
    this.setState({...this.props})
    this.drawCharts(this.props.comments)
  }

  formatData(comments){
    let flairs = {}
    comments.forEach(c => {
      if(!(c.author_flair_text in flairs)){
        flairs[c.author_flair_text] = {numComments: 0, numRefComplaints: 0, numFBombs: 0}
      }
      flairs[c.author_flair_text].numComments+=1
      fDerivatives.forEach(d => {
        const matches = c.body.match(d)
        if(matches!==null)
          flairs[c.author_flair_text].numFBombs+=matches.length
      })
      refDerivatives.forEach(d => {
        const matches = c.body.match(d)
        if(matches!==null)
          flairs[c.author_flair_text].numRefComplaints+=matches.length
      })
    })

    let fixedFlairs = {unknown: {numComments: 0, numRefComplaints: 0, numFBombs: 0}}
    for(let i=0; i<Object.keys(flairs).length; i++){
      const k1 = Object.keys(flairs)[i]
      if(k1.length<3){
        fixedFlairs.unknown.numComments+=flairs[k1].numComments
        fixedFlairs.unknown.numRefComplaints+=flairs[k1].numRefComplaints
        fixedFlairs.unknown.numFBombs+=flairs[k1].numFBombs
      }
      for(let j=0; j<Object.keys(TEAM_ABBR_TO_TEAM).length; j++){
        const k2 = Object.keys(TEAM_ABBR_TO_TEAM)[j]
        const v = TEAM_ABBR_TO_TEAM[k2]
        if(v.includes(k1) || k1.includes(k2)){
          const l = v.split(' ')
          const newKey = l[l.length-1]
          if(!(newKey in fixedFlairs))
            fixedFlairs[newKey] = {numComments: 0, numRefComplaints: 0, numFBombs: 0}
          fixedFlairs[newKey].numComments+=flairs[k1].numComments
          fixedFlairs[newKey].numRefComplaints+=flairs[k1].numRefComplaints
          fixedFlairs[newKey].numFBombs+=flairs[k1].numFBombs
        }
      }
    }
    return fixedFlairs
  }

  drawCharts(comments) {
    const svg = d3.select('#flairChart')
    const margin = {top: 80, right: 50, bottom: 150, left: 50}
    const width = svg.node().getBoundingClientRect().width - margin.right - margin.left
    const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom
    const charts = svg.append('g')
                     .attr('transform', `translate(${margin.left}, ${margin.top})`)

    let data = this.formatData(comments)

    let sortable = []
    for(const d in data)
      sortable.push({x: d, y: data[d].numComments})
    sortable.sort((a, b) => a.y-b.y)

    const commentChart = charts.append('g')
    let xScale = d3.scaleBand().domain(sortable.map(d => d.x))
                                 .range([0, width/3-margin.right])
    let yScale = d3.scaleLinear().domain([0, sortable[sortable.length-1].y])
                                 .range([height, 0])
    commentChart.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(yScale))

    commentChart.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
            .attr('y', 0)
            .attr('x', 9)
            .attr('dy', '.35em')
            .attr('transform', 'rotate(90)')
            .style('text-anchor', 'start')

    commentChart.selectAll('.bar')
                .data(sortable)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('fill', d => colors[d.x].main_color)
                .attr('x', d => xScale(d.x))
                .attr('width', xScale.bandwidth())
                .attr('y', d => yScale(d.y))
                .attr('height', d => height - yScale(d.y))

    sortable = []
    for(const d in data)
      sortable.push({x: d, y: data[d].numFBombs})
    sortable.sort((a, b) => a.y-b.y)

    const fChart = charts.append('g')
                         .attr('transform', `translate(${width/3+margin.left}, 0)`)
    xScale = d3.scaleBand().domain(sortable.map(d => d.x))
                                 .range([0, width/3-margin.right])
    yScale = d3.scaleLinear().domain([0, sortable[sortable.length-1].y])
                                 .range([height, 0])
    fChart.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(yScale))

    fChart.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
            .attr('y', 0)
            .attr('x', 9)
            .attr('dy', '.35em')
            .attr('transform', 'rotate(90)')
            .style('text-anchor', 'start')

    fChart.selectAll('.bar')
                .data(sortable)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('fill', d => colors[d.x].main_color)
                .attr('x', d => xScale(d.x))
                .attr('width', xScale.bandwidth())
                .attr('y', d => yScale(d.y))
                .attr('height', d => height - yScale(d.y))

    sortable = []
    for(const d in data)
      sortable.push({x: d, y: data[d].numRefComplaints})
    sortable.sort((a, b) => a.y-b.y)

    const refChart = charts.append('g')
                         .attr('transform', `translate(${2*width/3+margin.left}, 0)`)
    xScale = d3.scaleBand().domain(sortable.map(d => d.x))
                                 .range([0, width/3-margin.right])
    yScale = d3.scaleLinear().domain([0, sortable[sortable.length-1].y])
                                 .range([height, 0])
    refChart.append('g')
        .attr('class', 'y axis')
        .call(d3.axisLeft(yScale))

    refChart.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
            .attr('y', 0)
            .attr('x', 9)
            .attr('dy', '.35em')
            .attr('transform', 'rotate(90)')
            .style('text-anchor', 'start')

    refChart.selectAll('.bar')
                .data(sortable)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('fill', d => colors[d.x].main_color)
                .attr('x', d => xScale(d.x))
                .attr('width', xScale.bandwidth())
                .attr('y', d => yScale(d.y))
                .attr('height', d => height - yScale(d.y))

    commentChart.append('text')
         .text('Comments by Flair')
         .style('font-size', '18px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(${width/6-20}, -20)`)
    fChart.append('text')
         .text('F*CKS by Flair')
         .style('font-size', '18px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(${width/6-20}, -20)`)
    refChart.append('text')
         .text('Referee Complaints by Flair')
         .style('font-size', '18px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(${width/6-20}, -20)`)
    commentChart.append('text')
         .text('Team')
         .style('font-size', '12px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(${width/6-20}, ${height+90})`)
    fChart.append('text')
         .text('Team')
         .style('font-size', '12px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(${width/6-20}, ${height+90})`)
    refChart.append('text')
         .text('Team')
         .style('font-size', '12px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(${width/6-20}, ${height+90})`)
    commentChart.append('text')
         .text('Count')
         .style('font-size', '12px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(-30, ${height/2+20})rotate(-90)`)
    fChart.append('text')
         .text('Count')
         .style('font-size', '12px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(-30, ${height/2+20})rotate(-90)`)
    refChart.append('text')
         .text('Count')
         .style('font-size', '12px')
         .style('text-anchor', 'middle')
         .attr('transform', `translate(-30, ${height/2+20})rotate(-90)`)
  }

  render() {
    return (
      <Card style={{width: '100%', height: '100%'}}>
        <Card.Header>
          <FaSmile style={{marginRight: '10px'}} />
          Flair Statistics
        </Card.Header>
        <div id='flairTooltip' style={tipStyle}>
        </div>
        <div id='flairDescription' style={descripStyle}>
        </div>
        <svg id='flairChart' style={{width:'100%', height:'100%'}}>
        </svg>
      </Card>
    )
  }
}

