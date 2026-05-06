const homeRouter = require("express").Router();
const homeController = require("../controllers/home.controller")
const requireAuth = require("../middleware/requireAuth")

homeRouter.get("/", requireAuth, homeController.homepage);



module.exports = homeRouter