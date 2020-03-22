const express = require("express");

const path = require("path");
const cors = require("cors");

const { Gameboard } = require("./scripts/gameboardMaker");
const { Snake } = require("./scripts/snake");
const { checkNextMove, newFood, Queue } = require("./scripts/movement");
const Games = require("./scripts/activeGames");
const port = process.env.PORT || 4000;

const app = express();

app.use(express.static(path.join(__dirname + "/../client/dist/")));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(path.join(__dirname + "/../dist/index.html"));
});

app
  .route("/games")
  .get((req, res) => {
    res.send(Games.getAllGames());
  })
  .post((req, res) => {
    let gameId = Games.addGame(req.body);
    res.send(gameId);
  })
  .put((req, res) => {
    Games.updateGame(req.body.id, req.body.info);
    res.end("Game updated!");
  })
  .delete((req, res) => {
    Games.deleteGame(req.body.id);
    res.end("Game deleted!");
  });

var http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", socket => {
  console.log("a user connected");
  let gameId = null;
  let player = 0;

  socket.on("new game", id => {
    gameId = id;
    player = 1;
    socket.join(gameId);
    io.to(gameId).emit("new game confirmation", gameId);
  });

  socket.on("new game ready", info => {
    Games.updateGame(gameId, info);
    if ((player = 1))
      io.to(gameId).emit("player 1 confirmation", Games.getGame(gameId));
    else if (player = 2) io.to(gameId).emit("player 2 confirmation", Games.getGame(gameId));
  });

  // let snake1 = "";
  // let snake2 = "";

  // socket.on("test", msg => {
  //   console.log(msg);
  //   io.emit("test response", "Well hello there client!");
  // });

  // setInterval(() => {
  //   socket.emit("snakes", { snake1, snake2 });
  // }, 200);
});

http.listen(port, () => {
  console.log(`Express yayyyyy server listening on port ${port}!`);
});
