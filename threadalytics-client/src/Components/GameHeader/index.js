import React, { Component } from 'react'
import { Row, Col, Image} from 'react-bootstrap'
import { Zoom, Fade } from 'react-reveal'
import {TEAM_TO_TEAM_ABBR, TEAM_ABBR_TO_TEAM, TEAM_TO_SUBREDDIT, colors} from 'helpers/constants'

let styles = {
  header: {
    minHeight: '220px',
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

export default class GameHeader extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      home: null,
      away: null,
      homeRecord: null,
      awayRecord: null,
      date: null,
      dataEndpoint: null,
      team: null
    }
  }

  componentDidUpdate() {
    if(this.state.home!==this.props.home){
        this.setState({...this.props})
    }
  }

  render() {
    let homeAbbr, awayAbbr, homeImageUrl, awayImageUrl, analysis
    const {home, away, homeRecord, awayRecord} = this.state
    if(home!==null && away!==null && homeRecord!==null && awayRecord!==null){
      homeAbbr = TEAM_TO_TEAM_ABBR[home.toUpperCase()]
      awayAbbr = TEAM_TO_TEAM_ABBR[away.toUpperCase()]
      homeImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + homeAbbr.toLowerCase() + '.png'
      awayImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + awayAbbr.toLowerCase() + '.png'
    }
    if(this.props.team!==undefined){
      styles.header.background = colors[this.props.team].secondary_color
      analysis = TEAM_TO_SUBREDDIT[TEAM_ABBR_TO_TEAM[this.props.team]] 
    }
    else{
      analysis = 'r/nba'
    }
    if(window.innerWidth<=760) {
      styles.header.minHeight='100px'
    }
    return (
      <Zoom>
        <div style={styles.header}>
          <Row style={styles.row}>
            <Col xs={3} md={2}>
              <Fade delay={2000} duration={2000}>
                <Image alt={awayAbbr} src={awayImageUrl} fluid roundedCircle/>
              </Fade>
            </Col>
            <Col xs={6} style={styles.centerColumn} className='text-center'>
            { window.innerWidth > 760 ? 
              <div>
                <h3>
                  { this.props.team ? 
                    <div>{this.props.away} vs {this.props.home}</div>
                    :
                    <div>{this.props.away} @ {this.props.home}</div>
                  }
                </h3>
                <h4>
                  {this.props.date}
                </h4>
                {
                  <h4>
                  {analysis} Game Thread Analysis
                  </h4>
                }
              </div>
              :
              <div>
                <p>
                  {this.props.away} @ {this.props.home}
                </p>
                <p>
                  {this.props.date}
                </p>
                {
                  this.props.team===undefined ? 
                  <p>
                      r/nba Game Thread Analysis
                  </p>
                  :
                  <p>
                  {TEAM_TO_SUBREDDIT[TEAM_ABBR_TO_TEAM[this.props.team]]} Game Thread Analysis
                  </p>
                }
              </div>
            }
            </Col>
            <Col xs={3} md={2}>
              <Fade delay={2000} duration={2000}>
                <Image alt={homeAbbr} src={homeImageUrl} fluid roundedCircle/>
              </Fade>
            </Col>
          </Row>
        </div>
      </Zoom>
    )
  }
}
