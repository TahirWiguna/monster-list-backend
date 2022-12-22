const db = require("../models")
const User = db.users
const Op = db.Sequelize.Op
var jwt = require("jsonwebtoken")

exports.create = (req, res) => {
  // Validate request
  if (!req.body.username) {
    res.status(400).send({
      message: "Username can not be empty!",
    })
    return
  }

  // Create a User
  const user = {
    username: req.body.username,
    password: req.body.password,
    surname: req.body.surname,
    name: req.body.name,
    root: req.body.root,
  }

  // Save User in the database
  User.create(user)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      })
    })
}

exports.findAll = (req, res) => {
  const username = req.query.username
  var condition = username ? { username: { [Op.like]: `%${username}%` } } : null

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      })
    })
}

exports.findById = (req, res) => {
  const id = req.params.id

  User.findByPk(id)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      })
    })
}

exports.findByIdAndToken = async (data) => {
  const { id, token } = data
  const user = await User.findOne({
    where: { id, tokens: { [Op.contains]: [token] } },
  })
    .then((data) => {
      if (!data) {
        return {
          status: 404,
        }
      }
      return {
        data,
        status: 200,
      }
    })
    .catch((err) => {
      return {
        message: "Error retrieving User with id = " + id,
        status: 500,
      }
    })
  return user
}

exports.update = (req, res) => {
  const id = req.params.id

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        })
      } else {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      })
    })
}

exports.delete = (req, res) => {
  const id = req.params.id

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        })
      } else {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      })
    })
}

exports.login = (req, res) => {
  const username = req.body.username
  const password = req.body.password
  var condition = username ? { username } : null

  User.findOne({
    where: condition,
  })
    .then((data) => {
      if (!data || data.password !== password) {
        res.status(400).send({
          message: "Invalid username/password.",
        })
        return
      }

      const token = jwt.sign(
        {
          data: data.id,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      )
      data.tokens.push(token)
      User.update(
        { tokens: data.tokens },
        {
          where: { id: data.id },
        }
      )

      res.send({
        token,
        userData: data,
      })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      })
    })
}

exports.logout = (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "")
  const user = User.findOne({
    where: { tokens: { [Op.contains]: [token] } },
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Invalid token.",
        })
        return
      }

      data.tokens = data.tokens.filter((t) => t !== token)
      User.update(
        { tokens: data.tokens },
        {
          where: { id: data.id },
        }
      )

      res.send({
        message: "Logout successful.",
      })
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id = " + id,
      })
    })
}

exports.logoutAll = (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "")
  const user = User.findOne({
    where: { tokens: { [Op.contains]: [token] } },
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: "Invalid token.",
        })
        return
      }

      User.update(
        { tokens: [] },
        {
          where: { id: data.id },
        }
      )

      res.send({
        message: "All device has been logouted successfully.",
      })
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id = " + id,
      })
    })
}
