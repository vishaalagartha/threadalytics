import React, { Component } from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import Header from 'Components/Header'
import { Fade } from 'react-reveal'
import vishaal_agartha from 'assets/images/vishaal_agartha.jpg'

export default class About extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      games: []
    }
  }

  render() {
    return (
      <div>
        <Header fromTeam={null}/>
        <Container>
          <Fade delay={1000} duration={1000}>
            <Row className='text-center' style={{marginTop: '10%'}}>
              <Col xs={12}>
               THREADALYTICS is brought to you by Vishaal Agartha (/u/vagartha) 
              </Col>
            </Row>
          </Fade>
          <Fade delay={2000}>
            <Row style={{marginTop: '10%'}}>
              <Col xs={3}>
                <Image src={vishaal_agartha} fluid roundedCircle/>
              </Col>
              <Col xs={9}>
                <p>
                  Vishaal is a recent graduation from UCLA's Computer Science program and a software engineer. He's also loves dabbling in NBA statistics and analysis. His home team is the Golden State Warriors (he's not a bandwagoner, he swears!).
                </p>
                <p>
                  His other hobbies include rockclimbing (check out his videos on {' '} 
                    <a href='https://www.youtube.com/channel/UCo2zjhOYtlPWsH_ntJuIofw'>YouTube</a> 
                    {' '} or {' '} <a href='https://www.instagram.com/vishaalagartha/'>Instagram</a>). He also enjoys doing crosswords and other puzzles in his spare time.
                </p>
                <p>
                  For more information about his current projects, interests, and endeavors, check out his {' '} <a href='https://vishaalagartha.github.io/'>personal blog</a>!
                </p>
                <p>
                  Also feel free to DM him on Reddit or email him directly at vishaalagartha@gmail.com for any suggestions, questions, or ideas on how to improve!
                </p>
              </Col>
            </Row> 
          </Fade>
        </Container>
      </div>
    )
  }
}
