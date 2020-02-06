import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import {FaSadTear} from 'react-icons/fa'

export default class NegativeAuthor extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      comments: []
    }
  }

  componentDidUpdate(){
    if(this.props.comments!==this.state.comments)
      this.setState({...this.props})
  }

  getMostNegativeAuthor(){
    if(this.state.comments.length===0) return null
    let authors = {}
    this.state.comments.forEach(c => {
      if(!(c.author in authors))
        authors[c.author]=0
      authors[c.author]+=c.tones.neg
    })
    let sortable = []
    for(let a in authors)
      sortable.push([a, authors[a]])

    sortable.sort((a, b) => b[1]-a[1])
    const author = sortable[0][0]
    const authorComments = []
    for(let i=0; i<this.state.comments.length; i++){
      const c = this.state.comments[i]
      if(c.author===author && c.tones.neg>=0.5)
        authorComments.push(c.text)
    }

    return (
      <div>
        <a href={'https://www.reddit.com/user/'+author}>u/{author}</a>
        <p>Logged a sad score of {sortable[0][1].toPrecision(3)} with comments like:</p>
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

  render() {
    return (
      <Card>
        <Card.Header>
          <FaSadTear style={{marginRight: '10px'}} />
          Saddest Author
        </Card.Header>
        <Card.Body>
          {this.getMostNegativeAuthor()}
        </Card.Body>
      </Card>
    )
  }
}
