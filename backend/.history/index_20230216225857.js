const connectToMongo = require("./db");
const express = require('express')
connectToMongo();

const app = express()
const port = 3000

//Available Routes
// app.use("/api/auth",require("./route/note"))
app.use("/api/note",require("./route/auth"))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/v1/login', (req, res) => {
  res.send('Hello World! sde')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})