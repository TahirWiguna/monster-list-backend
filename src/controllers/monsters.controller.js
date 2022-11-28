const db = require("../models")
const Monster = db.monsters
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    })
    return
  }

  // Create a Monster
  const monster = {
    name: req.body.name,
    description: req.body.description,
    hp: req.body.hp,
    attack: req.body.attack,
    image: req.body.image,
  }

  // Save Monster in the database
  Monster.create(monster)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Monster.",
      })
    })
}

exports.findAll = (req, res) => {
  const name = req.query.name
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null

  Monster.findAll({ where: condition })
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving monsters.",
      })
    })
}

exports.findById = (req, res) => {
  const id = req.params.id

  Monster.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Monster with id=${id} was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Monster with id=" + id,
      })
    })
}

exports.delete = (req, res) => {
  const id = req.params.id

  Monster.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Monster was deleted successfully!",
        })
      } else {
        res.send({
          message: `Cannot delete Monster with id=${id}. Maybe Monster was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Monster with id=" + id,
      })
    })
}

exports.update = (req, res) => {
  const id = req.params.id

  Monster.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Monster was updated successfully.",
        })
      } else {
        res.send({
          message: `Cannot update Monster with id=${id}. Maybe Monster was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Monster with id=" + id,
      })
    })
}
