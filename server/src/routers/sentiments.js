import { Router } from 'express'
import { getBucketContents } from '../utils/db'
const router = Router()

router.get('/', async (req, res) => {
  const key = `overall_sentiments.csv`
  try {
    const data = await getBucketContents(key)
    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ message: e })
  }
})

export default router