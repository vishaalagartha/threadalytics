import { Router } from 'express'
import { getScores } from '../controllers/scoresController';

const router = Router()

router.get('/', async (req, res) => {
  const n = req.get('n') || 10
  try {
    let results = await getScores()
    results.sort((a, b) => a.score - b.score)
    const neg = results.slice(0, n)
    const pos = results.slice(-n).reverse()
    return res.status(200).json({ neg, pos })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err })
  }
})



export default router