import React, { Component } from 'react'
import { Container, Card, Row, Col, Image } from 'react-bootstrap'
import Header from 'Components/Header'
import * as d3 from 'd3'
import { leaderboardEndpoints } from 'helpers/constants'
import { drawChart } from './chart'


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

export default class Compare extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      sentimentData: {}
    }
  }

  fetchLeaderboardStatistics(){
    for(const subreddit in leaderboardEndpoints){
      const url = leaderboardEndpoints[subreddit]
      fetch(url)
         .then(res => res.json())
         .then(results => {
           let avgCmpd = []
           let avgPos = []
           let avgNeg = []
           for(let i=0; i<results.data.author.length; i++){
             avgCmpd.push(results.data.compound_sum[i]/results.data.num_comments[i])
             avgPos.push(results.data.pos_sum[i]/results.data.num_comments[i])
             avgNeg.push(results.data.neg_sum[i]/results.data.num_comments[i])
           }
           this.setState({...this.state, 
             sentimentData: {...this.state.sentimentData, 
             [subreddit]: {avgCmpd, avgPos, avgNeg}
             }
           })
         })
    }
  }

  UNSAFE_componentWillMount() {
    this.fetchLeaderboardStatistics()
  }

  drawSentimentChart(data) {
    let sortable = []
    for(const d in data){
      if(data[d].avgCmpd.length===0) continue
      const avgCmpd = data[d].avgCmpd.reduce((p, c) => p+c, 0)/data[d].avgCmpd.length
      const cmpdDev = d3.deviation(data[d].avgCmpd)
      const avgPos = data[d].avgPos.reduce((p, c) => p+c, 0)/data[d].avgPos.length
      const posDev = d3.deviation(data[d].avgPos)
      const avgNeg = data[d].avgNeg.reduce((p, c) => p+c, 0)/data[d].avgNeg.length
      const negDev = d3.deviation(data[d].avgNeg)
      sortable.push({x: d, avgCmpd, cmpdDev, avgPos, posDev, avgNeg, negDev})
    }
    if(sortable.length===0) return
    sortable.sort((a, b) => a.avgCmpd-b.avgCmpd)
    drawChart(sortable, 'avgCmpd', 'cmpdDev', 'Average Compound Sentiment', 'compoundChart')
    sortable.sort((a, b) => a.avgPos-b.avgPos)
    drawChart(sortable, 'avgPos', 'posDev', 'Average Positive Sentiment', 'posChart')
    sortable.sort((a, b) => a.avgNeg-b.avgNeg)
    drawChart(sortable, 'avgNeg', 'negDev', 'Average Negative Sentiment', 'negChart')

  }

  render() {
    this.drawSentimentChart(this.state.sentimentData)
    return (
      <div>
        <Header fromTeam={null}/>
        <Container>
          <Col xs={12} style={{marginTop: '10%', height: '600px'}}>
            <Card style={{width: '100%', height: '100%'}}>
              <svg id='compoundChart' style={{width:'100%', height:'100%'}}>
              </svg>
            </Card>
          </Col>
          <Col xs={12} style={{marginTop: '10%', height: '600px'}}>
            <Card style={{width: '100%', height: '100%'}}>
              <svg id='posChart' style={{width:'100%', height:'100%'}}>
              </svg>
            </Card>
          </Col>
          <Col xs={12} style={{marginTop: '10%', height: '600px'}}>
            <Card style={{width: '100%', height: '100%'}}>
              <svg id='negChart' style={{width:'100%', height:'100%'}}>
              </svg>
            </Card>
          </Col>
        </Container>
      </div>
    )
  }
}
