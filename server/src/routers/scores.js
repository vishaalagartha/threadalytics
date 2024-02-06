import { Router } from 'express'
import { getBucketContents } from '../utils/db'
const router = Router()

router.get('/', async (req, res) => {
  const { year, month, date, hour } = req.query
  console.log(year, month, date, hour)
  const key = `${year}-${month}-${date}-${hour}.csv`
  try {
    const data = await getBucketContents(key)
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ message: e })
  }
})

export default router