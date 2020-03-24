class Snake {
  constructor(startVals = []) {
    this.head = null;
    this.tail = null;
    this.size = 0;

    startVals.forEach(v => this.addToHead(v));
  }

  addToHead(id) {
    let node = new Node(id);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.head.headward = node;
      node.tailward = this.head;
      this.head = node;
    }
    this.size++;
  }

  removeFromTail() {
    let oldTail = this.tail;
    this.tail = oldTail.headward;
    oldTail.headward = null;
    this.tail.tailward = null;
    this.size--;
  }

  move(id) {
    this.addToHead(id);
    this.removeFromTail();
  }

  eat(id) {
    this.addToHead(id);
  }

  includes(id) {
      let curr = this.head;

      while(curr) {
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
      str += `${id}_`
    })
    return str.slice(0, -1);
  }
}

const Node = function(id) {
  this.id = id;
  this.headward = null;
  this.tailward = null;
};

module.exports.Snake = Snake;
