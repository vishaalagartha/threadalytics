import React, { Component } from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import Header from 'Components/Header'
import { Link } from 'react-router-dom'
import { Slide } from 'react-reveal'
import { TEAM_TO_TEAM_ABBR, TEAM_ABBR_TO_TEAM, TEAM_TO_SUBREDDIT } from 'helpers/constants'


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

export default class Team extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      games: [],
      team: null,
      teamAbbr: null,
      teamSubreddit: null
    }
  }


  componentDidMount(){
    let after = 1571731200
    let before = parseInt(+ new Date()/1000)
    const teamAbbr = this.props.match.params.abbr
    const team = TEAM_ABBR_TO_TEAM[teamAbbr] 
    const teamSubreddit = TEAM_TO_SUBREDDIT[team].substring(2)
    this.setState({...this.state, teamAbbr, team, teamSubreddit})
    this.fetchGames(after, before, teamSubreddit)
  }

  addGames(data) {
    const newGames = data.map(d => {
      let opponent = null
      for(let i=0; i<Object.keys(TEAM_TO_SUBREDDIT).length; i++){
        const l = Object.keys(TEAM_TO_SUBREDDIT)[i].split(' ')
        const s = l[l.length-1]
        if(d.title.toLowerCase().includes(s.toLowerCase())){
          const team = Object.keys(TEAM_TO_SUBREDDIT)[i]
          if(team!==this.state.team){
            opponent = team
            break
          }
        }
      }
      if(opponent===null) return null
      const date = new Date(d.created_utc*1000)
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
      ]
      const month = monthNames[date.getMonth()]
      let dayNum = date.getDate()
      if(dayNum<10)
        dayNum = '0' + dayNum
      const year = date.getFullYear()
      return {
        'Home': this.state.team,
        'Away': opponent,
        'Date': `${month} ${dayNum}, ${year}`,
        'Title': d.title,
        'Game ID': d.id,
        'totalComments': d.num_comments
      }
    }).filter(g => g!==null)

    this.setState({games: [...this.state.games, ...newGames]})
  }

  fetchGames(after, before, teamSubreddit){
    fetch(`https://api.pushshift.io/reddit/search/submission/?subreddit=${teamSubreddit}&after=${after}&before=${before}&q=game%20thread&sort=desc`)
        .then(res => res.json())
        .then(
        result => {
          const data = result.data.filter(el =>
            {
              if(el.title.toLowerCase().includes('post') || el.title.toLowerCase().includes('pre'))
                return false
              return true
            })
          this.addGames(data)
          const nResults = result.data.length 
          if(nResults===25 && data.length>0) {
            before = data[data.length-1].created_utc
            this.fetchGames(after, before, teamSubreddit)
          }
        })
  }

  renderGamesForDate = (games) => {
    return games.map(g=> {
      const homeAbbr = TEAM_TO_TEAM_ABBR[g['Home'].toUpperCase()]
      const awayAbbr = TEAM_TO_TEAM_ABBR[g['Away'].toUpperCase()]
      const homeImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + homeAbbr.toLowerCase() + '.png'
      const awayImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + awayAbbr.toLowerCase() + '.png'

      return (
         <Col key={g['Game ID']} xs={12} style={styles.analysis}>
          <Link to={{pathname: '/teams/' + this.state.teamAbbr + '/games/'+g['Game ID'], 
                state: {
                         home: g['Home'],
                         away: g['Away'],
                         homeRecord: g['Home Record'],
                         awayRecord: g['Away Record'],
                         date: g['Date'],
                         totalComments: g['totalComments']
                        }
                    }}>
            <Row>
              <Col xs={6} md={3}>
                <Image alt={g['Away']} src={awayImageUrl} roundedCircle fluid/>
              </Col>
              <Col xs={6} md={3}>
                <Image alt={g['Home']} src={homeImageUrl} roundedCircle fluid/>
              </Col>
              { window.innerWidth>760 ? 
              <Col xs={6} style={{marginTop: '1em'}}>
                <h3>
                  Post Title:
                  <br/>
                  {g['Title']}
                </h3>
              </Col>
              : null
              }
            </Row>
              <p className='text-center'>
                {awayAbbr} vs. {homeAbbr}
              </p>
          </Link>
        </Col>
      )
    })
  }

  renderGames = () => {
    const dates = [...new Set(this.state.games.map(el => el['Date']))]

    return dates.map((d, i) => {
      const games = this.state.games.filter(el => el['Date']===d).splice(0, 1)
      return (
          <Slide left delay={0} duration={1000} key={i}>
            <Row>
                <Col xs={12}>
                 {d}
                </Col>
             </Row>
             <Row>
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
          <Col xs={12} style={{margin: '2em 0em 2em 0em'}}>
            {this.renderGames()}
          </Col>
        </Container>
      </div>
    )
  }
}
