import { List } from './list';
import { Node } from './node';

export class Circular extends List {
  _head;
  _last;
  _length;

  _addHead(value) {
    const { _head, _last } = this;
    const node = new Node(value);
    node.next = _head;
    node.prev = _last;
    this._head.prev = node;
    this._last.next = node;
    this._head = node;
    this._length++;
  }

  _addLast(value) {
    const { _head, _last } = this;
    const node = new Node(value);
    node.prev = _last;
    node.next = _head;
    this._head.prev = node;
    this._last.next = node;
    this._last = node;
    this._length++;
  }

  _addNode(value, index) {
    const target = this.node(index);
    const node = new Node(value);
    node.next = target;
    node.prev = target.prev;
    target.prev.next = node;
    target.prev = node;
    this._length++;
  }

  _initializeList(value) {
    const node = new Node(value);
    node.next = node;
    node.prev = node;
    this._head = node;
    this._last = node;
    this._length++;
  }

  _removeHead() {
    const { next: node } = this._head;

    if (node === this._head) {
      return this.clear();
    }

    node.prev = this._last;
    this._last.next = node;
    this._head = node;
    this._length--;
    return this;
  }

  _removeLast() {
    const { prev: node } = this._last;
    node.next = this._head;
    this._head.prev = node;
    this._last = node;
    this._length--;
    return this;
  }

  _removeNode(index) {
    const node = this.node(index);
    const { prev, next } = node;
    prev.next = next;
    next.prev = prev;
    this._length--;
    return node;
  }

  append(...values) {
    values.forEach((value) => {
      if (this.isEmpty()) {
        return this._initializeList(value);
      }

      return this._addLast(value);
    });
    return this;
  }

  filter(fn) {
    const list = new Circular();

    this.forEach((x) => {
      if (fn(x)) {
        list.append(x);
      }
    });

    return list;
  }

  forEach(fn) {
    let { _head: node } = this;

    if (node) {
      do {
        fn(node.value);
        node = node.next;
      } while (node !== this._head);
    }

    return this;
  }

  includes(value) {
    let { _head: node } = this;

    if (node) {
      do {
        if (node.value === value) {
          return true;
        }

        node = node.next;
      } while (node !== this._head);
    }

    return false;
  }

  indexOf(value) {
    let counter = 0;
    let { _head: node } = this;

    if (node) {
      do {
        if (node.value === value) {
          return counter;
        }

        counter++;
        node = node.next;
      } while (node !== this._head);
    }

    return -1;
  }

  insert({ value, index }) {
    this._arrayify(value).forEach((x) => {
      if (index === 0) {
        return this.prepend(x);
      }

      return this._addNode(x, index);
    });
    return this;
  }

  join(separator = ',') {
    let result = '';
    let { _head: node } = this;

    if (node) {
      do {
        result += node.value;

        if (node.next !== this._head) {
          result += separator;
        }

        node = node.next;
      } while (node !== this._head);
    }

    return result;
  }

  map(fn) {
    const list = new Circular();
    this.forEach((x) => list.append(fn(x)));
    return list;
  }

  prepend(...values) {
    values.forEach((value) => {
      if (this.isEmpty()) {
        return this._initializeList(value);
      }

      return this._addHead(value);
    });
    return this;
  }

  reduce(fn, acc) {
    let result = acc;

    this.forEach((x) => {
      result = fn(result, x);
    });

    return result;
  }

  reduceRight(fn, acc) {
    let result = acc;
    let { _last: node } = this;

    if (node) {
      do {
        result = fn(result, node.value);
        node = node.prev;
      } while (node !== this._last);
    }

    return result;
  }

  remove(index) {
    if (!this._isValid(index)) {
      return null;
    }

    if (index === 0) {
      return this._removeHead();
    }

    if (index === this.length - 1) {
      return this._removeLast();
    }

    return this._removeNode(index);
  }

  reverse() {
    const list = new Circular();
    this.forEach((x) => list.prepend(x));
    return list;
  }

  toArray() {
    const array = [];
    this.forEach((x) => array.push(x));
    return array;
  }

  toLinear() {
    const Linear = require('./linear');
    const list = new Linear();
    this.forEach((x) => list.append(x));
    return list;
  }

  toString() {
    return this.join(',');
  }
}
