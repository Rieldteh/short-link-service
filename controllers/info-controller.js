const infoService = require("../services/info-service");
const { AppError } = require("../utils/errors");

class InfoController {
  async getInfo(req, res, next) {
    try {
      const shortUrl = req.params.shortUrl;
      const info = await infoService.getInfo(shortUrl);
      res.status(200).json({ info });
    } catch (err) {
      if (err instanceof AppError)
        res.status(err.status).json({ err: err.message });
      else
        res.status(500).json({ message: "Internal server error" });
    }
  }

  async getPopular(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const popular = await infoService.getPopular(limit);
      res.status(200).json({ popular });
    } catch (err) {
      if (err instanceof AppError)
        res.status(err.status).json({ err: err.message });
      else
        res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new InfoController();
