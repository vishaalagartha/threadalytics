import React, {Component} from 'react'
import {Card} from 'react-bootstrap'
import {GoJersey} from 'react-icons/go'
import {colors} from 'helpers/constants'
import * as d3 from 'd3'

const tipStyle = {
  position: 'absolute',
  opacity: '0',
  textAlign: 'center',     
  width: '500px',   
  height: 'auto',         
  padding: '2px',      
  fontSize: '12px',
  background: 'lightsteelblue', 
  border: '0px',    
  borderRadius: '8px',  
  pointerEvents: 'none', 
  zIndex: 1
}


export default class TrendingPlayers extends Component {

  constructor(props){
    super(props)
    this.state = {
      comments: [],
      homePlayers: [],
      awayPlayers: [],
      data: []
    }
  }
  
  componentDidMount(){
    this.setState({...this.props})
    
    fetch('https://threadalytics.com/api/roster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({team: this.props.home, 'year': new Date().getFullYear()})
      })
      .then(res => res.json())
      .then(data => {
        const players = []
        for(const i in data)
          players.push({'name': data[i], 'team': this.props.home})
        this.setState({...this.state, homePlayers: [...players]})
        if(this.state.awayPlayers.length>0)
          this.getFrequencies()
      })
      fetch('https://threadalytics.com/api/roster', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({team: this.props.away, 'year': new Date().getFullYear()})
        })
        .then(res => res.json())
        .then(data => {
          const players = []
          for(const i in data)
            players.push({'name': data[i], 'team': this.props.away})
          this.setState({...this.state, awayPlayers: [...players]})
          if(this.state.homePlayers.length>0)
            this.getFrequencies()
        })
  }

  getFrequencies = () => {
    const {comments, homePlayers, awayPlayers} = this.state
    const players = [...homePlayers, ...awayPlayers]
    const data = {}
    for(const p in players)
      data[players[p].name] = {count: 0, team: players[p].team, comments: []}
    for(const c in comments)
      for(const p in players){
        const l = players[p].name.split(' ')
        for(const w in l){
          const name = l[w].replace(/[^0-9a-z]/gi, '').toLowerCase()
          if(comments[c].body.toLowerCase().includes(name)){
           data[players[p].name].comments.push(comments[c].body)
           data[players[p].name].count+=1 
           break
          }
        }
    }
    this.setState({...this.state, data})
    this.drawChart()
  }

  drawChart = () => {
    const svg = d3.select('#trendingChart')
    const margin = {top: 80, right: 50, bottom: 150, left: 50}
    const width = svg.node().getBoundingClientRect().width - margin.right - margin.left
    const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom
    const chart = svg.append('g')
                     .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const {data} = this.state
    let sortable = []
    for(const d in data){
      if(data[d].count>0)
        sortable.push({x: d, y: data[d].count, color: colors[data[d].team].main_color, comments: data[d].comments})
    }
    sortable.sort((a, b) => a.y-b.y)

    const xScale = d3.scaleBand().domain(sortable.map(d => d.x))
                                 .range([0, width-margin.right])
    const yScale = d3.scaleLinear().domain([0, sortable[sortable.length-1].y])
                                 .range([height, 0])
    let div = d3.select('#trendingTooltip')
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
                .attr('fill', d => d.color)
                .attr('x', d => xScale(d.x))
                .attr('width', xScale.bandwidth())
                .attr('y', d => yScale(d.y))
                .attr('height', d => height - yScale(d.y))
                .on('mouseover', d => {
                   const {x, y, comments} = d
                   div.transition()   
                     .duration(200)   
                     .style('opacity', 1)
                   let htmlStr = `<h5>${x}: ${y} mentions</h5>`
                   for(let i=0; i<comments.length; i++)
                    htmlStr+=`${comments[i]}<br/>`

                   div.html(htmlStr)  
                      .style('left', margin.left+10+'px')    
                      .style('top', margin.top+'px')

           })         
           .on('mouseout', function(d) {   
              div.transition()   
                .duration(200)   
                .style('opacity', 0)

           })

    chart.append('text')
         .text('Mentions')
         .style('font-size', '12px')
         .attr('transform', `translate(-30, ${height/2+50})rotate(-90)`)
  }
  render() {
    return (
      <Card style={{width: '100%', height: '100%'}}>
        <Card.Header>
          <GoJersey style={{marginRight: '10px'}} />
          Trending Players
        </Card.Header>
        <div id='trendingTooltip' style={tipStyle}>
        </div>
        <svg id='trendingChart' style={{width:'100%', height:'100%', overflow: 'visible'}}>
        </svg>
      </Card>
    )
  }
}

