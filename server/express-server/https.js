const https = require("https");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();


app.use("/static", express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.send("Hello HTTPS");
});


const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

https.createServer(options, app).listen(443, () => {
  console.log("HTTPS server running on port 443");
});



// npm install express
// openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365 -subj "/CN=abc.com"
// sudo node https.js


