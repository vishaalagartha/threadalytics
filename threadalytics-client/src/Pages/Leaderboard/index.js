import React, { Component } from 'react'
import { Container, Row, Col, Form} from 'react-bootstrap'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import { RingLoader } from 'react-spinners'
import Header from 'Components/Header'
import { TEAM_TO_SUBREDDIT } from 'helpers/constants'
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit'                     

const { SearchBar } = Search

const sortFunction = (order) => {
      if(order===undefined)
        return (<span><FaCaretUp/><FaCaretDown/></span>)
      else if(order==='asc')
        return (<span><FaCaretDown/></span>)
      else if(order==='desc')
        return (<span><FaCaretUp/></span>)
      return null
    }

const CustomToggleList = ({
    columns,
    onColumnToggle,
    toggles
}) => (
    <div className='btn-group btn-group-toggle btn-group-vertical' data-toggle='buttons'>
      {
              columns
                .map(column => ({
                            ...column,
                            toggle: toggles[column.dataField]
                          }))
                .map(column => (
                            <button
                              type='button'
                              key={ column.dataField }
                              className={ `btn btn-primary ${column.toggle ? 'active' : ''}` }
                              data-toggle='button'
                              aria-pressed={ column.toggle ? 'true' : 'false' }
                              onClick={ () => onColumnToggle(column.dataField) }
                            >
                              { column.text }
                            </button>
                          ))
            }
    </div>
)

const columns = [{
    dataField: 'author',
    text: 'Author',
    formatter: (cell, row) => {
      return (
      <a href={`https://www.reddit.com/user/${cell}`}>/u/{cell}</a>
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
    hidden: window.innerWidth<=760 ? true : false,
    sortCaret: sortFunction
}, {
    dataField: 'neg',
    text: 'Negative Score',
    sort: true,
    hidden: window.innerWidth<=760 ? true : false,
    sortCaret: sortFunction
}, {
    dataField: 'num_comments',
    text: '# Comments',
    sort: true,
    hidden: window.innerWidth<=760 ? true : false,
    sortCaret: sortFunction
}, {
    dataField: 'score',
    text: 'Score',
    sort: true,
    hidden: window.innerWidth<=760 ? true : false,
    sortCaret: sortFunction
}, {
    dataField: 'f_count',
    text: 'F*CK Count',
    sort: true,
    hidden: window.innerWidth<=760 ? true : false,
    sortCaret: sortFunction
}, {
    dataField: 'ref_count',
    text: 'Ref References',
    sort: true,
    hidden: window.innerWidth<=760 ? true : false,
    sortCaret: sortFunction
}]
export default class Leaderboard extends Component { 
  
  constructor(props){
    super(props)

    this.state = {
      lastUpdate: 0,
      tableData: []
    }

  }

  fetchLeaderBoard(subreddit){

    fetch('https://threadalytics.com/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({subreddit})
      })
      .then(res => res.json())
      .then(result => {
        const data = result['data']
        let tableData = []
        for(const a in data){
          const compound = parseFloat(data[a][0]/data[a][3]).toPrecision(3)
          const pos = parseFloat(data[a][1]/data[a][3]).toPrecision(3)
          const neg = parseFloat(data[a][2]/data[a][3]).toPrecision(3)
          const num_comments = data[a][3]
          const score = data[a][4]
          const f_count = data[a][5]
          const ref_count = data[a][6]
          tableData.push({author: a, compound, pos, neg, num_comments, score, f_count, ref_count})
        }
        this.setState({lastUpdate: result['timestamp'], tableData})
      })
      .catch(e => {
        this.setState({lastUpdate: -1, tableData: []})
      })
  }

  UNSAFE_componentWillMount() {
    this.fetchLeaderBoard('nba')
  }

  renderLeaderBoard(){
    const date = new Date(this.state.lastUpdate*1000)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    let dayNum = date.getDate()
    dayNum = (dayNum < 10 ? '0' : '') + dayNum
    const year = date.getFullYear()
    const month = monthNames[date.getMonth()]

    const options = {
      timeStyle: 'short'
    }

    const dateString = `${month} ${dayNum}, ${year} at ` + date.toLocaleTimeString('en-US', options)


    return (
          <div style={{marginTop: '10px'}}>
            <Row>
              <Col xs={12} md={3}>
                <h5>
                    Last Updated on:
                    <br/>
                    {dateString}
                </h5>
                <br/>
                <h5>
                    Toggle using the below buttons.
                </h5>
              </Col>
              <Col xs={12} md={3}>
              <h5>
                Compound Score
              </h5>
              <p>
                Computed as sum of compound sentiment scores (values ranging from -1 to 1 for each comment), divided by the number of comments.
              </p>
              <h5>
                # Comments
              </h5>
              <p>
                Number of comments posted on Game Thread posts since the start of the year.
              </p>
              </Col>
              <Col xs={12} md={3}>
                <h5>
                  Positive Score
                </h5>
                <p>
                  Computed as sum of positive sentiment scores (values ranging from 0 to 1 for each comment), divided by the number of comments.
                </p>
                <h5>
                  Negative Score
                </h5>
                <p>
                  Computed as sum of negative sentiment scores (values ranging from 0 to 1 for each comment), divided by the number of comments.
                </p>
              </Col>
            <Col xs={12} md={3}>
              <h5>
                Score
              </h5>
              <p>
                Aggregated total of upvotes and downvotes for all comments. 
              </p>
              <h5>
                F*CK Count
              </h5>
              <p>
                Number f-word derivatives in comments.
              </p>
              <h5>
                Ref References
              </h5>
              <p>
                Number ref derivatives in comments.
              </p>
            </Col>
            </Row>
            <ToolkitProvider
              keyField='author'
              data={ this.state.tableData }
              columns={ columns }
              columnToggle
              search
            >
              {
                    props => (
                            <div>
                              {window.innerWidth<=760 ? 
                              <CustomToggleList { ...props.columnToggleProps } />
                              :
                              null
                              }
                              <SearchBar { ...props.searchProps } />
                              <hr />
                              <BootstrapTable { ...props.baseProps } bootstrap4={true}
                              style={{fontSize: '1px'}}/>
                            </div>
                          )
                  }
            </ToolkitProvider>
          </div>
    )

  }

  render() {
    let backgroundImage = this.props.match.params['abbr'] 
    if(backgroundImage!==undefined){
      backgroundImage= `url(${'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + backgroundImage.toLowerCase() + '.png'})`
    }
    const containerStyles = {
      backgroundImage,
      backgroundPosition: 'top',
    }
    const loadingColor='black'
    return (
      <div style={containerStyles}>
        <Header fromTeam={this.props.match.params['abbr']}/>
        <Container style={{paddingRight: '5px', paddingLeft: '5px', fontSize: '10px', background: 'white'}} className='rounded'>
          <Row style={{marginTop: '1em', marginBottom: '1em', justifyContent: 'center'}}>
            <h1>
              Choose your subreddit:
            </h1>
          </Row>
          <Row style={{marginTop: '1em', marginBottom: '1em', justifyContent: 'center'}}>
            <Form.Group>
              <Form.Control as='select' size='sm' onChange={e => { 
                this.setState({...this.state, lastUpdate: 0})
                this.fetchLeaderBoard(e.target.value.substr(2))
              }}>
                {
                  ['r/nba', ...Object.values(TEAM_TO_SUBREDDIT)].map((sub, i) => {
                    return (
                      <option key={i}>{sub}</option>
                    )
                  })
                }
              </Form.Control>
            </Form.Group>
          </Row>
          {this.state.lastUpdate===0 ?
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '5em'}}>
              <RingLoader
                size={400}
                color={loadingColor}
                loading={true}
              />
            </div>
            :
            this.renderLeaderBoard()
          }
        </Container>
      </div>
    )
  }
}
