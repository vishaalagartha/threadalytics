import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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

const Team = () => { 

  const [games, setGames] = useState([])
  const params = useParams()

  const teamAbbr = params.abbr
  const team = TEAM_ABBR_TO_TEAM[teamAbbr] 
  const teamSubreddit = TEAM_TO_SUBREDDIT[team].substring(2)

  useEffect(() => {
    const after = 1571731200
    const before = parseInt(+ new Date()/1000)
    fetchGames(after, before, teamSubreddit)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addGames = data => {
    const newGames = data.map(d => {
      let opponent = null
      for(let i=0; i<Object.keys(TEAM_TO_SUBREDDIT).length; i++){
        const l = Object.keys(TEAM_TO_SUBREDDIT)[i].split(' ')
        const s = l[l.length-1]
        if(d.title.toLowerCase().includes(s.toLowerCase())){
          const t = Object.keys(TEAM_TO_SUBREDDIT)[i]
          if(t!==team){
            if(opponent && t.length>opponent.length)
              opponent = t 
            else if(!opponent)
              opponent = t
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
        'home': team,
        'away': opponent,
        'timestamp': date.getTime()/1000,
        'date': `${month} ${dayNum}, ${year}`,
        'title': d.title,
      }
    }).filter(g => g!==null)

    setGames(games => [...games, ...newGames])
  }

  const fetchGames = (after, before, teamSubreddit) => {
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
              if(el.title.toLowerCase().includes('post') || el.title.toLowerCase().includes('pre') || el.title.toLowerCase().includes('discussion') || (el.title.toLowerCase().includes('day') && teamSubreddit!=='UtahJazz'))
                return false
              return true
            })
          addGames(data)
          const nResults = result.data.length 
          if(nResults===25 && data.length>0) {
            before = data[data.length-1].created_utc
            fetchGames(after, before, teamSubreddit)
          }
        })
  }

  const renderGamesForDate = (games) => {
    return games.map((g, i) => {
      const homeAbbr = TEAM_TO_TEAM_ABBR[g['home'].toUpperCase()]
      const awayAbbr = TEAM_TO_TEAM_ABBR[g['away'].toUpperCase()]
      const homeImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + homeAbbr.toLowerCase() + '.png'
      const awayImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + awayAbbr.toLowerCase() + '.png'

      return (
         <Col key={i} xs={12} style={styles.analysis}>
          <Link to={{pathname: `/teams/${teamAbbr}/games/${homeAbbr}@${awayAbbr}-${g['timestamp']}`}}>
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

  const renderGames = () => {
    const dates = [...new Set(games.map(el => el['date']))]
    return dates.map((d, i) => {
      const dateGames = games.filter(el => el['date']===d).splice(0, 1)
      return (
          <Slide left delay={0} duration={1000} key={i}>
            <Row>
                <Col xs={12}>
                 {d}
                </Col>
             </Row>
             <Row>
               {renderGamesForDate(dateGames)}
             </Row>
          </Slide>
       )
    })
  }

  const backgroundImage = teamAbbr ? `url(${'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + teamAbbr.toLowerCase() + '.png'})` : null
  const containerStyles = {
    backgroundImage,
    backgroundPosition: 'top',
  }

  return (
    <div style={containerStyles}>
      <Header team={teamAbbr}/>
      <Container style={{backgroundColor: 'white'}} className='rounded'>
        <Col xs={12} style={{margin: '2em 0em 2em 0em'}}>
          {renderGames()}
        </Col>
      </Container>
    </div>
  )
}

export default Team
