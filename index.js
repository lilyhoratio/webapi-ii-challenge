require("dotenv").config();
const server = require("./server.js");

const port = process.env.PORT || 8000; // read from Heroku PORT if exists, else default to 8000

server.listen(port, () => console.log(`\nAPI on ${port}!!!`));
