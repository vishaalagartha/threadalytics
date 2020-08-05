import React, { Component } from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import Header from 'Components/Header'
import { Link } from 'react-router-dom'
import { Fade,  Slide } from 'react-reveal'
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

  UNSAFE_componentWillMount() {
    let after = 1571731200
    let before = parseInt(+ new Date()/1000)
    this.fetchGames(after, before)
  }

  addGames(data) {
    const re =  /GAME THREAD: (.*) \((\d+-\d+)\) @ (.*) \((\d+-\d+)\) - \((.*)\)/
    const newGames = data.map(d => {
      const m = re.exec(d.title)
      if(m===null) return null
      return {
          'Home': m[1],
          'Home Record': m[2],
          'Away': m[3],
          'Away Record': m[4],
          'Date': m[5],
          'Game ID': d.id,
       }
    }).filter(g => g!==null)

    this.setState({games: [...this.state.games, ...newGames]})
  }

  fetchGames(after, before){
    fetch(`https://api.pushshift.io/reddit/search/submission/?subreddit=nba&after=${after}&before=${before}&q=GAME%20THREAD&selftext=Reddit%20Stream&sort=desc`)
        .then(res => res.json())
        .then(
        result => {
          const data = result.data
          before = data[data.length-1].created_utc
          const nResults = data.length 
          this.addGames(data)
          if(nResults===25) this.fetchGames(after, before)
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
          <Link to={{pathname: '/games/'+g['Game ID'], 
                state: {
                         home: g['Home'],
                         away: g['Away'],
                         homeRecord: g['Home Record'],
                         awayRecord: g['Away Record'],
                         date: g['Date']
                        }
                    }}>
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
          </Link>
        </Col>
      )
    })
  }

  renderGames = () => {
    const dates = [...new Set(this.state.games.map(el => el['Date']))]

    return dates.map((d, i) => {
      const games = this.state.games.filter(el => el['Date']===d)
      return (
          <Slide left delay={0} duration={1000} key={i}>
            <Row>
                <Col xs={12}>
                 {d}
                </Col>
             </Row>
             <Row style={{justifyContent: 'space-around'}}>
               {this.renderGamesForDate(games)}
             </Row>
          </Slide>
       )
    })
  }

  render() {
    return (
      <div>
        <Header fromTeam={null}/>
        <Container>
          <Fade delay={1000} duration={1000}>
            <Row className='text-center' style={{marginTop: '10%'}}>
              <Col xs={12}>
                <h4>
                  Providing you with in-depth insights into r/nba Game Thread commentary from fans.
                </h4>
              </Col>
            </Row>
          </Fade>
          <Row style={{marginTop: '5%'}}>
            <Col xs={12}>
              <Fade delay={2000} duration={1500}>
                <h5 className='text-center' style={{fontSize: '0.8em'}}>
                  THREADALYTICS
                  performs natural language processing to give you a different view of game threads.
                </h5>
              </Fade>
                <h5 style={{fontFamily: 'Action Italics NBA'}}>
                  <br/>
                  <Fade top delay={2500} duration={1000}>
                    Who was the thread's MVP?
                    <br/>
                  </Fade>
                  <Fade top delay={3000} duration={1000}>
                    How did people feel throughout the game?
                    <br/>
                  </Fade>
                  <Fade top delay={3500} duration={1000}>
                    Who dropped the most f-bombs during the game?
                    <br/>
                  </Fade>
                  <Fade top delay={4000} duration={1000}>
                    What was the saddest comment of the thread?
                  </Fade> 
                </h5>
            </Col>
          </Row>
          <Fade delay={5000}>
            <h5>
              Find out now.
            </h5>
          </Fade>
          <Col xs={12} style={{margin: '2em 0em 2em 0em'}}>
            {this.renderGames()}
          </Col>
        </Container>
      </div>
    )
  }
}
