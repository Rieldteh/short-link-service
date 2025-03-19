const infoRouter = require("express").Router();
const infoController = require("../controllers/info-controller");

infoRouter.get("/popular", infoController.getPopular);
infoRouter.get("/:shortUrl", infoController.getInfo);

module.exports = infoRouter;
