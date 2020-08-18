import React, { useEffect, useState } from 'react'
import Fade from 'react-reveal'
import { Container, Col, Row, Image, Alert } from 'react-bootstrap'
import Header from 'Components/Header'
import { RingLoader } from 'react-spinners'
import { TEAM_TO_TEAM_ABBR, TEAM_ABBR_TO_TEAM, stopwords, logoUrl } from 'helpers/constants'
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
  const [data, setData] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [attempted, setAttempted] = useState(0)
  const [before, setBefore] = useState(parseInt(new Date().getTime()/1000))

  const [status, setStatus] = useState('unselected')

  const [options, setOptions] = useState([])

  const filterData = c => {
    if(!c.fixedFlair) return false
    for(const p in players){
      const l = players[p].split(' ')
      for(const w in l){
        const name = l[w].replace(/[^0-9a-z]/gi, '').toLowerCase()
        if(c.body.toLowerCase().includes(' '+name+' ') && stopwords.indexOf(name)===-1){
          return true
        }
      }
    }
    return false
  }


  const fetchComments = () => {
    const url = `https://api.pushshift.io/reddit/search/comment/?subreddit=nba&size=500&score=<-10&before=${before}`
    fetch(url)
        .then(res => res.json())
        .then(res => {
          if(!res.data) return
          setBefore(res.data[0].created_utc)
          const filteredData = res.data.filter(c => c.author_flair_text!==null)
          const teams = Object.values(TEAM_ABBR_TO_TEAM)
          const teamSuffixes = teams.map(t => {
            const l = t.split(' ')
            return l[l.length-1].toLowerCase()
          })
          filteredData.forEach(c => {
            for(const i in teamSuffixes)
              if(c.author_flair_text.toLowerCase().includes(teamSuffixes[i])){
                c.fixedFlair = teams[i] 
                break
              }
          })
          const linkId = []
          console.log(filteredData)
          const data = filteredData.filter(filterData).map(d => {
            const abbr = TEAM_TO_TEAM_ABBR[d.fixedFlair.toUpperCase()]
            linkId.push(d.link_id.substr(3))
            return {body: d.body, flair: d.fixedFlair, image: logoUrl(abbr), author: d.author}
          })
          const linkIdStr = linkId.join(',')
          const url = `https://api.pushshift.io/reddit/search/submission/?subreddit=nba&ids=${linkIdStr}`
          fetch(url)
              .then(res => res.json())
              .then(res => {
                if(!res.data) return
                const titleData = res.data
                for(const i in linkId)
                  for(const j in titleData){
                    if(titleData[j].id===linkId[i]){
                      data[i].title = titleData[j].title
                      break
                    }
                  }
                setData(data)
              })
        })
  }

  const getOptions = () => {
    if(data.length===0) return
    const indices = [index]
    const options = [data[index].flair]
    while(options.length<4){
      const i = Math.floor(Math.random() * Math.floor(data.length))
      if(options.indexOf(data[i].flair)===-1){
        options.push(data[i].flair)
        indices.push(i)
      }
    }
    indices.sort(() => Math.random() - 0.5)
    const shuffledOptions = indices.map(i => {
      if(data[i].flair===data[index].flair)
        return {...data[i], color: '#d4edda'}
      else
        return {...data[i], color: '#f8d7da'}
    })
    setOptions(shuffledOptions)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchComments(), []) 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getOptions(), [data, index]) 

  const handleSelect = el => {
    if(el.flair===data[index].flair)
      setStatus('correct')
    else
      setStatus('incorrect')

    setTimeout(() => {
      if(el.flair===data[index].flair)
        setScore(score+1)
      setStatus('unselected')
      if(index===data.length-1){
        setData([])
        setAttempted(attempted+1)
        setIndex(0)
      }
      else{
        setAttempted(attempted+1)
        setIndex(index+1)
      }
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
              {data.length>0
                ?
                 <Col xs={12} style={styles.question}>
                  <Row style={{margin: '1em', justifyContent: 'center'}}>
                     <h3>
                        Comment:
                     </h3>
                  </Row>
                  <Row style={{margin: '1em', justifyContent: 'center'}}>
                     <h5>
                        <i>{`"${data[index].body}"`}</i>
                     </h5>
                  </Row>
                  <Row style={{margin: '1em', justifyContent: 'center'}}>
                     <h4>
                        - /u/{data[index].author}
                     </h4>
                  </Row>
                  <Row style={{margin: '1em', justifyContent: 'center'}}>
                     <h4>
                        Posted in: <i>{`"${data[index].title}"`}</i>
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
                      
                   )})}
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
