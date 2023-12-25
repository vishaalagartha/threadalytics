import { Router } from 'express'
import { getSentences } from '../controllers/sentencesController'

const router = Router()

router.get('/', async (req, res) => {
  const name = req.get('name') || 'Stephen Curry'
  const type = req.get('type') || 'positive'
  try {
    const results = await getSentences(name, type)
    const response = []
    for(const result of results) {
      const sentences = type === 'positive' ? result.pos_sentences.split(';') : result.neg_sentences.split(';')
      response.push(...sentences)
    }
    return res.status(200).json(response)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err })
  }
})

export default router