import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import routers from './routers'

const PORT = parseInt(process.env.PORT || '8080')

const app = express()
  .use(cors())
  .use(express.json())
  .use('/', routers)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})