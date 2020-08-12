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
        authors[c.author]={score: 0, comments: 0}
      authors[c.author].score+=c.score
      authors[c.author].comments+=1
    })
    let sortable = []
    for(let a in authors)
      sortable.push([a, authors[a].score/authors[a].comments, authors[a].comments])

    sortable.sort((a, b) => b[1]-a[1])
    let MVP, index
    for(let i in sortable)
      if(sortable[i][2]>5){
        MVP = sortable[i][0]
        index = i
        break
      }


    const MvpComments = []
    for(let i=0; i<this.state.comments.length; i++){
      const c = this.state.comments[i]
      if(c.author===MVP && c.score>0)
        MvpComments.push(c.body)
      if(MvpComments.length>5) break
    }

    return (
      <div>
        {
          MVP ? 
            <div>
              <a href={'https://www.reddit.com/user/'+MVP}>u/{MVP}</a>
              <p>scored {sortable[index][1].toPrecision(3)} with comments like:</p>
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
          :
          <div>
            Sorry, we don't have enough comments in this thread for an MVP yet!
          </div>
        }
      </div>
    )
  }

  getRunnersUp(){
    if(this.state.comments.length===0) return null
    let authors = {}
    this.state.comments.forEach(c => {
      if(!(c.author in authors))
        authors[c.author]={score: 0, comments: 0}
      authors[c.author].score+=c.score
      authors[c.author].comments+=1
    })
    let sortable = []
    for(let a in authors)
      sortable.push([a, authors[a].score/authors[a].comments, authors[a].comments])

    sortable.sort((a, b) => b[1]-a[1])
    let res = []
    for(let i in sortable)
      if(sortable[i][2]>5){
        res.push(sortable[i])
      }

    if(res.length<3){
      return (
        <div>
          Sorry, there are not enough comments in this thread for Runner's Up.
        </div>
      )


    }


    return res.slice(1, 5).map((el, i) => {
      return (
        <div key={el}>
        {i+2}) <a href={'https://www.reddit.com/user/'+el[0]}>u/{el[0]}</a>
          <p>Score: {el[1].toPrecision(3)}</p>
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
