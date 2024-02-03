import { Router } from 'express'
import { getBucketContents } from '../utils/db'
const router = Router()

router.get('/', async (req, res) => {
  const { year, month, date } = req.query
  const key = `winners_of_day.csv`
  try {
    const data = await getBucketContents(key)
    const winnerData = data.find(d => d.date === `${year}-${month}-${date}`)
    res.status(200).json(winnerData)
  } catch (e) {
    res.status(500).json({ message: e })
  }
})

export default router