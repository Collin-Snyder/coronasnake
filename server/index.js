const express = require("express");

const path = require("path");
const cors = require("cors");
const { Gameboard } = require("./scripts/gameboardMaker");
const { Snake } = require("./scripts/snake");
const { checkNextMove, newFood, Queue } = require("./scripts/movement");
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
  
  let snake1 = "";
  let snake2 = "";
  console.log("a user connected");

  socket.on("test", msg => {
    console.log(msg);
    io.emit("test response", "Well hello there client!");
  });

  setInterval(() => {
    socket.emit("snakes", { snake1, snake2 });
  }, 200);
});

http.listen(port, () => {
  console.log(`Express yayyyyy server listening on port ${port}!`);
});
