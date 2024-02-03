import { API } from "./constants"
import axios from 'axios'

const getWinners = async (option) => {
  try {
    const [year, month, date] = option.split('-')
    const res = await axios.get(`${API}/winners?year=${year}&month=${month}&date=${date}`)
    if(res.status === 200)
      return res.data
  } catch (e) {
    console.error(e)
    return e
  }
  
}

export {
  getWinners
}