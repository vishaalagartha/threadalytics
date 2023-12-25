import { Router } from 'express'
import { getScores } from '../controllers/scoresController';
import { getSentences } from '../controllers/sentencesController';

const router = Router()

router.get('/', async (req, res) => {
  const n = req.get('n') || 10
  try {
    let results = await getScores()
    results.sort((a, b) => a.score - b.score)
    const neg = results.slice(0, n)
    const pos = results.slice(-n).reverse()
    const response = []
    for(const n of neg) {
      const obj = { ...n, sentences: ''}
      const sentences = await getSentences(n.name)
      for(const el of sentences) {
        if (el.neg_sentences)
          obj.sentences += el.neg_sentences.split(';')
      }
      response.push(obj)
    }
    for(const p of pos) {
      const obj = { ...p, sentences: ''}
      const sentences = await getSentences(p.name)
      for(const el of sentences) 
        if (el.pos_sentences)
          obj.sentences += el.pos_sentences.split(';')
      response.push(obj)
    }
    return res.status(200).json(response)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err })
  }
})



export default router