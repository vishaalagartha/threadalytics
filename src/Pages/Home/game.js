import React, { Component } from 'react'
import { Row, Col, Image } from 'react-bootstrap'
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
        margin: '0em 0em 0em',
        padding: '1em 1em 0em 1em',
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
    fetch('https://api.myjson.com/bins/1gqeha')
        .then(res => res.json())
        .then(
        result => {
          this.setState({games: result})   
        })
        
  }

  renderGamesForDate = (games) => {

    return games.map(g => {
      const homeAbbr = TEAM_TO_TEAM_ABBR[g['Home'].toUpperCase()]
      const awayAbbr = TEAM_TO_TEAM_ABBR[g['Away'].toUpperCase()]
      const homeImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + homeAbbr.toLowerCase() + '.png'
      const awayImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + awayAbbr.toLowerCase() + '.png'

      return (
        <div key={g['Game ID']}>
          <Col xs={4} style={styles.analysis}>
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
          </Col>
        </div>
      )
    })
  }

  renderGames = () => {
    const dates = this.state.games.map(el => el['Date'])

    return dates.map(d => {
      const games = this.state.games.filter(el => el['Date']===d)
      return (
          <div key={d}>
            <Row>
               {d}
             </Row>
             {this.renderGamesForDate(games)}
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
            <h3>
              Providing you with in-depth insights into r/nba Game Thread commentary from fans.
            </h3>
          </Row>
          <Row style={{marginTop: '5%'}}>
            <h5 className='text-center'>
              The r/nba Game Thread Analyzer performs natural language processing to give you a different view of game threads.
            </h5>
            <h5>
              <br/>
              Who was the thread's MVP?
              <br/>
              How did people feel throughout the game?
              <br/>
              Who dropped the most f-bombs during the game?
              <br/>
              What was the saddest comment of the thread?
              <br/>
              Find out now.
            </h5>
          </Row>
          {this.renderGames()}
        </Container>
      </div>
    )
  }
}
