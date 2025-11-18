// Minimal server test
import express from 'express'
import cors from 'cors'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Test server is working!',
    timestamp: new Date().toISOString()
  })
})

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

app.listen(port, () => {
  console.log(`✅ Test server running on http://localhost:${port}`)
})

