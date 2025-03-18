const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { nanoid } = require("nanoid");
const Redis = require("ioredis");
const redis = new Redis();

class MainService {
  //Up redis DB
  async upRedis(shortUrl, url, created_at) {
    const json_url = {
      url,
      created_at,
    };
    await redis.setex(shortUrl, 86400, JSON.stringify(json_url));
  }

  //Find in Postgres DB
  async findInPostgresDB(query, type) {
    let dbUrl;

    if (type === "url") {
      dbUrl = await prisma.url.findUnique({ where: { url: query } });
    } else if (type === "shortUrl") {
      dbUrl = await prisma.url.findFirst({ where: { shortUrl: query } });
    }

    if (dbUrl) {
      await this.upRedis(dbUrl.shortUrl, dbUrl.url, dbUrl.created_at);
      return type === "url" ? dbUrl.shortUrl : dbUrl.url;
    }

    return null;
  }

  async findShortUrlInDB(url) {
    //find Redis DB
    const keys = await redis.keys("*");
    for (key of keys) {
      const json_data = await redis.get(key);
      const data = JSON.parse(json_data);
      if (data.url === url) {
        return key;
      }
    }

    //Find Postgres DB
    const shortUrl = await this.findInPostgresDB(url, "url");
    return shortUrl ? shortUrl : null;
  }

  async findUrlInDB(shortUrl) {
    //find Redis DB
    const rUrl = await redis.get(shortUrl);
    if (rUrl) {
      const data = JSON.parse(rUrl);
      return data.url;
    }

    //Find Postgres DB
    const url = await this.findInPostgresDB(shortUrl, "shortUrl");
    return url ? url : null;
  }

  async create(url) {
    let shortUrl = await this.findShortUrlInDB(url);

    if (shortUrl !== null) {
      return `localhost:5000/shorten/${shortUrl}`;
    }

    shortUrl = nanoid(7);

    await this.upRedis(shortUrl, url, Date.now());

    await prisma.url.create({
      data: {
        url,
        shortUrl,
      },
    });

    return `localhost:5000/shorten/${shortUrl}`;
  }

  async get(shortUrl) {
    let url = await this.findUrlInDB(shortUrl);

    if (url === null) {
      throw new Error("Url not found");
    }

    return url;
  }
}

module.exports = new MainService();
