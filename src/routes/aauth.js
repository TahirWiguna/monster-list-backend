const express = require("express")
const router = new express.Router()
const aauthController = require("../controllers/aauth.controller")

router.get("/auth", aauthController.findAll)

router.post("/auth", aauthController.create)

router.get("/auth/:id", aauthController.findById)

router.delete("/auth/:id", aauthController.delete)

router.patch("/auth/:id", aauthController.update)

router.post("/auth/login", aauthController.login)

router.post("/auth/logout", aauthController.logout)

module.exports = router
