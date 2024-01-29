import { Router } from 'express'
import { getScores } from '../controllers/scoresController'
import { getSentences } from '../controllers/sentencesController'
import AWS from 'aws-sdk'
import * as csv from '@fast-csv/parse'
const router = Router()

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
})
/*
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
*/
router.get('/', async (req, res) => {
  const { year, month, date, hour } = req.query
  try {
    const Key = `${year}-${month}-${date}-${hour}.csv`
    const params = { Bucket: 'threadalytics-data', Key }
    const csvFile = s3.getObject(params).createReadStream()
    .on('error', (e) => {
      res.status(500).json({ message: e })
      return
    })
    let data = []
    const parser = csv.parseStream(csvFile, { headers: true })
      .on('data', (d) => {
        data.push(d)
      })
      .on('end', () => {
        res.status(200).json(data)
      })
      .on('error', (error) => {
        console.log('error')
        res.status(500).json({ message: error })
      })    
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err })
  }
})

export default router