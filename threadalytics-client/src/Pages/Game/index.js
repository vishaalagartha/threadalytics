import React, { Component } from 'react'
import Fade from 'react-reveal'
import vader from 'vader-sentiment'
import { Link } from 'react-router-dom'
import { Card, Container, Col, Row } from 'react-bootstrap'
import {BrowserView} from 'react-device-detect'
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
import { colors, TEAM_ABBR_TO_TEAM, TEAM_TO_TEAM_ABBR } from 'helpers/constants'
import { getNBAGameThread, getTeamGameThread } from 'helpers/reddit'

export default class Game extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      home: null,
      away: null,
      homeRec: null,
      awayRec: null,
      gameId: null,
      date: null,
      fetchedComments: false,
      commentCount: 0,
      comments: [],
      nbaLink: '',
      homeLink: '',
      awayLink: '',
      threadLink: ''
    }
  }

  componentDidMount(){
    const {home, away, timestamp, abbr} = this.props.match.params
    let after = 0

    getNBAGameThread(home, away, timestamp)
        .then(res => {
          if(!res) return
          const re =  /GAME THREAD: (.*) \((\d+-\d+)\) @ (.*) \((\d+-\d+)\) - \((.*)\)/
          const m = re.exec(res.title)
          if(!abbr){
            this.setState({...this.state, 
                home: m[1], 
                homeRec: m[2], 
                away: m[3],
                awayRect: m[4],
                date: m[5],
                nbaLink: res.full_link,
                threadLink: res.full_link,
                gameId: res.id
            })
            this.fetchGameComments(res.id, after, [])
          }
          else{
            this.setState({...this.state, 
                home: m[1], 
                homeRec: m[2], 
                away: m[3],
                awayRect: m[4],
                date: m[5],
                nbaLink: res.full_link,
            })
          }
        })
        .catch(err => {
          getNBAGameThread(away, home, timestamp)
              .then(res => {
                if(!res) return
                const re =  /GAME THREAD: (.*) \((\d+-\d+)\) @ (.*) \((\d+-\d+)\) - \((.*)\)/
                const m = re.exec(res.title)
                if(!abbr){
                  this.setState({...this.state, 
                      home: m[1], 
                      homeRec: m[2], 
                      away: m[3],
                      awayRect: m[4],
                      date: m[5],
                      nbaLink: res.full_link,
                      threadLink: res.full_link,
                      gameId: res.id
                  })
                  this.fetchGameComments(res.id, after, [])
                }
                else{
                  this.setState({...this.state, 
                      home: m[1], 
                      homeRec: m[2], 
                      away: m[3],
                      awayRect: m[4],
                      date: m[5],
                      nbaLink: res.full_link,
                  })
                }
              })
       })

    getTeamGameThread(home, away, timestamp)
        .then(res => {
          if(!res) return
          if(home===abbr){
            this.setState({...this.state, homeLink: res.full_link, gameId: res.id, threadLink: res.full_link})
            this.fetchGameComments(res.id, after, [])
          }
          else
            this.setState({...this.state, homeLink: res.full_link})
        })

    getTeamGameThread(away, home, timestamp)
        .then(res => {
          if(!res) return
          if(away===abbr){
            this.setState({...this.state, awayLink: res.full_link, gameId: res.id, threadLink: res.full_link})
            this.fetchGameComments(res.id, after, [])
          }
          else
            this.setState({...this.state, awayLink: res.full_link})
        })
  }

  addTones(data) {
    let newData = data.filter(d => (d.author!=='[deleted]' && d.body!=='[deleted]'))
    newData.forEach(d => {
      d.tones = vader.SentimentIntensityAnalyzer.polarity_scores(d.body)
    })

    return newData
  }

    fetchGameCommentsPushshift(id, after, comments) {
      const url = `https://api.pushshift.io/reddit/comment/search/?link_id=${id}&limit=500&after=${after}`

    fetch(url)
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
            this.fetchGameCommentsPushshift(id, after, comments)
          }
          else{
            this.setState({...this.state, fetchedComments: true, comments})
          }
        })
  }

  fetchGameComments(id, after, comments) {
      fetch('https://threadalytics.com/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id})
        })
        .then(res => res.json())
        .then(comments => {
            comments = [...this.addTones(comments)]
            this.setState({...this.state, fetchedComments: true, comments})
        })
        .catch(e => {
          this.fetchGameCommentsPushshift(id, after, [])
        })
  }

  renderResources() {
    const {home, away, threadLink} = this.state
    const homeAbbr = TEAM_TO_TEAM_ABBR[home.toUpperCase()]
    const awayAbbr = TEAM_TO_TEAM_ABBR[away.toUpperCase()]
    const { abbr, timestamp } = this.props.match.params 
    let s1, s2, link1, link2
    if(abbr){
      if(homeAbbr===abbr){
        link2 = <Link to={{pathname: `/teams/${awayAbbr}/games/${homeAbbr}@${awayAbbr}-${timestamp}`}}>Opponent Analysis</Link>
      }
      else{
        link2 = <Link to={{pathname: `/teams/${homeAbbr}/games/${homeAbbr}@${awayAbbr}-${timestamp}`}}>Opponent Analysis</Link>
      }
      link1 = <Link to={{pathname: `/games/${homeAbbr}@${awayAbbr}-${timestamp}`}}>r/nba Analysis</Link>
      s1 = 'What is r/nba saying?' 
      s2 = `What's the enemy saying?`
    }
    else{
      s1 = `What are ${home} fans saying?` 
      link1 = <Link to={{pathname: `/teams/${homeAbbr}/games/${homeAbbr}@${awayAbbr}-${timestamp}`}}>{home} Analysis</Link>
      s2 = `What are ${away} fans saying?`
      link2 = <Link to={{pathname: `/teams/${awayAbbr}/games/${homeAbbr}@${awayAbbr}-${timestamp}`}}>{away} Analysis</Link>
    }
    
    return (
      <Card style={{marginTop: '1em'}}>
        <Row style={{paddingTop:'1em', justifyContent: 'space-around'}}>
          <div>
            Where is the content coming from?
            <br/>
            <a href={threadLink}>Actual game thread</a>
          </div>
        </Row>
        <Row>
          <Col xs={6}>
            {s1}
            <br/>
            {link1}
          </Col>
          <Col xs={6}>
            {s2}
            <br/>
            {link2}
          </Col>
        </Row>
      </Card>
    )
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
            {this.renderResources()}
            <Row style={{paddingTop: '1em'}}>
              <Col xs={12} id='wordCloudCol'>
                <BrowserView>
                  <Fade>
                    <WordCloud comments={this.state.comments}/>
                  </Fade>
                </BrowserView>
              </Col>
            </Row>
            <Row style={{paddingTop: '1em', marginBottom: '1em', height: '400px'}}>
                <Col xs={12} md={8}>
                  <FrequencyChart comments={this.state.comments}/>
                </Col>
                <Col xs={12} md={4} style={window.innerWidth<=760 ? {paddingTop: '1em'} : {}}>
                  <GameSummary comments={this.state.comments}/>
                </Col>
            </Row>
            <Row style={{paddingTop: '1em'}}>
              <Col xs={12} style={{height: '400px'}}>
                <SentimentChart comments={this.state.comments}/>
              </Col>
            </Row>
            { 
              this.props.match.params['abbr']===undefined && window.innerWidth>=760 ?
              <Row style={{marginTop: '1em'}}>
                <Col xs={12} style={{height: '600px'}}>
                  <BrowserView>
                    <FlairStats comments={this.state.comments}/>
                  </BrowserView>
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
      minHeight: '500px'
    }
    const {home, away} = this.props.match.params
    let homeTeam = TEAM_ABBR_TO_TEAM[home]
    let awayTeam = TEAM_ABBR_TO_TEAM[away]
    return (
      <div>
        <Header fromTeam={this.props.match.params['abbr']}/>
        <GameHeader home={homeTeam} homeRecord={this.state.homeRecord} 
                    away={awayTeam} awayRecord={this.state.awayRecord}
                    date={this.state.date} team={this.props.match.params['abbr']}/>
          <div style={containerStyles}>
            <Fade delay={10000} duration={2000}>
                {
                  this.state.fetchedComments ? this.renderStatistics() : 
                  <div style={{display: 'flex', justifyContent: 'center'}}>
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
