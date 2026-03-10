class minHeap {
  heap = [];
  push(val) {
    this.heap.push(val);
    this.swim(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) {
      return null;
    }

    const res = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.length--;
    this.sink(0);

    return res;
  }

  // 查看顶
  peak() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0];
  }

  // 上浮
  swim(index) {
    if (index > 0) {
      const parentIndex = this.toParentIndex(index);
      if (this.heap[parentIndex] > this.heap[index]) {
        this.swap(index, parentIndex);
        this.swim(parentIndex);
      }
    }
  }

  // 下沉
  sink(index) {
    let minIndex = index;
    const left = this.toLeft(index);
    const right = this.toRight(index);

    if (left && this.heap[left] < this.heap[minIndex]) {
      minIndex = left;
    }

    if (right && this.heap[right] < this.heap[minIndex]) {
      minIndex = right;
    }

    if (minIndex !== index) {
      this.swap(index, minIndex);
      this.sink(minIndex);
    }
  }

  toParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  toLeft(index) {
    const res = index * 2 + 1;
    return res < this.heap.length ? res : 0;
  }

  toRight(index) {
    const res = index * 2 + 2;
    return res < this.heap.length ? res : 0;
  }

  swap(x, y) {
    [this.heap[x], this.heap[y]] = [this.heap[y], this.heap[x]];
  }
}

/**
 * 小顶堆是 1 种特殊的完全二叉树数据结构
 * 满足：任意节点的值都小于或等于其子节点的值
 * 根节点始终是整个堆中的最小值
 * 确保有 .push .peak 和 .pop 动作
 */

/**
 * 完全二叉树：除最后 1 层外其它层的节点都被填满
 * 最后 1 层的节点都集中在左侧
 */

/**
 * 堆：必须是完全二叉树，必须满足堆序性质（特定的大小关系）
 */

export { minHeap };
