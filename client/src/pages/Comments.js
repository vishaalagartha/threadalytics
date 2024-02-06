import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { message } from 'antd'
import Form from 'react-bootstrap/Form'
import { Row, Col, Table } from 'react-bootstrap'
import { getComments } from '../api/comments'


const Comments = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  const dates = []
  const [messageApi, contextHolder] = message.useMessage()
  const [comments, setComments] = useState([])
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

  useEffect(() => {
    const fetchComments = async () => {
      const comments = await getComments(option)
      if (comments && !(comments instanceof Error)) {
        const newComments = Array(5).fill()
        const d = ['score', 'author', 'body', 'link']
        for(let i = 1; i < 6; i++) {
          const obj = {}
          for (const el of d) {
            const k = el + i
            obj[el] = comments[k]
          }
          newComments[i - 1] = obj
        }
        setComments(newComments)
      } else {
        messageApi.info('No data for selected date!')
      }
    }
    fetchComments()
  }, [option, messageApi])

  const handleChange = (e) => {
    setOption(e.target.value)
  }
  console.log(comments)
  return (
    <div>
      <Header />
      {contextHolder}
      <Row className="justify-content-center text-center my-3">
        <h1>
          Top Comments
        </h1>
      </Row>
      <Row className='my-3 justify-content-center'>
        <Col xs={4} md={2}>
          <Form.Select onChange={handleChange} value={option}>
            {dates.map((o, i) => <option value={o.utcDateStr} key={i}>{o.localDateStr}</option>)}
          </Form.Select>
        </Col>
      </Row>
      <Row className='my-3 justify-content-center'>
        <Col xs={10}>
          <Table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Score</th>
                <th>Comment</th>
                <th>Author</th>
                <th>Link</th>
              </tr>
            </thead>
            {comments.map((c, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{c.score}</td>
                  <td><a href={`https://www.reddit.com${c.link}`} style={{ lineHeight: 30 }}>{c.body}</a></td>
                  <td>{c.author}</td>
                </tr>
              )
            })}
          </Table>
        </Col>
      </Row>
    </div>
  )
}

export default Comments