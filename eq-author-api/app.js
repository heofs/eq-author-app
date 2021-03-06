require("dotenv").config();

const logger = require("pino")();

const { createApp } = require("./server");

const { PORT = 4000 } = process.env;
const server = createApp();

server.listen(PORT, "0.0.0.0", () => {
  logger.child({ port: PORT }).info("Listening on port");
});
