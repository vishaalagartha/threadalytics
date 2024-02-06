import { useEffect, useState } from 'react'
import { getScores } from '../api/scores'
import Header from '../components/Header'
import { Column } from '@ant-design/charts'
import { message } from 'antd'
import Form from 'react-bootstrap/Form'
import { Row, Col, Image } from 'react-bootstrap'
import { PLAYER_TO_TEAM, TEAM_TO_TEAM_HEX_COLOR, PLAYER_TO_ID} from '../helpers/constants'


const Home = () => {
  const date = new Date()
  const dates = []
  const [messageApi, contextHolder] = message.useMessage()
  while (true) {
    if (date.getMinutes() < 5) {
      date.setHours(date.getHours() - 1)
      date.setMinutes(date.getMinutes() + 5)
      continue
    }
    let month = date.getUTCMonth() + 1
    let d = date.getUTCDate()
    let h = date.getUTCHours()
    if(month < 10) month = '0' + month
    if (d < 10) d = '0' + d
    if (h < 10) h = '0' + h
    const utcDateStr = `${date.getUTCFullYear()}-${month}-${d}-${h}`
    const timeStr = date.toLocaleTimeString().split(':')[0] + ' ' + date.toLocaleTimeString().slice(-2)
    const localDateStr = timeStr + ' ' + date.toLocaleDateString()
    date.setHours(date.getHours() - 1)
    dates.push({ utcDateStr, localDateStr })
    if (utcDateStr === '2024-01-19-05') break
  }
  const [option, setOption] = useState(dates[0].utcDateStr)
  const [scores, setScores] = useState([])
  const [sentences, setSentences] = useState({})
  const [width, setWidth] = useState(window.innerWidth)
  const isMobile = width <= 768

const handleWindowSizeChange = () => setWidth(window.innerWidth)

useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
}, [])

  useEffect(() => {
    const fetchScores = async () => {
      const scores = await getScores(option)
      if (scores && !(scores instanceof Error)) {
        const sentencesObj = {}
        const data = scores.map((s) => {
          const { name, score, sentences } = s
          const team = PLAYER_TO_TEAM[name] ? PLAYER_TO_TEAM[name]['team'] : name
          if(!team) return 'white'
          const color = TEAM_TO_TEAM_HEX_COLOR[team]
          sentencesObj[name] = sentences.split('\n')
          return { name, score: parseInt(score * 100) / 100, color, sentences }

        })
        setSentences(sentencesObj)
        setScores(data)
        if (!data.length) {
          messageApi.info('No data for selected date!')
        }
      } else {
        messageApi.info('No data for selected date!')
      }
    }
    fetchScores()
  }, [option, messageApi])

  const config = {
    interaction: {
      tooltip: {
        disableNative: false,
        render: (e, item) => {
          const { title } = item
          let src
          if(PLAYER_TO_ID[title]) {
            const id = PLAYER_TO_ID[title]
            src = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${id}.png`
          } else {
            const teamStr = title.toLowerCase().replaceAll(' ', '_')
            src = `http://cdn.bleacherreport.net/images/team_logos/164x164/${teamStr}.png`
          }
          const styles = isMobile ? { maxWidth: 200 } : {}
          return (
            <div style={styles}>
              <Row className="justify-content-center">
                <Image src={src} className="w-50" />
              </Row>
              <Row className="nba-text">
                {sentences[title].map(s => <><span>{s}</span><br/></>)}
              </Row>
            </div>
          )
        },
      }
    },
    data: scores,
    xField: 'name',
    yField: 'score',
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    style: {
      fill: ({ color }) => color
    },
  }

  const handleChange = (e) => {
    setOption(e.target.value)
  }
  return (
    <div>
      <Header />
      {contextHolder}
      <Row className="justify-content-center text-center my-3">
        <h1>
          r/nba Sentiments
        </h1>
      </Row>
      <Row className='my-3 justify-content-center'>
        <Col xs={4} md={2}>
          <Form.Select onChange={handleChange} value={option}>
            {dates.map((o, i) => <option value={o.utcDateStr} key={i}>{o.localDateStr}</option>)}
          </Form.Select>
        </Col>
      </Row>
      <Column {...config} />
    </div>
  )
}

export default Home