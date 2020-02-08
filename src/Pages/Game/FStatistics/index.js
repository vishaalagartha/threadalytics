import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import {FaBomb} from 'react-icons/fa'

const fDerivatives = [/f+u+c+k.?/g, /phu+c+k.?/g, /f+u+k.?/g, /gtfo/g, /stfu/g, /fml/g, /lmfao/g, /bfd/g, /ffs/g, /wt.?f/g, /fyfi/g] 

export default class FStatistics extends Component { 

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

  getFCount(){
    let fCount = 0
    this.state.comments.forEach(c => {
      const body = c.body.toLowerCase()
      fDerivatives.forEach(d => {
        const matches = body.match(d)
        if(matches!==null)
          fCount+=matches.length
      })
    })
    return fCount
  }

  getFPercentage(){
    return parseFloat(this.getFCount()/this.state.comments.length*100).toPrecision(3)
  }

  getFsPerMinute(){
    const createdUtcs = this.state.comments.map(el => el.created_utc)
    const maxUtc = Math.max(...createdUtcs) 
    const minUtc = Math.min(...createdUtcs) 
    return parseFloat(this.getFCount()/(maxUtc-minUtc)*60).toPrecision(3)
  }

  getFExamples(){
    let examples = []
    for(let i=0; i<this.state.comments.length; i++){
      const c = this.state.comments[i]
      const body = c.body.toLowerCase()
      for(let j=0; j<fDerivatives.length; j++){
        const d = fDerivatives[j]
        const matches = body.match(d)
        if(matches!==null)
          examples.push({author: c.author, body: c.body})
        if(examples.length>5) break
      }
      if(examples.length>5) break
    }

    return examples.map((el, i) => {
      return (
        <p key={i} style={{fontSize: '0.8em', fontFamily: 'Action Italics NBA'}}>
          "{el.body}"
          <br/>
          - 
          {' '}
          <a href={'https://www.reddit.com/user/'+el.author}>
              u/{el.author} 
          </a>
        </p>
      )
    })
  }

  getTopFAuthors(){
    let authors = {}
    this.state.comments.forEach(c => {
      const body = c.body.toLowerCase()
      fDerivatives.forEach(d => {
        const matches = body.match(d)
        if(!(c.author in authors))
          authors[c.author]=0
        if(matches!==null)
          authors[c.author]+=matches.length
      })
    })
    
    let sortable = []
    for(let a in authors)
      sortable.push([a, authors[a]])

    sortable.sort((a, b) => b[1]-a[1])

    return sortable.slice(0, 5).map((el, i) => {
      return (
        <p key={el[0]} style={{fontSize: '0.6em'}}>
          {i+1}){' '}
          <a href={'https://www.reddit.com/user/'+el[0]}>
              u/{el[0]} 
          </a>
          {' '}
          gave {el[1]} {el[1]===1 ? 'fuck' : 'fucks'}
        </p>
      )
    })
  }


  render() {
    return (
      <Card>
        <Card.Header>
          <FaBomb style={{marginRight: '10px'}} />
          F*CK Statistics
        </Card.Header>
        <Card.Body style={{fontSize: '0.8em', marginBottom: '0.5em'}}>
          {this.getFCount()} F*CKS Given through {this.getFPercentage()}% of the comments, at a rate of {this.getFsPerMinute()} FPM 
          <br/>
          This was a {this.getFPercentage()>5 ? 'high' : 'low'} fucks-rate game thread. Here are some examples:
          <br/>
          {this.getFExamples()}
        </Card.Body>
        <Card.Footer>
          Your F*CK Leaders
          <br/>
          {this.getTopFAuthors()}
        </Card.Footer>
      </Card>
    )
  }
}
