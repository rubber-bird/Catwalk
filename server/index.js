const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/../client/dist'))

app.listen(port, () => {
  console.log(`Catwalk app listening at http://localhost:${port}`)
})