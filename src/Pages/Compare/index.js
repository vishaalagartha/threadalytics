import React, { Component } from 'react'
import { Container, Card, Row, Col } from 'react-bootstrap'
import Header from 'Components/Header'
import { leaderboardEndpoints } from 'helpers/constants'
import { drawCommentChart, drawSentimentChart, drawDonutChart } from './chart'


const tipStyle = {
  position: 'absolute',
  opacity: '0',
  textAlign: 'center',     
  width: '150px',   
  height: '100px',         
  padding: '2px',      
  fontSize: '10px',
  background: 'lightsteelblue', 
  border: '0px',    
  borderRadius: '8px',  
  pointerEvents: 'none'     
}

export default class Compare extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      data: {}
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
           let fCount = 0
           let refCount = 0
           let commentCount = 0
           for(let i=0; i<results.data.author.length; i++){
             avgCmpd.push(results.data.compound_sum[i]/results.data.num_comments[i])
             avgPos.push(results.data.pos_sum[i]/results.data.num_comments[i])
             avgNeg.push(results.data.neg_sum[i]/results.data.num_comments[i])
             fCount+=results.data.f_count[i]
             refCount+=results.data.ref_count[i]
             commentCount+=results.data.num_comments[i]
           }
           this.setState({...this.state, 
             data: {...this.state.data, 
             [subreddit]: {'Compound': avgCmpd, 'Positive': avgPos, 'Negative': avgNeg, 'F*CK Count': fCount, 'Ref References': refCount, 'Comment Count': commentCount}
             }
           })
         })
    }
  }

  UNSAFE_componentWillMount() {
    this.fetchLeaderboardStatistics()
  }

  showFList() {
    let sortable = []
    let total = 0
    for(const team in this.state.data){
      total+=this.state.data[team]['F*CK Count']
      sortable.push({team, fCount: this.state.data[team]['F*CK Count']}) 
    }
    sortable.sort((a, b) => b.fCount - a.fCount)

    return (
        <ol>
          {sortable.map(el => {

            return (
              <li key={el.team}>
                {el.team},{' '}
                {el.fCount} F*CKS{' '}
                ({(el.fCount/total*100).toPrecision(3)}%)
              </li>
            )
          })}
        </ol>
    )

  }

  showRefList() {
    let sortable = []
    let total = 0
    for(const team in this.state.data){
      total+=this.state.data[team]['Ref References']
      sortable.push({team, refReferences: this.state.data[team]['Ref References']}) 
    }
    sortable.sort((a, b) => b.refReferences - a.refReferences)

    return (
        <ol>
          {sortable.map(el => {

            return (
              <li key={el.team}>
                {el.team},{' '}
                {el.refReferences} Ref References{' '}
                ({(el.refReferences/total*100).toPrecision(3)}%)
              </li>
            )
          })}
        </ol>
    )

  }

  render() {
    drawSentimentChart(this.state.data, 'Compound')
    drawDonutChart(this.state.data, 'F*CK Count')
    drawDonutChart(this.state.data, 'Ref References')
    drawCommentChart(this.state.data)
    return (
      <div>
        <Header fromTeam={null}/>
        <Container style={{marginBottom: '10%'}}>
          <Col xs={12} style={{marginTop: '10%', height: '600px'}}>
            <Card style={{width: '100%', height: '100%'}}>
              <svg id='commentChart' style={{width:'100%', height:'100%'}}>
              </svg>
              <div id='commentTooltip' style={{...tipStyle, height: '50px'}}>
              </div>
            </Card>
          </Col>
          <Col xs={12} style={{marginTop: '10%', height: '600px'}}>
            <Card style={{width: '100%', height: '100%'}}>
              <svg id='compoundChart' style={{width:'100%', height:'100%'}}>
              </svg>
              <div id='compoundTooltip' style={tipStyle}>
              </div>
            </Card>
          </Col>
          <Card style={{height: '800px', marginTop: '10px'}}>
            <Row>
              <Col xs={6} style={{height: '800px'}}>
                <svg id='fChart' style={{width: '100%', height:'100%', overflow: 'visible'}}>
                </svg>
              </Col>
              <Col xs={{span: 5, offset: 1}} style={{marginTop: '10px'}}>
                {this.showFList()}
              </Col>
           </Row>
          </Card>
          <Card style={{height: '800px', marginTop: '10px'}}>
            <Row>
              <Col xs={6} style={{height: '800px'}}>
                <svg id='refChart' style={{width: '100%', height:'100%', overflow: 'visible'}}>
                </svg>
              </Col>
              <Col xs={{span: 5, offset: 1}} style={{marginTop: '10px'}}>
                {this.showRefList()}
              </Col>
           </Row>
          </Card>
        </Container>
      </div>
    )
  }
}
