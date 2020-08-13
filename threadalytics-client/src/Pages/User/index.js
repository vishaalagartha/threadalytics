import React, { Component } from 'react'
import { Container, Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'
import Header from 'Components/Header'
import { Fade } from 'react-reveal'
import BootstrapTable from 'react-bootstrap-table-next'

const sortFunction = (order) => {
      if(order===undefined)
        return (<span><FaCaretUp/><FaCaretDown/></span>)
      else if(order==='asc')
        return (<span><FaCaretDown/></span>)
      else if(order==='desc')
        return (<span><FaCaretUp/></span>)
      return null
    }

const columns = [{
    dataField: 'subreddit',
    text: 'subreddit',
    formatter: (cell, row) => {
      return (
      <a href={`https://www.reddit.com/r/${cell}`}>/r/{cell}</a>
      )
    }
}, {
    dataField: 'compound',
    text: 'Compound Score',
    sort: true,
    hidden: window.innerWidth<=760 ? true : false,
    sortCaret: sortFunction
}, {
    dataField: 'pos',
    text: 'Positive Score',
    sort: true,
    sortCaret: sortFunction
}, {
    dataField: 'neg',
    text: 'Negative Score',
    sort: true,
    sortCaret: sortFunction
}, {
    dataField: 'num_comments',
    text: '# Comments',
    sort: true,
    sortCaret: sortFunction
}, {
    dataField: 'score',
    text: 'Score',
    sort: true,
    sortCaret: sortFunction
}, {
    dataField: 'f_count',
    text: 'F*CK Count',
    sort: true,
    sortCaret: sortFunction
}, {
    dataField: 'ref_count',
    text: 'Ref References',
    sort: true,
    sortCaret: sortFunction
}]


export default class User extends Component { 

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      userData: [],
      hasData: true
    }
  }

  handleSearch = () => {
    fetch('https://threadalytics.com/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: this.state.username})
      })
      .then(res => res.json())
      .then(res => {
        const userData = []
        res.forEach(r => {
          userData.push({'subreddit': r[0],
            'compound': r[1].toPrecision(3),
            'pos': r[2].toPrecision(3),
            'neg': r[3].toPrecision(3),
            'num_comments': r[4],
            'score': r[5],
            'f_count': r[6],
            'ref_count': r[7]
          })
        })
        this.setState({...this.state, userData, hasData: userData.length>0}) 
      })


  }

  render() {
    return (
      <div>
        <Header fromTeam={null}/>
        <Container style={{fontSize: '10px'}}>
          <Fade delay={1000} duration={1000}>
            <Row className='text-center' style={{marginTop: '3%'}}>
              <Col xs={12}>
                <h4>
                  Search for a user using their reddit profile
                </h4>
              </Col>
            </Row>
          </Fade>
          <Row style={{marginTop: '5%', justifyContent: 'center'}}>
            <Col xs={6}>
              <Fade delay={2000} duration={1500}>
                <h5 className='text-center'>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>/u/</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      placeholder='username'
                      value={this.state.search}
                      onChange={e => {
                        this.setState({...this.state, username: e.target.value})
                      }}
                    />
                    <InputGroup.Append>
                      <Button disabled={this.state.username.length===0} onClick={this.handleSearch} variant='primary'>Search</Button>
                    </InputGroup.Append>
                  </InputGroup>
                </h5>
              </Fade>
            </Col>
          </Row>
          { 
            !this.state.hasData ?
            <Row style={{marginTop: '5%', justifyContent: 'center'}}>
              <h4>
                Sorry, we could not find this user!
              </h4>
            </Row>
            :
            null
          }
          {
            this.state.userData.length ?
              <BootstrapTable
                keyField='subreddit'
                data={ this.state.userData }
                columns={ columns }
                striped
                hover
                condensed
                style={{fontSize: '1px'}}
              />
              :
              null
          }
        </Container>
      </div>
    )
  }
}
