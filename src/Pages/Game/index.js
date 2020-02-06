import React, { Component } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import Header from 'Components/Header'
import GameHeader from 'Components/GameHeader'
import GameSummary from './Summary'
import FStatistics from './FStatistics'
import RefStatistics from './RefStatistics'
import MVP from './MVP'
import PositiveAuthor from './PositiveAuthor'
import NegativeAuthor from './NegativeAuthor'
import FrequencyChart from './FrequencyChart'
import SentimentChart from './SentimentChart'
import WordCloud from './WordCloud'

export default class Game extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      home: null,
      away: null,
      homeRecord: null,
      awayRecord: null,
      date: null,
      dataEndpoint: null,
      comments: null
    }
  }

  UNSAFE_componentWillMount() {
    fetch('https://api.myjson.com/bins/'+this.props.match.params['id'])
        .then(res => res.json())
        .then(
        result => {
          this.setState({
            home: result['Home'],
            away: result['Away'],
            homeRecord: result['Home Record'],
            awayRecord: result['Away Record'],
            date: result['Date'],
            dataEndpoint: this.props.match.params['id'],
            comments: result['Comments']
          })
       })
  }

  render() {
    return (
      <div>
        <Header/>
        <GameHeader home={this.state.home} homeRecord={this.state.homeRecord} 
                    away={this.state.away} awayRecord={this.state.awayRecord}
                    date={this.state.date}/>
        <Container className='text-center' style={{marginBottom: '1em'}}>
          <Row style={{marginTop: '1em'}}>
            <Col xs={12} id='wordCloudCol'>
              <WordCloud comments={this.state.comments}/>
            </Col>
          </Row>
          <Row style={{marginTop: '1em'}}>
            <Col xs={12} md={8}>
              <FrequencyChart comments={this.state.comments}/>
            </Col>
            <Col xs={12} md={4} style={window.innerWidth<=760 ? {marginTop: '1em'} : {}}>
              <GameSummary comments={this.state.comments}/>
            </Col>
          </Row>
          <Row style={{marginTop: '1em'}}>
            <Col xs={12} style={{height: '400px'}}>
              <SentimentChart comments={this.state.comments}/>
            </Col>
          </Row>
          <Row style={{marginTop: '1em'}}>
            <Col xs={12} md={8}>
              <FStatistics comments={this.state.comments}/>
            </Col>
            <Col xs={12} md={4} style={window.innerWidth<=760 ? {marginTop: '1em'} : {}}>
              <RefStatistics comments={this.state.comments}/>
            </Col>
          </Row>
          <Row style={{marginTop: '1em'}}>
            <Col xs={12}>
              <MVP comments={this.state.comments}/>
            </Col>
          </Row>
          <Row style={{marginTop: '1em', marginBottom: '2em'}}>
            <Col xs={12} md={6}>
              <PositiveAuthor comments={this.state.comments}/>
            </Col>
            <Col xs={12} md={6} style={window.innerWidth<=760 ? {margin: '1em 0em 3em 0em'} : {}}>
              <NegativeAuthor comments={this.state.comments}/>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}
