import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { GiWhistle } from 'react-icons/gi'

const refDerivatives = [/refs/g, /referees/g] 

export default class RefStatistics extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      comments: []
    }
  }

  UNSAFE_componentWillMount(){
    if(this.props.comments.length>this.state.comments.length){
      this.setState({...this.props})
    }
  }

  getRefCount(){
    let refCount = 0
    this.state.comments.forEach(c => {
      const body = c.body.toLowerCase()
      refDerivatives.forEach(d => {
        const matches = body.match(d)
        if(matches!==null)
          refCount+=matches.length
      })
    })
    return refCount
  }

  getRefExamples(){
    let examples = []
    for(let i=0; i<this.state.comments.length; i++){
      const c = this.state.comments[i]
      const body = c.body.toLowerCase()
      for(let j=0; j<refDerivatives.length; j++){
        const d = refDerivatives[j]
        const matches = body.match(d)
        if(matches!==null)
          examples.push({author: c.author, body: c.body})
        if(examples.length>5) break
      }
      if(examples.length>5) break
    }

    return examples.map((el, i) => {
      return (
        <div key={i}>
          <p style={{fontFamily: 'Action Italics NBA', fontSize: '0.8em'}}>
            "{el.body}"
          </p>
          <p>
            - 
            {' '}
            <a href={'https://www.reddit.com/user/'+el.author}>
                u/{el.author} 
            </a>
          </p>
         </div>
      )
    })
  }

  render() {
    return (
      <Card>
        <Card.Header>
          <GiWhistle style={{marginRight: '10px'}} />
          Referee References
        </Card.Header>
        <Card.Body>
          {this.getRefCount()} ref complaints
          <br/>
          {this.getRefExamples()}
        </Card.Body>
      </Card>
    )
  }
}
