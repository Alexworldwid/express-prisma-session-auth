const folderRouter = require("express").Router();
const folderController = require("../controllers/folder.controller");
const requireAuth = require("../middleware/requireAuth");

folderRouter.post("/folders", requireAuth, folderController.createFolder);
folderRouter.get("/folders/:id", requireAuth, folderController.viewFolder);
folderRouter.post("/folders/:id/edit", requireAuth, folderController.editFolder);
folderRouter.post("/folders/:id/delete", requireAuth, folderController.deleteFolder);

module.exports = folderRouter