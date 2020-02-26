import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import {FaSmile} from 'react-icons/fa'

export default class PositiveAuthor extends Component { 

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

  getMostPositiveAuthor(){
    if(this.state.comments.length===0) return null
    let authors = {}
    this.state.comments.forEach(c => {
      if(!(c.author in authors))
        authors[c.author]=0
      if('tones' in c)
        authors[c.author]+=c.tones.pos
    })
    let sortable = []
    for(let a in authors)
      sortable.push([a, authors[a]])

    sortable.sort((a, b) => b[1]-a[1])
    const author = sortable[0][0]
    const authorComments = []
    for(let i=0; i<this.state.comments.length; i++){
      const c = this.state.comments[i]
      if(c.author===author && c.tones.pos>=0.5)
        authorComments.push(c.body)
    }

    return (
      <div>
        <a href={'https://www.reddit.com/user/'+author}>u/{author}</a>
        <p>Logged a positive score of {sortable[0][1].toPrecision(3)} with comments like:</p>
        {
          authorComments.map((c, i) => {
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
      authors[c.author]+=c.tones.compound
    })
    let sortable = []
    for(let a in authors)
      sortable.push([a, authors[a]])

    sortable.sort((a, b) => b[1]-a[1])
    return sortable.slice(0, 5).map((el, i) => {
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
      <Card>
        <Card.Header>
          <FaSmile style={{marginRight: '10px'}}/>
          Happiest Author
        </Card.Header>
        <Card.Body>
          {this.getMostPositiveAuthor()}
        </Card.Body>
      </Card>
    )
  }
}
