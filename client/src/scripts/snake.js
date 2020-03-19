class Snake {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
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
    this.size--;
  }

  move(id) {
    this.addToHead(id);
    this.removeFromTail();
  }
}

const Node = function(id) {
  this.id = id;
  this.headward = null;
  this.tailward = null;
};

export default Snake;
