import express from 'express'
import cors from 'cors'
import routers from './routers'

const PORT = parseInt(process.env.PORT || '3001')

const app = express()
  .use(express.json())
  .use('/api', routers)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})