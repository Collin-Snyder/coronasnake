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
  let snake1 = "";
  let snake2 = "";
  console.log("a user connected");

  socket.on("test", msg => {
    console.log(msg);
    io.emit("test response", "Well hello there client!")
  });

  setInterval(() => {
    socket.emit("snakes", { snake1, snake2 });
  }, 200);

  socket.on("new snake1", s => {
    console.log("receiving new snake1: ", s);
    snake1 = s;
    // io.emit("new snake", s);
  });

  socket.on("new snake2", s => {
    console.log("receiving new snake2: ", s);
    snake2 = s;
  });
});

http.listen(port, () => {
  console.log(`Express yayyyyy server listening on port ${port}!`);
});
