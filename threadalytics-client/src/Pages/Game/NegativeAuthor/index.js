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

  UNSAFE_componentWillMount(){
    if(this.props.comments!==this.state.comments)
      this.setState({...this.props})
  }

  getMostNegativeAuthor(){
    if(this.state.comments.length===0) return null
    let authors = {}
    this.state.comments.forEach(c => {
      if(!(c.author in authors))
        authors[c.author]={score: 0, count: 0, negCount: 0}
      if('tones' in c){
        authors[c.author].score+=c.tones.neg
        if(c.tones.neg>0)
          authors[c.author].negCount+=1
      }
      authors[c.author].count+=1
    })
    let sortable = []
    for(let a in authors)
      sortable.push([a, authors[a].score, authors[a].count, authors[a].negCount/authors[a].count])

    sortable.sort((a, b) => b[1]-a[1])
    let index, author
    for(const i in sortable){
      if(sortable[i][3]>0.5 && sortable[i][2]>5){
        author = sortable[i][0]
        index = i
        break
      }
    }
    const authorComments = []
    for(let i=0; i<this.state.comments.length; i++){
      const c = this.state.comments[i]
      if(c.author===author && c.tones.neg>=0.5)
        authorComments.push(c.body)
    }

    return (
      <div>
        { author ?
            <div>
              <a href={'https://www.reddit.com/user/'+author}>u/{author}</a>
              <p>Logged a sad score of {sortable[index][1].toPrecision(3)} with comments like:</p>
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
          :
            <div>
              Yay! This was not a very negative game thread, so we could not find a most negative author. :)
            </div>
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
