const mainService = require("../services/main-service");

class MainController {
  async create(req, res, next) {
    try {
      const { fullUrl } = req.body;
      const newUrl = await mainService.create(fullUrl);
      res.status(200).json({ newUrl });
    } catch (err) {
      res.status(err.status).json({ message: err.message });
    }
  }

  async get(req, res, next) {
    try {
      const shortUrl = req.params.shortUrl;
      const fullUrl = await mainService.get(shortUrl);
      res.status(200).redirect(fullUrl);
    } catch (err) {
      res.status(err.status).json({ message: err.message });
    }
  }
}

module.exports = new MainController();
