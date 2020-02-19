import React, { Component } from 'react'
import { Container, Row } from 'react-bootstrap'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import Header from 'Components/Header'
import { TEAM_ABBR_TO_TEAM, TEAM_TO_SUBREDDIT, leaderboardEndpoints } from 'helpers/constants'
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
    dataField: 'author',
    text: 'Author',
    formatter: (cell, row) =>
      <a href={`https://www.reddit.com/user/${cell}`}>/u/{cell}</a>
}, {
    dataField: 'compound',
    text: 'Compound Score',
    sort: true,
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

export default class Leaderboard extends Component { 
  
  constructor(props){
    super(props)

    this.state = {
      lastUpdate: 0,
      tableData: []
    }

  }

  fetchLeaderBoard(){
    let subreddit = 'nba'
    let endpoint = leaderboardEndpoints[subreddit]
    if(this.props.match.params['abbr']!==undefined){
      subreddit = TEAM_TO_SUBREDDIT[TEAM_ABBR_TO_TEAM[this.props.match.params['abbr']]]
      endpoint = leaderboardEndpoints[subreddit.substring(2)]
    }
    fetch(endpoint)
        .then(res => res.json())
        .then(
        result => {
          const data = result['data']
          let tableData = []
          for(let i=0; i<data['author'].length; i++){
            const author = data['author'][i]
            const compound = parseFloat(data['compound_sum'][i]/data['num_comments'][i]).toPrecision(3)
            const pos = parseFloat(data['pos_sum'][i]/data['num_comments'][i]).toPrecision(3)
            const neg = parseFloat(data['neg_sum'][i]/data['num_comments'][i]).toPrecision(3)
            const num_comments = data['num_comments'][i]
            const score = data['total_score'][i]
            const f_count = data['f_count'][i]
            const ref_count = data['ref_count'][i]
            tableData.push({author, compound, pos, neg, num_comments, score, f_count, ref_count})
          }
          this.setState({lastUpdate: result['last_update'], tableData})
        })
  }

  UNSAFE_componentWillMount() {
    this.fetchLeaderBoard()
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
          <div style={{marginTop: '10%'}}>
            <Row style={{marginLeft: '10px'}}>
              <h3>
                Last Updated on {dateString}
              </h3>
            </Row>
            <BootstrapTable bootstrap4={true} keyField='author' data={this.state.tableData} columns={ columns } />
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
    return (
      <div style={containerStyles}>
        <Header fromTeam={this.props.match.params['abbr']}/>
        <Container style={{paddingRight: '5px', paddingLeft: '5px', fontSize: '10px', background: 'white'}} className='rounded'>
          {this.state.lastUpdate===0 ?
            null
            :
            this.renderLeaderBoard()
          }
        </Container>
      </div>
    )
  }
}
