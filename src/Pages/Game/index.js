import React, { Component } from 'react'
import vader from 'vader-sentiment'
import { Container, Col, Row } from 'react-bootstrap'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
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
      fetchedComments: false,
      commentCount: 0,
      totalComments: 0,
      comments: []
    }
  }

  UNSAFE_componentWillMount() {
    let after = 0
    const id = this.props.match.params['id']
    this.fetchGameComments(id, after, [])
    this.setState({...this.state, ...this.props.location.state})
  }

  addTones(data) {
    let newData = data.filter(d => (d.author!=='[deleted]' && d.body!=='[deleted]'))
    newData.forEach(d => {
      d.tones = vader.SentimentIntensityAnalyzer.polarity_scores(d.body)
    })

    return newData
  }

  fetchGameComments(id, after, comments) {
    fetch(`https://api.pushshift.io/reddit/comment/search/?link_id=${id}&limit=500&after=${after}`)
      .then(res => res.json())
      .then(
      result => {
        const data = result.data
        if(data.length===0){
          this.setState({...this.state, fetchedComments: true, comments})
          return
        }
        after = data[data.length-1].created_utc
        const nResults = data.length 
        this.setState({...this.state, commentCount: this.state.commentCount+nResults})
        comments = [...comments, ...this.addTones(data)]
        if(nResults===500){ 
          this.fetchGameComments(id, after, comments)
        }
        else{
          this.setState({...this.state, fetchedComments: true, comments})
        }
      })
  }

  renderStatistics() {
    if(this.state.comments.length===0)
      return (
        <Container className='text-center' style={{marginBottom: '1em'}}>
          <Row style={{marginTop: '3em'}}>
            <Col xs={12}>
              <h2>
                This game is not over yet! Please check again once the game is over.
              </h2>
            </Col>
          </Row>
        </Container>
      )
    else {
    return (
          <Container className='text-center' style={{marginBottom: '1em'}}>
            <Row style={{marginTop: '1em'}}>
              <Col xs={12} id='wordCloudCol'>
                <WordCloud comments={this.state.comments}/>
              </Col>
            </Row>
            <Row style={{marginTop: '1em', height: '400px'}}>
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
      )
    }
  }

  renderLoadingBar() {
    const p = this.state.totalComments===0 ? 0 : parseInt(this.state.commentCount/this.state.totalComments*100)
    return (
        <Container style={{marginBottom: '1em'}}>
          <Row style={{marginTop: '1em', justifyContent: 'center'}}>
            <h3>
              Calculating statistics...
            </h3>
          </Row>
          <Row style={{marginTop: '3em', justifyContent: 'center'}}>
            <Col xs={3}>
              <CircularProgressbarWithChildren value={p} text={`${p}%`}>
              </CircularProgressbarWithChildren>
            </Col>
          </Row>
        </Container>
    )
  }

  render() {
    return (
      <div>
        <Header/>
        <GameHeader home={this.state.home} homeRecord={this.state.homeRecord} 
                    away={this.state.away} awayRecord={this.state.awayRecord}
                    date={this.state.date}/>
        {
          this.state.fetchedComments ? this.renderStatistics() : this.renderLoadingBar()
        }
      </div>
    )
  }
}
