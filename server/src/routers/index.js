import { Router } from 'express'
import scores from './scores'
import sentiments from './sentiments'
import comments from './comments'
import winners from './winners'

export default Router()
  .use('/scores', scores)
  .use('/sentiments', sentiments)
  .use('/winners', winners)
  .use('/comments', comments)
  .get('/', (_req, res) => res.send('Welcome to the Threadalytics API.'))