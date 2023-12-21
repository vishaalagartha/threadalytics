import { Router } from 'express'
import { getSentences } from '../controllers/sentencesController'

const router = Router()

router.get('/', async (req, res) => {
  const name = req.get('name') || 'Stephen Curry'
  const type = req.get('type') || 'positive'
  try {
    let results = await getSentences(name, type)
    console.log(results)
    return res.status(200).json(results)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err })
  }
})

export default router