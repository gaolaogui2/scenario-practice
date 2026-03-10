/**
 * LRU (Least Recently Used) 是 1 种缓存淘汰策略，核心要求如下：
 * 1. 容量限制：缓存有固定大小限制
 * 2. 访问更新：每次访问数据后，将其标记为最新使用
 * 3. 淘汰机制：当缓存满时，优先删除最久未使用的数据
 * 4. 时间复杂度：通常要求 get 和 put 操作都是 O(1) 时间复杂度
 *
 * 简单来说就是：保留最近使用的，淘汰长期不用的。
 */

/**
 * 利用 JS 的 Map 特性实现
 */
class SampleLURCache {
  capacity = 0;
  cache = new Map();
  constructor(capacity) {
    this.capacity = capacity;
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

class Node {
  key;
  value;
  prev;
  next;
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

class LRUCache {
  capacity = 0;
  cache = new Map();
  head;
  tail;

  constructor(capacity) {
    this.capacity = capacity;
    this.head = new Node(-1, -1);
    this.tail = new Node(-1, -1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    const node = this.cache.get(key);
    this.moveToHead(node);
    return node.value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      this.moveToHead(node);
    } else {
      const node = new Node(key, value);
      this.cache.set(key, node);
      this.addToHead(node);
      if (this.cache.size > this.capacity) {
        const tail = this.popTail();
        this.cache.delete(tail.key);
      }
    }
  }

  addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next = node;
    node.next.prev = node;
  }

  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  moveToHead(node) {
    this.removeNode(node);
    this.addToHead(node);
  }

  popTail() {
    const node = this.tail.prev;
    this.tail.prev = node.prev;
    node.prev.next = this.tail;
    return node;
  }
}

export { LRUCache };

/**
 * 适用场景：
 * 1. 短期热点数据明显，数据访问具有时间局部性，最近访问的数据很可能再次被访问
 * 2. Web 浏览器缓存，适合用 LRU 淘汰很久未访问的页面
 * 3. CPU 缓存
 * 4. 会话缓存
 */
