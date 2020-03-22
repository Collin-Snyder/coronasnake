const { v4 } = require("uuid");

const games = {};

const Game = function(id, createdAt) {
    this.id = id;
  this.createdAt = createdAt;
  this.name1 = "";
  this.color1 = "";
  this.name2 = "";
  this.color2 = "";
  this.head1 = 0;
  this.head2 = 0;
  this.tail1 = 0;
  this.tail2 = 0;
  this.food1 = 0;
  this.food2 = 0;
  this.length1 = 0;
  this.length2 = 0;
  this.gameOver = false;
};

module.exports.addGame = gameInfo => {
  let id = v4();
  games[id] = new Game(id, gameInfo.createdAt);
  return id;
};

module.exports.updateGame = (id, info) => {
  for (let property in info) {
    games[id][property] = info[property];
  }
};

module.exports.getAllGames = () => {
  return Object.values(games);
};

module.exports.getGame = id => {
  return games[id];
};

module.exports.deleteGame = id => {
  delete games[id];
};
