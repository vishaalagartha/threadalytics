import React, { Component } from 'react'
import { Row, Card, Col } from 'react-bootstrap'
import {FaTrophy, FaMedal} from 'react-icons/fa'

export default class MVP extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      comments: []
    }
  }

  UNSAFE_componentWillMount(){
    if(this.props.comments!==this.state.comments)
      this.setState({...this.props})
  }

  getThreadMVP(){
    if(this.state.comments.length===0) return null
    let authors = {}
    this.state.comments.forEach(c => {
      if(!(c.author in authors))
        authors[c.author]=0
      authors[c.author]++
    })
    let sortable = []
    for(let a in authors)
      sortable.push([a, authors[a]])

    sortable.sort((a, b) => b[1]-a[1])
    const MVP = sortable[0][0]
    const MvpComments = []
    for(let i=0; i<this.state.comments.length; i++){
      const c = this.state.comments[i]
      if(c.author===MVP)
        MvpComments.push(c.body)
      if(MvpComments.length>5) break
    }

    return (
      <div>
        <a href={'https://www.reddit.com/user/'+MVP}>u/{MVP}</a>
        <p>Made {sortable[0][1]} comments including:</p>
        {
          MvpComments.map((c, i) => {
            return (
              <p key={i} style={{fontFamily: 'Action Italics NBA'}}>
                  "{c}"
              </p>
            )
          })
        }
      </div>
    )
  }

  getRunnersUp(){
    if(this.state.comments.length===0) return null
    let authors = {}
    this.state.comments.forEach(c => {
      if(!(c.author in authors))
        authors[c.author]=0
      authors[c.author]++
    })
    let sortable = []
    for(let a in authors)
      sortable.push([a, authors[a]])

    sortable.sort((a, b) => b[1]-a[1])
    return sortable.slice(1, 5).map((el, i) => {
      return (
        <div key={el}>
        {i+2}) <a href={'https://www.reddit.com/user/'+el[0]}>u/{el[0]}</a>
          <p>Activity: {el[1]}</p>
        </div>
      )
    })
  }

  render() {
    return (
      <Row>
        <Col xs={12} md={6}>
          <Card>
            <Card.Header>
              <FaTrophy style={{marginRight: '10px'}} />
              Thread MVP
            </Card.Header>
            <Card.Body>
              {this.getThreadMVP()}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} style={window.innerWidth<=760 ? {margin: '1em 0em 3em 0em'} : {}}>
          <Card>
            <Card.Header>
              <FaMedal style={{marginRight: '10px'}} />
              Runners Up
            </Card.Header>
            <Card.Body>
              {this.getRunnersUp()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )
  }
}
