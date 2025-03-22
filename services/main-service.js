const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { nanoid } = require("nanoid");
const Redis = require("ioredis");
const redis = new Redis();
const {
  ValidationError,
  NotFoundError,
  DatabaseError,
} = require("../utils/errors");

class MainService {
  // Validate URL format
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  //Update redis DB
  async updateRedisDB(shortUrl, id, url) {
    try {
      const json_data = {
        id,
        url,
      };

      await redis.setex(shortUrl, 86400, JSON.stringify(json_data));
    } catch (err) {
      throw new DatabaseError("Failed to update Redis");
    }
  }

  //Update Postgres DB
  async updatePostgresDB(id) {
    try {
      const dbUrl = await prisma.url.findUnique({ where: { id } });

      if (!dbUrl) {
        throw new NotFoundError("URL not found");
      }

      await prisma.url.update({
        where: { id },
        data: {
          clicks: dbUrl.clicks + 1,
          last_accessed: new Date(),
        },
      });
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new DatabaseError("Failed to update Postgres");
    }
  }

  //Find in Postgres DB
  async findInPostgresDB(query, type) {
    try {
      let dbUrl;
      if (type === "url") {
        dbUrl = await prisma.url.findUnique({ where: { url: query } });
      } else if (type === "shortUrl") {
        dbUrl = await prisma.url.findFirst({ where: { shortUrl: query } });
      }

      if (dbUrl) {
        await this.updateRedisDB(dbUrl.shortUrl, dbUrl.id, dbUrl.url);
        if (type === "shortUrl") await this.updatePostgresDB(dbUrl.id);
        return type === "url" ? dbUrl.shortUrl : dbUrl.url;
      }

      return null;
    } catch (err) {
      throw new DatabaseError("Failed to query database");
    }
  }

  async findShortUrlInDB(url) {
    try {
      //find Redis DB
      const keys = await redis.keys("*");
      for (const key of keys) {
        const json_data = await redis.get(key);
        const data = JSON.parse(json_data);
        if (data.url === url) {
          return key;
        }
      }

      //Find Postgres DB
      return await this.findInPostgresDB(url, "url");
    } catch (err) {
      throw new NotFoundError("Failed to find shortUrl");
    }
  }

  async findUrlInDB(shortUrl) {
    try {
      //find Redis DB
      let url = await redis.get(shortUrl);
      if (url) {
        const data = JSON.parse(url);
        this.updatePostgresDB(data.id);
        return data.url;
      }

      //Find Postgres DB
      return await this.findInPostgresDB(shortUrl, "shortUrl");
    } catch (err) {
      throw new NotFoundError("Failed to find Url");
    }
  }

  async create(url) {
    if (!this.isValidUrl(url)) {
      throw new ValidationError("Invalid URL format");
    }

    let shortUrl = await this.findShortUrlInDB(url);

    if (shortUrl !== null) {
      return shortUrl;
    }

    shortUrl = nanoid(7);

    try {
      const newUrl = await prisma.url.create({
        data: {
          url,
          shortUrl,
        },
      });

      await this.updateRedisDB(shortUrl, newUrl.id, url);
      return shortUrl;
    } catch (err) {
      throw new DatabaseError("Failed to create URL");
    }
  }

  async get(shortUrl) {
    let url = await this.findUrlInDB(shortUrl);

    if (url === null) {
      throw new NotFoundError("URL not found");
    }

    return url;
  }
}

module.exports = new MainService();
