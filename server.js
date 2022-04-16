const path = require('path')
const express = require('express')
const serveIndex = require('serve-index')
const app = express()
const port = 3000

app.use('/', serveIndex(`${__dirname}/public`))
app.get('/test-tracked-links.html', (_, res) => {
  res.sendFile(`${__dirname}/public/test-tracked-links.html`)
})

app.listen(port, () => {
  console.log(`Server started (port: ${port}).`)
})