import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Col, Row } from 'react-bootstrap'
import { TEAM_TO_TEAM_ABBR } from 'helpers/constants'

const Resources = ({home, away, threadLink}) => {
    const params = useParams()
    if(!home || !away) return null
    const {abbr, timestamp} = params
    const homeAbbr = TEAM_TO_TEAM_ABBR[home.toUpperCase()]
    const awayAbbr = TEAM_TO_TEAM_ABBR[away.toUpperCase()]
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

export default Resources

