const express = require("express");

const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 4000;

const app = express();

app.use(express.static(path.join(__dirname + "/../client/dist/")));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(path.join(__dirname + "/../dist/index.html"));
});

var http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", socket => {
  console.log("a user connected");
  socket.on("test", msg => {
    console.log(msg);
    io.emit("test response", "Well hello there client!")
  });
});

http.listen(port, () => {
  console.log(`Express yayyyyy server listening on port ${port}!`);
});
