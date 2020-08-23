import React, { useEffect, useState } from 'react'
import Fade from 'react-reveal'
import { Container, Col, Row, Image, Alert } from 'react-bootstrap'
import Header from 'Components/Header'
import { RingLoader } from 'react-spinners'
import { SUBREDDIT_TO_TEAM, TEAM_TO_SUBREDDIT, TEAM_TO_TEAM_ABBR, stopwords, logoUrl } from 'helpers/constants'
import { players } from 'helpers/players'
//import { data } from 'helpers/mockData'

const styles = {
  question: {
      display: 'block', 
      textAlign: 'center',
      background: 'rgba(0,0,0,0.025)',
      border: '2px solid rgba(0,0,0,0.2)',
      textDecoration: 'none',
      color: '#111',
      fontWeight: 600,
      margin: '1em 0.5em 1em 0.5em',
      width: '60%',
      padding: '1em 0.5em 1em 0.5em',
  }
}

const Guess = () => { 
  const [score, setScore] = useState(0)
  const [attempted, setAttempted] = useState(0)

  const initialData = {}
  Object.values(TEAM_TO_SUBREDDIT).forEach(sub => {
    initialData[sub.substr(2)] = {before: parseInt(new Date().getTime()/1000), index: 0, comments: []}
  })
  const [data, setData] = useState(initialData)

  const [status, setStatus] = useState('unselected')

  const [options, setOptions] = useState(null)



  const fetchCommentsForSub = sub => {
    const {before, comments, index} = data[sub] 
    if(index<comments.length-1 || options) return Promise.resolve({...data[sub], sub})
    const teamAbbr = TEAM_TO_TEAM_ABBR[SUBREDDIT_TO_TEAM['r/'+sub].toUpperCase()] 
    const teamPlayers = players.filter(p => p.team===teamAbbr)

    const teamFilter = c => {
      /*
      if(c.body.length>200) return false
      for(const p in teamPlayers){
        const l = teamPlayers[p].name.split(' ')
        for(const w in l){
          const name = l[w].replace(/[^0-9a-z]/gi, '').toLowerCase()
          if(c.body.toLowerCase().includes(' '+name+' ') && stopwords.indexOf(name)===-1){
            return true
          }
        }
      }
      return false
      */
      return true
    }

    const url = `https://api.pushshift.io/reddit/search/comment/?subreddit=${sub}&size=100&before=${before}`
    return fetch(url)
        .then(res => res.json())
        .then(res => {
          if(!res.data) return
          const newBefore = res.data[0].created_utc
          const linkId = []
          const comments = res.data.filter(teamFilter).map(d => {
            linkId.push(d.link_id.substr(3))
            return {body: d.body, author: d.author}
          })
          const linkIdStr = linkId.join(',')
          const url = `https://api.pushshift.io/reddit/search/submission/?subreddit=${sub}&ids=${linkIdStr}`
          return fetch(url)
              .then(res => res.json())
              .then(res => {
                if(!res.data) return
                const titleData = res.data
                for(const i in linkId)
                  for(const j in titleData){
                    if(titleData[j].id===linkId[i]){
                      comments[i].title = titleData[j].title
                      break
                    }
                  }
                const subData = {before: newBefore, index: 0, comments}
                setData(data => { return {...data, [sub]: subData}})
                return {...subData, sub}
              })




        })

  }

  const getTeamOptions = () => {
    if(options) return
    const teams = Object.values(TEAM_TO_SUBREDDIT).map(s => s.substr(2))
    const t = teams[Math.floor(Math.random() * Math.floor(teams.length))]
    fetchCommentsForSub(t)
      .then(res => {
        const {comments, sub, index} = res

        const correctOpt = {...comments[index], team: sub, image: logoUrl(TEAM_TO_TEAM_ABBR[SUBREDDIT_TO_TEAM['r/'+sub].toUpperCase()]), correct: true, color: '#d4edda'}
        const seenOptions = [sub]
        const opts = [correctOpt]
        let other = teams[Math.floor(Math.random() * Math.floor(teams.length))]
        while(opts.length<4){
          if(seenOptions.indexOf(other)!==-1)
            other = teams[Math.floor(Math.random() * Math.floor(teams.length))]
          else{
            const incorrectOpt = {team: other, image: logoUrl(TEAM_TO_TEAM_ABBR[SUBREDDIT_TO_TEAM['r/'+other].toUpperCase()]), correct: false, color: '#f8d7da'}
            seenOptions.push(other)
            opts.push(incorrectOpt)
          }
        }
        opts.sort(() => Math.random() - 0.5)
        setOptions(opts)

        const newSubData = {...data[sub], index: index+1}
        setData({...data, ...newSubData})
      })
  }


  // eslint-disable-next-line
  useEffect(() => getTeamOptions(), [options]) 

  const handleSelect = el => {
    if(el.correct)
      setStatus('correct')
    else
      setStatus('incorrect')

    setTimeout(() => {
      const correct = options[0].correct ? options[0] : options[1]
      if(data[correct.team].comments.length===data[correct.team].index-1)
        fetchCommentsForSub(correct.team)
      setOptions(null)
      if(el.correct)
        setScore(score+1)
      setAttempted(attempted+1)
      setStatus('unselected')
    }, 2000)
  }

  return (
    <div>
      <Header/>
        <Container>
          <Fade delay={10000} duration={2000} style={{marginTop: '2em'}}>
            <Row style={{justifyContent: 'center', marginTop: '2em'}}>
              <h1>Guess That Flair!</h1>
            </Row>
            <Row style={{justifyContent: 'center'}}>
              <h3>Given the comment, author, and post title, can you guess the author's team?</h3>
            </Row>
            <Row style={{justifyContent: 'center'}}>
              {options ?
               <Col xs={12} style={styles.question}>
                  <Row style={{margin: '1em', justifyContent: 'center'}}>
                     <h3>
                        Comment:
                     </h3>
                  </Row>
                  <Row style={{margin: '1em', justifyContent: 'center'}}>
                     <h5>
                        <i>
                          {`"${options.filter(o => o.correct)[0].body}"`}
                        </i>
                     </h5>
                  </Row>
                  <Row style={{margin: '1em', justifyContent: 'center'}}>
                     <h4>
                        {`- /u/${options.filter(o => o.correct)[0].author}`}
                     </h4>
                  </Row>
                  <Row style={{margin: '1em', justifyContent: 'center'}}>
                     <h4>
                        Posted in: 
                        <i>
                          {`"${options.filter(o => o.correct)[0].title}"`}
                        </i>
                     </h4>
                  </Row>
                  <Row style={{justifyContent: 'center'}}>
                    {options.map((el, i) => {
                      return (
                        <Col key={i} xs={6} style={{marginTop: '20px', justifyContent: 'center'}}>
                          <div style={{backgroundColor: status!=='unselected' ? el.color : 'white', border: 'black solid 1px', cursor: 'pointer'}} onClick={() => handleSelect(el)}>
                            <Image src={el.image} roundedCircle fluid style={{height: '200px'}}/>
                          </div>
                        </Col>
                      )
                    })}
                  </Row>
                </Col>
                :
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <RingLoader size={400} loading={true}/>
                </div>
              }
            </Row>
            <Row style={{justifyContent: 'center'}}>
              {status!=='unselected' ?

                <Alert variant={status==='correct' ? 'success' : 'danger'} style={{width: '50%'}} className='text-center'>
                  <Alert.Heading>
                  {
                    status==='correct' ? 'Correct!' : 'Wrong!'
                  }
                  </Alert.Heading>
                </Alert>
                :
                <div/>
              }
            </Row>
            <Row style={{justifyContent: 'center'}}>
              <h1>
                {score}/{attempted}
              </h1>
            </Row>
          </Fade>
        </Container>
    </div>
  )
}

export default Guess
