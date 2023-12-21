import { Router } from 'express'
import scores from './scores'
import sentences from './sentences'

export default Router()
  .use('/scores', scores)
  .use('/sentences', sentences)
  .get('/', (_req, res) => res.send('Welcome to the Threadalytics API.'))