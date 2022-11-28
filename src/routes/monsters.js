const express = require("express")
const router = new express.Router()
const monstersController = require("../controllers/monsters.controller")
const auth = require("../middleware/auth")

router.get("/monsters", auth, monstersController.findAll)

router.post("/monsters", auth, monstersController.create)

router.get("/monsters/:id", auth, monstersController.findById)

router.delete("/monsters/:id", auth, monstersController.delete)

router.patch("/monsters/:id", auth, monstersController.update)

module.exports = router
