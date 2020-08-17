import React from 'react'
import { Row, Col, Image} from 'react-bootstrap'
import { Zoom, Fade } from 'react-reveal'
import {TEAM_TO_TEAM_ABBR, TEAM_ABBR_TO_TEAM, TEAM_TO_SUBREDDIT, colors, logoUrl} from 'helpers/constants'
import {timestampToDate} from 'helpers/utils'
import {isMobile} from 'react-device-detect'

const styles = {
  header: {
    minHeight: isMobile ? '100px' : '220px',
    background: '#fafafa',
    borderBottom: '1px solid #ccc',
    overflow: 'hidden',
  },
  row: {
    display: 'flex',
    justifyContent: 'center'
  },
  centerColumn: {
    marginTop: '3.0em',
  }
}


const GameHeader = ({home, away, homeRecord, awayRecord, team, timestamp}) => { 
  let homeAbbr, awayAbbr, homeUrl, awayUrl 
  if(home!==null && away!==null && homeRecord!==null && awayRecord!==null){
    homeAbbr = TEAM_TO_TEAM_ABBR[home.toUpperCase()]
    awayAbbr = TEAM_TO_TEAM_ABBR[away.toUpperCase()]
    homeUrl = logoUrl(homeAbbr)
    awayUrl = logoUrl(awayAbbr)
  }
  styles.header.background = team ? colors[team].secondary_color : '#fafafa'

  return (
    <Zoom>
      <div style={styles.header}>
        <Row style={styles.row}>
          <Col xs={3} md={2}>
            <Fade delay={2000} duration={2000}>
              <Image alt={awayAbbr} src={awayUrl} fluid roundedCircle/>
            </Fade>
          </Col>
          <Col xs={6} style={styles.centerColumn} className='text-center'>
          { isMobile ? 
            <div>
              <p>
                {away} @ {home}
              </p>
              <p>
                {timestampToDate(timestamp)}
              </p>
              {
                team===undefined ? 
                <p>
                    r/nba Game Thread Analysis
                </p>
                :
                <p>
                {TEAM_TO_SUBREDDIT[TEAM_ABBR_TO_TEAM[team]]} Game Thread Analysis
                </p>
              }
            </div>
            :
            <div>
              <h3>
                { team ? 
                  <div>{away} vs {home}</div>
                  :
                  <div>{away} @ {home}</div>
                }
              </h3>
              <h4>
                {timestampToDate(timestamp)}
              </h4>
              {
                <h4>

                { team ?
                  TEAM_TO_SUBREDDIT[TEAM_ABBR_TO_TEAM[team]] + ' Game Thread Analysis'
                  :
                  'r/nba Game Thread Analysis'
                }
                </h4>
              }
            </div>
          }
          </Col>
          <Col xs={3} md={2}>
            <Fade delay={2000} duration={2000}>
              <Image alt={homeAbbr} src={homeUrl} fluid roundedCircle/>
            </Fade>
          </Col>
        </Row>
      </div>
    </Zoom>
  )
}

export default GameHeader
