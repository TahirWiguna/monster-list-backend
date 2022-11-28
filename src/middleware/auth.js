const jwt = require("jsonwebtoken")
const User = require("../models/aauth.model.js")
const db = require("../models")
const Op = db.Sequelize.Op
const aauthController = require("../controllers/aauth.controller")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    const user = await aauthController.findByIdAndToken({
      id: decoded.data,
      token,
    })
    if (user.status !== 200) {
      throw new Error()
    }

    req.user = user
    next()
  } catch (e) {
    res.status(401).send({ error: "Please authenticate.", e })
  }
}

module.exports = auth
