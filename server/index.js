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

app.get("/games/:gameId", (req, res) => {
  console.log(req.params.gameId);
  res.send(Games.getGame(req.params.gameId));
})

app
  .route("/games")
  .get((req, res) => {
    res.send(Games.getAllOpenGames());
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

  socket.on("player joining", id => {
    gameId = id;
    player = 2;
    socket.join(gameId);
    Games.updateGame(id, {status: "pending"})
    io.to(gameId).emit("player 2 joining confirmation", gameId);
  })

  socket.on("player ready", info => {
    console.log("Inside player ready handler: ", gameId);
    if (player === 2) info.status = "starting";
    Games.updateGame(gameId, info);
    io.to(gameId).emit(`player ${player} confirmation`, Games.getGame(gameId));
  });

  socket.on("game starting", id => {
    console.log("now starting game ", id);
    setTimeout(() => {
      io.to(gameId).emit("starting countdown");
    }, 3000);
    setTimeout(() => {
      io.to(gameId).emit("countdown", 2);
    }, 4000);
    setTimeout(() => {
      io.to(gameId).emit("countdown", 1);
    }, 5000);
    setTimeout(() => {
      io.to(gameId).emit("countdown", "Go!");
    }, 6000);
    setTimeout(() => {
      io.to(gameId).emit("start");
    }, 7000);
  })

  // let snake1 = "";
  // let snake2 = "";

  // socket.on("test", msg => {
  //   console.log(msg);
  //   io.emit("test response", "Well hello there client!");
  // });

  // setInterval(() => {
  //   socket.emit("snakes", { snake1, snake2 });
  // }, 200);
  socket.on("disconnect", () => {
    console.log("user disconnecting");
    io.to(gameId).emit("game ended");
    Games.deleteGame(gameId);
    gameId = null;
    player = 0;
  });
});

http.listen(port, () => {
  console.log(`Express yayyyyy server listening on port ${port}!`);
});
