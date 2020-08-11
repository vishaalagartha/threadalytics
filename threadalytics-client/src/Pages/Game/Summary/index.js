import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import {FaListUl} from 'react-icons/fa'

export default class Summary extends Component { 

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

  getCommentsPerMinute(){
    const createdUtcs = this.state.comments.map(el => el.created_utc)
    const maxUtc = Math.max(...createdUtcs) 
    const minUtc = Math.min(...createdUtcs) 
    return parseFloat(this.state.comments.length/(maxUtc-minUtc)*60).toPrecision(3)
  }

  getNumAuthors(){
    let authors = []
    if(typeof this.state.comments[0].author==='string')
      authors = this.state.comments.map(el => el.author)
    else
      authors = this.state.comments.map(el => el.author.author_fullname)
    const uniqueAuthors = [...new Set(authors)]
    return uniqueAuthors.length
  }

  getCommentsPerAuthor(){
    let authorToNumComments = {}
    this.state.comments.forEach(c => {
      if(! (c.author in authorToNumComments) ) 
        authorToNumComments[c.author] = 0
      authorToNumComments[c.author]++
    })

    const numComments = Object.values(authorToNumComments)
    const total = numComments.reduce((acc, c) => acc + c, 0)
    return parseFloat(total/numComments.length).toPrecision(3)
  }

  getTopAuthor(){
    let authors = []
    if(typeof this.state.comments[0].author==='string')
      authors = this.state.comments.map(el => el.author)
    else
      authors = this.state.comments.map(el => el.author.author_fullname)
    const authorCount = {}
    authors.forEach(a => {
      authorCount[a] = authorCount[a] ? authorCount[a] + 1 : 1

    })
    const author = Object.keys(authorCount).sort((a,b) => {return authorCount[b]-authorCount[a]})[0]
    return `/u/${author} (${authorCount[author]} comments)` 
  }

  render() {
    return (
      <Card>
        <Card.Header>
          <FaListUl style={{marginRight: '10px'}} />
          Summary Statistics
        </Card.Header>
        <Card.Body>
          {this.state.comments.length + ' '}
          Total Comments
          <br/>
          {this.getCommentsPerMinute() + ' '}
          Comments/Minute
          <br/>
          {this.getNumAuthors() + ' '}
          Authors Total
          <br/>
          {this.getCommentsPerAuthor()+ ' '}
          Comments/Author
          <br/>
          Top Author:
          <br/>
          {this.getTopAuthor()}
        </Card.Body>
      </Card>
    )
  }
}
