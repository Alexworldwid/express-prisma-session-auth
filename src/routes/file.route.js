const fileRouter = require("express").Router();
const fileController = require("../controllers/file.controller");
const shareController = require("../controllers/share.controller");
const requireAuth = require("../middleware/requireAuth");
const upload = require("../config/multer");

fileRouter.post("/upload", requireAuth, upload.single("file"), fileController.uploadFile);
fileRouter.get("/files", requireAuth, fileController.getFiles);
fileRouter.get("/share/:token", shareController.viewFolder);
fileRouter.get("/files/:id", requireAuth, fileController.getFileDetails);
fileRouter.post("/files/:id/delete", requireAuth, fileController.deleteFile);
fileRouter.get("/files/:id/download", fileController.downloadFile);
fileRouter.post("/folders/:id/share", requireAuth, shareController.createShareLink);

module.exports = fileRouter;