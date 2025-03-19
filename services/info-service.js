const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { NotFoundError, DatabaseError } = require("../utils/errors");

class InfoService {
  async getUrlStats(shortUrl) {
    const data = await prisma.url.findFirst({ where: { shortUrl } });

    if (!data) {
      throw new NotFoundError("URL not found");
    }

    return data;
  }

  async getInfo(shortUrl) {
    return await this.getUrlStats(shortUrl);
  }

  async getPopular(limit = 10) {
    try {
      return await prisma.url.findMany({
        orderBy: { clicks: "desc" },
        take: limit,
      });
    } catch (err) {
      throw new DatabaseError("Failed to query database");
    }
  }
}

module.exports = new InfoService();
