const mainService = require("../services/main-service");
const { AppError } = require("../utils/errors");

class MainController {
  async create(req, res, next) {
    try {
      const { fullUrl } = req.body;
      const newUrl = await mainService.create(fullUrl);
      res.status(200).json({ newUrl });
    } catch (err) {
      if (err instanceof AppError)
        res.status(err.status).json({ message: err.message });
      else
        res.status(500).json({ message: "Internal server error" });
    }
  }

  async get(req, res, next) {
    try {
      const shortUrl = req.params.shortUrl;
      const fullUrl = await mainService.get(shortUrl);
      res.status(200).redirect(fullUrl);
    } catch (err) {
      if (err instanceof AppError)
        res.status(err.status).json({ message: err.message });
      else
        res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new MainController();
