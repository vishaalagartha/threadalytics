import React, { Component } from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import Header from 'Components/Header'
//import Logos from 'assets/images/logos.png'
import { TEAM_TO_TEAM_ABBR } from 'helpers/constants'


const styles = {
  analysis: {
        display: 'block', 
        textAlign: 'center',
        background: 'rgba(0,0,0,0.025)',
        border: '2px solid rgba(0,0,0,0.2)',
        textDecoration: 'none',
        cursor: 'pointer',
        color: '#111',
        fontWeight: 600,
        margin: '1em 0.5em 1em 0.5em',
        width: '33%',
        padding: '1em 0.5em 1em 0.5em',
  }
}

export default class Home extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      games: []
    }
  }

  componentWillMount() {
    fetch('https://api.myjson.com/bins/rdgte')
        .then(res => res.json())
        .then(
        result => {
          this.setState({games: result})   
        })
        
  }

  renderGamesForDate = (games) => {

    return games.map(g=> {
      const homeAbbr = TEAM_TO_TEAM_ABBR[g['Home'].toUpperCase()]
      const awayAbbr = TEAM_TO_TEAM_ABBR[g['Away'].toUpperCase()]
      const homeImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + homeAbbr.toLowerCase() + '.png'
      const awayImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + awayAbbr.toLowerCase() + '.png'

      return (
         <Col key={g['Game ID']} xs={12} md={3} style={styles.analysis}>
          <a href={'/games/'+g['Endpoint']}>
            <Row>
              <Col xs={6}>
                <Image alt={g['Away']} src={awayImageUrl} roundedCircle fluid/>
              </Col>
              <Col xs={6}>
                <Image alt={g['Home']} src={homeImageUrl} roundedCircle fluid/>
              </Col>
            </Row>
              <p className='text-center'>
                {awayAbbr} ({g['Away Record']}) @ {homeAbbr} ({g['Home Record']})
              </p>
          </a>
        </Col>
      )
    })
  }

  renderGames = () => {
    const dates = [...new Set(this.state.games.map(el => el['Date']))]

    return dates.map((d, i) => {
      const games = this.state.games.filter(el => el['Date']===d)
      return (
          <div key={i}>
            <Row>
                <Col xs={12}>
                 {d}
                </Col>
             </Row>
             <Row style={{justifyContent: 'space-around'}}>
               {this.renderGamesForDate(games)}
             </Row>
          </div>
       )
    })

  }

  render() {
    return (
      <div>
        <Header/>
        <Container>
          <Row className='text-center' style={{marginTop: '10%'}}>
            <Col xs={12}>
              <h4>
                Providing you with in-depth insights into r/nba Game Thread commentary from fans.
              </h4>
            </Col>
          </Row>
          <Row style={{marginTop: '5%'}}>
            <Col xs={12}>
              <h5 className='text-center' style={{fontSize: '0.8em'}}>
                THREADALYTICS
                performs natural language processing to give you a different view of game threads.
              </h5>
              <h5 style={{fontFamily: 'Action Italics NBA'}}>
                <br/>
                Who was the thread's MVP?
                <br/>
                How did people feel throughout the game?
                <br/>
                Who dropped the most f-bombs during the game?
                <br/>
                What was the saddest comment of the thread?
              </h5>
            </Col>
          </Row>
          <h5>
            Find out now.
          </h5>
          <Col xs={12} style={{margin: '2em 0em 2em 0em'}}>
            {this.renderGames()}
          </Col>
        </Container>
      </div>
    )
  }
}
