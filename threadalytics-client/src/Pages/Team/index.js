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
            if(opponent && team.length>opponent.length)
              opponent = team
            else if(!opponent)
              opponent = team
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
      date.setHours(0, 0, 0, 0)
      return {
        'home': this.state.team,
        'away': opponent,
        'timestamp': date.getTime()/1000,
        'date': `${month} ${dayNum}, ${year}`,
        'title': d.title,
      }
    }).filter(g => g!==null)

    this.setState({games: [...this.state.games, ...newGames]})
  }

  fetchGames(after, before, teamSubreddit){
    let query = `game%20thread`
    if(teamSubreddit==='NOLAPelicans')
      query=`GDT`
    else if(teamSubreddit==='CharlotteHornets')
      query=`Charlotte%20Hornets`
    fetch(`https://api.pushshift.io/reddit/search/submission/?subreddit=${teamSubreddit}&after=${after}&before=${before}&q=${query}&sort=desc`)
        .then(res => res.json())
        .then(
        result => {
          const data = result.data.filter(el =>
            {
              if(el.title.toLowerCase().includes('post') || el.title.toLowerCase().includes('pre') || el.title.toLowerCase().includes('discussion'))
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
    return games.map((g, i) => {
      const homeAbbr = TEAM_TO_TEAM_ABBR[g['home'].toUpperCase()]
      const awayAbbr = TEAM_TO_TEAM_ABBR[g['away'].toUpperCase()]
      const homeImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + homeAbbr.toLowerCase() + '.png'
      const awayImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + awayAbbr.toLowerCase() + '.png'

      return (
         <Col key={i} xs={12} style={styles.analysis}>
          <Link to={{pathname: `/teams/${this.state.teamAbbr}/games/${homeAbbr}@${awayAbbr}-${g['timestamp']}`}}>
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
                  {g['title']}
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
    const dates = [...new Set(this.state.games.map(el => el['date']))]

    return dates.map((d, i) => {
      const games = this.state.games.filter(el => el['date']===d).splice(0, 1)
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
    let backgroundImage = this.props.match.params['abbr'] 
    if(backgroundImage!==undefined){
      backgroundImage= `url(${'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + backgroundImage.toLowerCase() + '.png'})`
    }
    const containerStyles = {
      backgroundImage,
      backgroundPosition: 'top',
    }
    return (
      <div style={containerStyles}>
        <Header fromTeam={this.props.match.params.abbr}/>
        <Container style={{backgroundColor: 'white'}} className='rounded'>
          <Col xs={12} style={{margin: '2em 0em 2em 0em'}}>
            {this.renderGames()}
          </Col>
        </Container>
      </div>
    )
  }
}
