const mainRouter = require("express").Router();
const mainController = require("../controllers/main-controller");

mainRouter.post("/", mainController.create);
mainRouter.get("/:shortUrl", mainController.get);

module.exports = mainRouter;
