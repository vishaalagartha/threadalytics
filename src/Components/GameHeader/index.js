import React, { Component } from 'react'
import { Row, Col, Image} from 'react-bootstrap'
import { Zoom, Fade } from 'react-reveal'
import {TEAM_TO_TEAM_ABBR} from 'helpers/constants'

const styles = {
  header: {
    minHeight: '220px',
    background: '#fafafa',
    borderBottom: '1px solid #ccc'
  },
  row: {
    justifyContent: 'space-around'
  },
  centerColumn: {
    marginTop: '3.0em'
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
    }
  }

  componentDidUpdate() {
    if(this.state.home!==this.props.home){
        this.setState({...this.props})
    }
  }

  render() {
    let homeAbbr, awayAbbr, homeImageUrl, awayImageUrl
    const {home, away, homeRecord, awayRecord} = this.state
    if(home!==null && away!==null && homeRecord!==null && awayRecord!==null){
      homeAbbr = TEAM_TO_TEAM_ABBR[home.toUpperCase()]
      awayAbbr = TEAM_TO_TEAM_ABBR[away.toUpperCase()]
      homeImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + homeAbbr.toLowerCase() + '.png'
      awayImageUrl = 'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + awayAbbr.toLowerCase() + '.png'
    }
    return (
      <Zoom>
        <div style={styles.header}>
          <Row style={styles.row}>
            <Col xs={2}>
            <Fade delay={2000} duration={2000}>
              <Image alt={awayAbbr} src={awayImageUrl} fluid roundedCircle/>
            </Fade>
            </Col>
            <Col xs={6} style={styles.centerColumn} className='text-center'>
              <h3>
                {this.props.away} @ {this.props.home}
              </h3>
              <h4>
                {this.props.date}
              </h4>
              <h4>
                r/nba Game Thread Analysis
              </h4>
            </Col>
            <Col xs={2}>
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
