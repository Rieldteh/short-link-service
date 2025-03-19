<!-- /* cSpell:disable */
/* spell-checker: disable */
/* spellchecker: disable */ -->
<h1 align="center">Short-Link-Service</h1>

## Technologies

The following technologies were used:

- [NodeJS](https://nodejs.org/en/)
- [ExpressJS](https://expressjs.com/)
- [Prisma](https://www.prisma.io)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Eslint](https://eslint.org)

## How to use

### Install project

```bash
# Copy repository
$ git clone https://github.com/Rieldteh/short-link-service

# Go to the created directory
$ cd short-link-service
```

### Installing dependencies

```bash
# Install dependencies
$ npm install
```

### Create dotenv file and set properties

```bash
# Set PORT property (example)
$ PORT = 5000

# Set Database property (example)
$ DATABASE_URL="postgresql://name:password@localhost:DbPort/DbName?schema=public"
```

### Launch the application

```bash
# Start in normal mode
$ npm run start

# Start in developer mode
$ npm run dev
```

## Used end-point's

The following end points are used in the application:

### shorten

| Request Method | End-point    | Meaning               |
| -------------- | ------------ | --------------------- |
| POST           | /shorten     | Creating a short link |
| GET            | /shorten/:id | Follow a short link   |

### info

| Request Method | End-point     | Meaning                                                                     |
| -------------- | ------------- | --------------------------------------------------------------------------- |
| GET            | /info/popular | Getting 50 popular clickable links (set limit query to print your quantity) |
| GET            | /info/:id     | Getting information about a link                                            |
