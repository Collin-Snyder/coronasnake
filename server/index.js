const express = require("express");

const path = require("path");
const cors = require("cors");

const { Gameboard } = require("./scripts/gameboardMaker");
const { Snake } = require("./scripts/snakeConstructor");
const { checkNextMove, newFood, moveSnake } = require("./scripts/movement");
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
  res.send(Games.getGame(req.params.gameId).gameSummary());
});

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
  let interval;
  let gameId = null;
  let player = 0;
  // let game;
  // let board;
  // let snake1;
  // let snake2;
  // let queues = { 1: ["up"], 2: ["down"] };

  let intervalCB = () => {
    // console.log("interval running")
    //pull from each direction queue and move snake
    let game = Games.getGame(gameId);

    //refactor move into one move to accommodate draws
    let move1 = game.moveSnake(1);
    let move2 = game.moveSnake(2);

    if (!move1 || !move2) {
      clearInterval(interval);
      //if game over, emit game over event along with winner/loser
      io.to(gameId).emit("game over", {
        winner: !move1 ? 2 : 1,
        loser: !move1 ? 1 : 2
      });
    } else {
      let gameState = game.gameSummary();
      io.to(gameId).emit("interval", gameState);
    }
  };

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
    Games.getGame(id).update({ status: "pending" });
    io.to(gameId).emit("player 2 joining confirmation", gameId);
  });

  socket.on("player ready", info => {
    if (player === 2) info.status = "starting";
    Games.getGame(gameId).update(info);
    io.to(gameId).emit(`player ${player} confirmation`);
  });

  socket.on("game starting", id => {
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
  });

  socket.on("begin movement", () => {
    if (!interval && player === 1) {
      interval = setInterval(intervalCB, 100);
    }
  });

  socket.on("keypress", direction => {
    console.log("inside keypress handler: ", direction);
    Games.getGame(gameId).keypress(player, direction);
    // queues[player].push(direction);
    // clearInterval(interval);
    // interval = setInterval(() => {
    //   // console.log("interval running")
    //   //pull from each direction queue and move snake
    //   let move1 = moveSnake(queues[1], board, snake1, game.food1);
    //   let move2 = moveSnake(queues[2], board, snake2, game.food2);

    //   if (!move1 || !move2) {
    //     clearInterval(interval);
    //     //if game over, emit game over event along with winner/loser
    //     io.to(gameId).emit("game over", {
    //       winner: !move1 ? 2 : 1,
    //       loser: !move1 ? 1 : 2
    //     });
    //   } else if (move1 && move2) {
    //     game.head1 = snake1.head.id;
    //     game.head2 = snake2.head.id;
    //     game.tail1 = snake1.tail.id;
    //     game.tail2 = snake2.tail.id;
    //     game.length1 = snake1.size;
    //     game.length2 = snake2.size;

    //     [move1, move2].forEach((m, i) => {
    //       if (m === "eat")
    //         game[`food${i + 1}`] = newFood(
    //           board,
    //           game[`food${i === 0 ? 2 : 1}`]
    //         );
    //     });
    //     io.to(gameId).emit("interval", game);
    //   }
    // }, 1000);
    // console.log(`new player ${player} queue: ${queues[player]}`)
  });

  socket.on("stop", () => {
    console.log("receiving stop event");
    clearInterval(interval);
  });

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
