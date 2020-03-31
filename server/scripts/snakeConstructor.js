const reverses = {
  up: "down",
  down: "up",
  left: "right",
  right: "left"
};

class Snake {
  constructor(startVals = []) {
    this.head = null;
    this.tail = null;
    this.size = 0;

    startVals.forEach(v => this.addToHead(v));
  }

  addToHead(id, dir) {
    let node = new Node(id);
    this.size++;
    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.head.prevDir = "up";
      this.tail.nextDir = "down";
      return this.head;
    } else {
      this.head.headward = node;
      this.head.nextDir = dir;
      node.tailward = this.head;
      this.head = node;
      this.head.prevDir = reverses[dir];
      return this.head.tailward;
    }
  }

  removeFromTail() {
    let oldTail = this.tail;
    this.tail = oldTail.headward;
    oldTail.headward = null;
    this.tail.tailward = null;
    this.size--;
    return oldTail;
  }

  move(id, dir) {
    let oldHead = this.addToHead(id, dir);
    let oldTail = this.removeFromTail();
    return {
      newHead: this.head.id,
      oldHead: oldHead.id,
      oldHeadNextDir: oldHead.nextDir,
      oldHeadPrevDir: oldHead.prevDir,
      oldTail: oldTail.id,
      newTail: this.tail.id,
      newTailNextDir: this.tail.nextDir
    };
  }

  eat(id, dir) {
    let oldHead = this.addToHead(id, dir);
    return {
      newHead: this.head.id,
      oldHead: this.head.tailward.id,
      oldHead: oldHead.id,
      oldHeadNextDir: oldHead.nextDir,
      oldHeadPrevDir: oldHead.prevDir,
      size: this.size
    };
  }

  includes(id) {
    let curr = this.head;

    while (curr) {
      if (curr.id === id) return true;
      curr = curr.tailward;
    }

    return false;
  }

  each(cb) {
    let curr = this.head;
    while (curr) {
      cb(curr.id);
      curr = curr.tailward;
    }
  }

  stringify() {
    let str = "";
    this.each(id => {
      str += `${id}_`;
    });
    return str.slice(0, -1);
  }
}

const Node = function(id) {
  this.id = id;
  this.headward = null;
  this.tailward = null;
  this.nextDir = "";
  this.prevDir = "";
};

module.exports.Snake = Snake;
