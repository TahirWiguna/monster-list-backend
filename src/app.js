const express = require("express")
const app = express()
const port = process.env.PORT || 3001
const cors = require("cors")

var corsOptions = {
  origin: "http://localhost:8081",
}
app.use(cors(corsOptions))

const myExpress = Object.create(express().response, {
  data: {
    value: function (data) {
      return this.status(200).json({ status: true, data: data })
    },
  },
  message: {
    value: function (msg) {
      return this.status(200).json({ status: true, message: msg })
    },
  },
})

app.response = Object.create(myExpress)

const monsterRouter = require("./routes/monsters")
const aauthRouter = require("./routes/aauth")

app.use(express.json())
app.use(monsterRouter)
app.use(aauthRouter)

app.use(express.urlencoded({ extended: true }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send({ message: err.message })
})

const db = require("./models")
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Synced db.")
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message)
  })

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
