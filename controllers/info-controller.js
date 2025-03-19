const infoService = require("../services/info-service");

class InfoController {
  async getInfo(req, res, next) {
    try {
      const shortUrl = req.params.shortUrl;
      const info = await infoService.getInfo(shortUrl);
      res.status(200).json({ info });
    } catch (err) {
      res.status(err.status).json({ err: err.message });
    }
  }

  async getPopular(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const popular = await infoService.getPopular(limit);
      res.status(200).json({ popular });
    } catch (err) {
      res.status(err.status).json({ err: err.message });
    }
  }
}

module.exports = new InfoController();
