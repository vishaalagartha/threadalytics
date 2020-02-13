import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Header from 'Components/Header'
import { Link } from 'react-router-dom'
import { Fade,  Slide } from 'react-reveal'


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

export default class NRL extends Component { 

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
    const newGames = data.map(d => {
      const date = new Date(d.created_utc*1000)
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
      ]
      const month = monthNames[date.getMonth()]
      let dayNum = date.getDate()
      if(dayNum<10)
        dayNum = '0' + dayNum
      const year = date.getFullYear()
      console.log(d)
      return {
          'Title': d.title,
          'Date': `${month} ${dayNum}, ${year}`,
          'Game ID': d.id,
       }
    }).filter(g => g!==null)

    this.setState({games: [...this.state.games, ...newGames]})
  }

  fetchGames(after, before){
    fetch(`https://api.pushshift.io/reddit/search/submission/?subreddit=NRL&after=${after}&before=${before}&q=match%20thread&sort=desc`)
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

      return (
         <Col key={g['Game ID']} xs={12} md={3} style={styles.analysis}>
          <Link to={{pathname: '/nrl/games/'+g['Game ID'], 
                    }}>
            <Row>
            </Row>
              <p className='text-center'>
                {g['Title']}
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
        <Header/>
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
