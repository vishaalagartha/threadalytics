import { API } from "./constants"
import axios from 'axios'

const getScores = async (n) => {
  try {
    const res = await axios.get(`${API}/scores`, { n: 10 })
    if(res.status === 200)
      return res.data
  } catch (e) {
    console.error(e)
  }
  
}

export {
  getScores
}