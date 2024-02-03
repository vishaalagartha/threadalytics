import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { message } from 'antd'
import { Row, Col } from 'react-bootstrap'
import { getSentiments } from '../api/sentiments'
import { Line, Pie } from '@ant-design/charts'


const Players = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [width, setWidth] = useState(window.innerWidth)
  const isMobile = width <= 768
  const [sentiments, setSentiments] = useState([])
  const [pieData, setPieData] = useState([])

const handleWindowSizeChange = () => setWidth(window.innerWidth)

useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
}, [])

  useEffect(() => {
    const fetchSentiments = async () => {
      const sentiments = await getSentiments()
      if (sentiments && !(sentiments instanceof Error)) {
        const data = sentiments.map((el) => {
          const [yyyy, mm, dd, hh] = el.time.split(/[^\d]+/)
          const date = new Date(`${mm}/${dd}/${yyyy} ${hh}:00:00 UTC`)
          return {
            date: new Date(date.toLocaleString()),
            pos: +el.pos,
            neg: +el.neg,
            score: +el.score
          }
        }).sort((a, b) => a.date - b.date)
        console.log(data)
        const { pos, neg } = data[data.length - 1]
        const pieData = [{ sentiment: 'positive', 'Title Count': pos }, { sentiment: 'negative', 'Title Count': neg }]
        setPieData(pieData)
        setSentiments(data)
      } else {
        messageApi.info('No data for selected date!')
      }
    }
    fetchSentiments()
  }, [messageApi])

  const lineConfig = {
    data: sentiments,
    xField: 'date',
    yField: 'score',
    point: {
      shapeField: 'square',
      sizeField: 4,
    },
    style: {
      lineWidth: 2,
    },
  }

  const pieConfig = {
    data: pieData,
    angleField: 'Title Count',
    colorField: 'sentiment',
    legend: false,
    label: {
      text: (d) => d.sentiment === 'positive' ? `Positive Title Count: ${d['Title Count']}`: `Negative Title Count: ${d['Title Count']}`,
      style: {
        fontWeight: 'bold',
      },
    },
    interaction: {
      tooltip: false
    },
    style: {
      padding: 10,
      fill: ({ sentiment }) => sentiment === 'positive' ? '#52c41a' : '#f5222d'
    },

  }
  return (
    <div>
      <Header />
      {contextHolder}
      <Row className="justify-content-center text-center my-3">
        <Row className="m-5">
          <h1>
            r/nba Sentiments
          </h1>
        </Row>
        <Col xs={10} md={4}>
          <h3>Positive:Negative Title Ratio</h3>
          <Pie {...pieConfig} />
        </Col>
        <Col xs={10} md={6}>
          <h2>Sentiments over time</h2>
          <Line {...lineConfig} />
        </Col>
      </Row>
    </div>
  )
}

export default Players