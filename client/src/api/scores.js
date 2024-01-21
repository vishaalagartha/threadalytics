import { API } from "./constants"
import axios from 'axios'

const getScores = async (option) => {
  try {
    const [year, month, date, hour] = option.split('-')
    const res = await axios.get(`${API}/scores?year=${year}&month=${month}&date=${date}&hour=${hour}`)
    if(res.status === 200)
      return res.data
  } catch (e) {
    console.error(e)
  }
  
}

export {
  getScores
}