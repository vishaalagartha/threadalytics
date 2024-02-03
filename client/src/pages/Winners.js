import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { message } from 'antd'
import Form from 'react-bootstrap/Form'
import { Row, Col, Image } from 'react-bootstrap'
import { getWinners } from '../api/winners'
import { PLAYER_TO_ID} from '../helpers/constants'


const Winners = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  const dates = []
  const [messageApi, contextHolder] = message.useMessage()
  while (true) {
    let month = date.getUTCMonth() + 1
    let d = date.getUTCDate()
    if(month < 10) month = '0' + month
    if (d < 10) d = '0' + d
    const utcDateStr = `${date.getUTCFullYear()}-${month}-${d}`
    const localDateStr = date.toLocaleDateString()
    date.setDate(date.getDate() - 1)
    dates.push({ utcDateStr, localDateStr })
    if (utcDateStr === '2024-02-01') break
  }
  const [option, setOption] = useState(dates[0].utcDateStr)
  const [width, setWidth] = useState(window.innerWidth)
  const [player, setPlayer] = useState('')
  const [team, setTeam] = useState('')
  const isMobile = width <= 768

const handleWindowSizeChange = () => setWidth(window.innerWidth)

useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
    }
}, [])

  useEffect(() => {
    const fetchWinners = async () => {
      const winners = await getWinners(option)
      if (winners && !(winners instanceof Error)) {
        console.log(winners)
        setPlayer(winners.player)
        setTeam(winners.team)
      } else {
        messageApi.info('No data for selected date!')
      }
    }
    fetchWinners()
  }, [option, messageApi])

  const handleChange = (e) => {
    setOption(e.target.value)
  }
  const playerUrl = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${PLAYER_TO_ID[player]}.png`
  const teamUrl = `http://cdn.bleacherreport.net/images/team_logos/164x164/${team.toLowerCase().replaceAll(' ', '_')}.png`
  return (
    <div>
      <Header />
      {contextHolder}
      <Row className="justify-content-center text-center my-3">
        <h1 className="flex justify-content-center w-50 align-middle">
          Winners for  
          <div className="mt-2 ml-3">
            <Form.Select onChange={handleChange} value={option}>
              {dates.map((o, i) => <option value={o.utcDateStr} key={i}>{o.localDateStr}</option>)}
            </Form.Select>
          </div>
        </h1>
      </Row>
      <Row className="my-3">
        <Col xs={6} className="flex justify-content-center">
          {player && <Image src={playerUrl}/> }
        </Col>
        <Col xs={6} className="flex justify-content-center">
          {team && <Image src={teamUrl} /> }
        </Col>
      </Row>
      <Row>
        <Col xs={6} className="flex justify-content-center">
            {player && <h3>{player} was a hot topic</h3> }
        </Col>
        <Col xs={6} className="flex justify-content-center">
          {team && <h3>The {team} were the talk of the sub</h3> }
        </Col>
      </Row>
      <Row className="text-center mt-5">
        <p>*Winner determined by number of mentions in top posts from the day*</p>
      </Row>
    </div>
  )
}

export default Winners