import React, { useEffect, useState } from 'react'
import Fade from 'react-reveal'
import {useLocation, useParams} from 'react-router-dom'
import { Container, Col, Row } from 'react-bootstrap'
import {BrowserView, isMobile} from 'react-device-detect'
import Header from 'Components/Header'
import GameHeader from 'Components/GameHeader'
import GameSummary from './Summary'
import Resources from './Resources'
import TrendingPlayers from './TrendingPlayers'
import FStatistics from './FStatistics'
import RefStatistics from './RefStatistics'
import MVP from './MVP'
import PositiveAuthor from './PositiveAuthor'
import NegativeAuthor from './NegativeAuthor'
import FrequencyChart from './FrequencyChart'
import SentimentChart from './SentimentChart'
import FlairStats from './FlairStats'
import WordCloud from './WordCloud'
import { RingLoader } from 'react-spinners'
import vader from 'vader-sentiment'
import { colors, TEAM_ABBR_TO_TEAM } from 'helpers/constants'
//import { data } from 'helpers/mockData'
import { getNBAGameThread, getTeamGameThread } from 'helpers/reddit'
//import { fetchGameComments } from 'helpers/comments'
//
const addTones = data => {
  const newData = data.filter(d => (d.author!=='[deleted]' && d.body!=='[deleted]'))
  newData.forEach(d => {
    d.tones = vader.SentimentIntensityAnalyzer.polarity_scores(d.body)
  })
  return newData
}

const Game = () => { 
  const location = useLocation()
  const params = useParams()
  const homeAbbr = params.home
  const awayAbbr = params.away
  const {timestamp, abbr} = params
  const homeTeam = TEAM_ABBR_TO_TEAM[homeAbbr]  
  const awayTeam = TEAM_ABBR_TO_TEAM[awayAbbr] 
  const [numComments, setNumComments] = useState(0)
  const [fetchedComments, setFetchedComments] = useState(0)
  const [homeRec, setHomeRec] = useState()
  const [awayRec, setAwayRec] = useState()
  const [links, setLinks] = useState({nba: '', home: '', away: '', thread: ''})
  const [comments, setComments] = useState([])
  const [fetched, setFetched] = useState(false)

  const fetchGameCommentsPushshift = (id, after, comments) => {
    const url = `https://api.pushshift.io/reddit/comment/search/?link_id=${id}&limit=500&after=${after}`

    return fetch(url)
      .then(res => res.json())
      .then(
        result => {
          const data = result.data
          if(data.length===0) return comments

          after = data[data.length-1].created_utc
          const nResults = data.length 
          comments = [...comments, ...addTones(data)]
          setFetchedComments(comments.length)
          if(nResults===500){
            return fetchGameCommentsPushshift(id, after, comments)
          }
          else
            return comments
        })
    }

  const fetchGameComments = (id, after, comments) => {
      return fetch('https://threadalytics.com/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id: id})
        })
        .then(res => res.json())
        .then(res => {
          const {num_comments} = res
          if(num_comments){
            setNumComments(num_comments)
            // eslint-disable-next-line
            throw('Too many comments, fetching via Pushshift')
          }
          comments = [...addTones(comments)]
          return comments
        })
        .catch(e => {
           return fetchGameCommentsPushshift(id, after, [])
        })
  }


  const fetchData = () => {
    const {timestamp} = params

    getNBAGameThread(homeAbbr, awayAbbr, timestamp)
        .then(res => {
          if(!res) return
          const re =  /GAME THREAD: (.*) \((\d+-\d+)\) @ (.*) \((\d+-\d+)\) - \((.*)\)/
          const m = re.exec(res.title)
          setHomeRec(m[2])
          setAwayRec(m[4])
          if(!abbr){
            setLinks(links => { return {...links, nba: res.full_link, thread: res.full_link}})
            fetchGameComments(res.id, timestamp, [])
                     .then(res => {
                       setFetched(true)
                       setComments(res)
                     })
          }
          else
            setLinks(links => { return {...links, nba: res.full_link}})
        })
        .catch(err => {
          getNBAGameThread(awayAbbr, homeAbbr, timestamp)
              .then(res => {
                if(!res) return
                if(!abbr){
                  setLinks(links => { return {...links, nba: res.full_link, thread: res.full_link}})
                  fetchGameComments(res.id, timestamp, [])
                     .then(res => {
                       setFetched(true)
                       setComments(res)
                     })
                }
                else{
                  setLinks(links => { return {...links, nba: res.full_link}})
                }
              })
       })

    getTeamGameThread(homeAbbr, awayAbbr, timestamp)
        .then(res => {
          if(!res) return
          if(homeAbbr===abbr){
            setLinks(links => { return {...links, home: res.full_link, thread: res.full_link}})
            fetchGameComments(res.id, timestamp, [])
                   .then(res => {
                     setFetched(true)
                     setComments(res)
                   })
          }
          else
            setLinks(links => { return {...links, home: res.full_link}})
        })

    getTeamGameThread(awayAbbr, homeAbbr, timestamp)
        .then(res => {
          if(!res) return
          if(awayAbbr===abbr){
            setLinks(links => { return {...links, away: res.full_link, thread: res.full_link}})
            fetchGameComments(res.id, timestamp, [])
                   .then(res => {
                     setFetched(true)
                     setComments(res)
                   })
          }
          else
            setLinks(links => { return {...links, away: res.full_link}})
        })

  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchData(), [location]) 

  const backgroundImage = abbr ? `url(${'http://i.cdn.turner.com/nba/nba/.element/img/1.0/teamsites/logos/teamlogos_500x500/' + abbr.toLowerCase() + '.png'})` : null
  const loadingColor = abbr ? colors[abbr].main_color : 'grey'
  const containerStyles = {
    backgroundImage,
    backgroundPosition: 'top',
    minHeight: '500px'
  }
  return (
    <div>
      <Header team={abbr}/>
      <GameHeader home={homeTeam} homeRecord={homeRec} 
                  away={awayTeam} awayRecord={awayRec}
                  timestamp={timestamp} team={abbr}/>
        <div style={containerStyles}>
          <Fade delay={10000} duration={2000}>
              {(() => {
                  if(fetched && comments.length>0){
                    return ( 
                      <Container className='text-center' style={{paddingBottom: '1em'}}>
                        <Row style={{paddingTop: '1em'}}>
                          <Col xs={12} id='wordCloudCol'>
                            <Fade>
                              <Resources home={homeTeam} away={awayTeam} threadLink={links.thread}/>
                            </Fade>
                          </Col>
                        </Row>
                        <Row style={{paddingTop: '1em'}}>
                          <Col xs={12} id='wordCloudCol'>
                            <Fade>
                              <WordCloud comments={comments}/>
                            </Fade>
                          </Col>
                        </Row>
                        <Row style={{paddingTop: '1em'}}>
                          <Col xs={12} style={{height: '600px'}}>
                            <TrendingPlayers home={params.home} away={params.away} comments={comments}/>
                          </Col>
                        </Row>
                        <Row style={{paddingTop: '1em', marginBottom: '1em', height: '400px'}}>
                            <Col xs={12} md={8} style={{height: '400px'}}>
                              <FrequencyChart comments={comments}/>
                            </Col>
                            <Col xs={12} md={4} style={isMobile ? {paddingTop: '5em'} : {}}>
                              <GameSummary comments={comments}/>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: '1em'}}>
                          <Col xs={12} style={{height: '400px'}}>
                            <SentimentChart comments={comments}/>
                          </Col>
                        </Row>
                        { 
                          params['abbr']===undefined ?
                          <BrowserView>
                            <Row style={{marginTop: '1em'}}>
                              <Col xs={12} style={{height: '600px'}}>
                                  <FlairStats comments={comments}/>
                              </Col>
                            </Row>
                          </BrowserView>
                          :
                          null
                        }
                        <Row style={{paddingTop: '1em'}}>
                          <Col xs={12}>
                            <MVP comments={comments}/>
                          </Col>
                        </Row>
                        <Row style={{paddingTop: '1em', paddingBottom: '2em'}}>
                          <Col xs={12} md={6}>
                            <PositiveAuthor comments={comments}/>
                          </Col>
                          <Col xs={12} md={6} style={window.innerWidth<=760 ? {padding: '1em 1em 1em 1em'} : {}}>

                            <NegativeAuthor comments={comments}/>
                          </Col>
                        </Row>
                        <Row style={{paddingTop: '1em'}}>
                          <Col xs={12} md={8}>
                            <FStatistics comments={comments}/>
                          </Col>
                          <Col xs={12} md={4} style={window.innerWidth<=760 ? {paddingTop: '1em'} : {}}>
                            <RefStatistics comments={comments}/>
                          </Col>
                        </Row>
                      </Container>
                      )
                    }
                    else if(fetched && comments.length===0){
                      return (
                        <Container className='text-center' style={{paddingBottom: '1em'}}>
                          <Row style={{paddingTop: '3em'}}>
                            <Col xs={12}>
                              <h2>
                                This game is not over yet! Please check again once the game is over.
                              </h2>
                            </Col>
                          </Row>
                        </Container>
                      )
                    }
                    else{
                      return (
                        <div>
                          <div style={{display: 'flex', justifyContent: 'center'}}>
                            <RingLoader size={400} color={loadingColor} loading={true}/>
                          </div>
                          {
                            numComments>0 ?
                            <Row style={{justifyContent: 'center'}}>
                               <h1>Fetched {fetchedComments}/{numComments}</h1>
                            </Row>
                            :
                            <div/>
                          }
                        </div>
                      )
                   }
                })()
              }
          </Fade>
        </div>
    </div>
  )
}

export default Game
