import { useEffect, useRef, useState } from 'react'
import { getScores } from '../api/scores'
import drawBarChart from '../components/drawBarChart'

const tipStyle = {
  position: 'absolute',
  fontSize: 8,
  textAlign: 'left',
  maxWidth: 200,
  maxHeight: 200,
}

const Home = () => {
  const ref = useRef()
  const [scores, setScores] = useState([])

  useEffect(() => {
    const fetchScores = async () => {
      const scores = await getScores()
      setScores(scores)
    }
    fetchScores()
  }, [])

  useEffect(() => {
    if (ref && scores.length) drawBarChart(scores, ref.current)
  }, [ref, scores])

  return (
    <div style={{textAlign: 'center'}}>
      <h1>
        r/nba Current Sentiments
      </h1>
      <div ref={ref} style={{ width: '100vw', height: '100vh' }}>
          <div id='tooltip' style={tipStyle}>
          </div>
      </div>
    </div>
  )
}

export default Home