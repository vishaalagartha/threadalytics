import React, { Component } from 'react'
import Fade from 'react-reveal'
import vader from 'vader-sentiment'
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
import FlairStats from './FlairStats'
import WordCloud from './WordCloud'
import { RingLoader } from 'react-spinners'
import { colors } from 'helpers/constants'

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
      comments: []
    }
  }

  componentDidMount(){
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
          <Container className='text-center' style={{paddingBottom: '1em'}}>
            <Row style={{paddingTop: '3em'}}>
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
          <Container className='text-center' style={{paddingBottom: '1em'}}>
            <Row style={{paddingTop: '1em'}}>
              <Col xs={12} id='wordCloudCol'>
                <Fade>
                <WordCloud comments={this.state.comments}/>
                </Fade>
              </Col>
            </Row>
            <Row style={{paddingTop: '1em', marginBottom: '1em', height: '400px'}}>
                <Col xs={12} md={8} style={{overflow: 'hidden'}}>
                  <FrequencyChart comments={this.state.comments}/>
                </Col>
                <Col xs={12} md={4} style={window.innerWidth<=760 ? {paddingTop: '1em'} : {}}>
                  <GameSummary comments={this.state.comments}/>
                </Col>
            </Row>
            <Row style={{paddingTop: '1em'}}>
              <Col xs={12} style={{height: '400px', overflow: 'hidden'}}>
                <SentimentChart comments={this.state.comments}/>
              </Col>
            </Row>
            { 
              this.props.match.params['abbr']===undefined && window.innerWidth>=760 ?
              <Row style={{marginTop: '1em'}}>
                <Col xs={12} style={{height: '600px'}}>
                  <FlairStats comments={this.state.comments}/>
                </Col>
              </Row>
              :
              null
            }
            <Row style={{paddingTop: '1em'}}>
              <Col xs={12}>
                <MVP comments={this.state.comments}/>
              </Col>
            </Row>
            <Row style={{paddingTop: '1em', paddingBottom: '2em'}}>
              <Col xs={12} md={6}>
                <PositiveAuthor comments={this.state.comments}/>
              </Col>
              <Col xs={12} md={6} style={window.innerWidth<=760 ? {padding: '1em 1em 1em 1em'} : {}}>

                <NegativeAuthor comments={this.state.comments}/>
              </Col>
            </Row>
            <Row style={{paddingTop: '1em'}}>
              <Col xs={12} md={8}>
                <FStatistics comments={this.state.comments}/>
              </Col>
              <Col xs={12} md={4} style={window.innerWidth<=760 ? {paddingTop: '1em'} : {}}>
                <RefStatistics comments={this.state.comments}/>
              </Col>
            </Row>
          </Container>
      )
    }
  }

  render() {
    let backgroundImage = this.props.match.params['abbr'] 
    let loadingColor = 'grey'
    if(backgroundImage!==undefined){
      loadingColor = colors[backgroundImage].main_color
      backgroundImage= `url(${'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + backgroundImage.toLowerCase() + '.png'})`
    }
    const containerStyles = {
      backgroundImage,
      backgroundPosition: 'top',
    }
    return (
      <div>
        <Header fromTeam={this.props.match.params['abbr']}/>
        <GameHeader home={this.state.home} homeRecord={this.state.homeRecord} 
                    away={this.state.away} awayRecord={this.state.awayRecord}
                    date={this.state.date} team={this.props.match.params['abbr']}/>
          <div style={containerStyles}>
            <Fade delay={10000} duration={2000}>
                {
                  this.state.fetchedComments ? this.renderStatistics() : 
                  <div style={{}}>
                    <RingLoader
                      size={400}
                      color={loadingColor}
                      loading={true}
                    />
                  </div>
                }
            </Fade>
          </div>
      </div>
    )
  }
}
