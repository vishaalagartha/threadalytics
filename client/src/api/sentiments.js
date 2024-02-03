import { API } from "./constants"
import axios from 'axios'

const getSentiments = async () => {
  try {
    const res = await axios.get(`${API}/sentiments`)
    if(res.status === 200)
      return res.data
  } catch (e) {
    console.error(e)
    return e
  }
  
}

export {
  getSentiments
}