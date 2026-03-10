import { minHeap } from './../src/minPQ.js';

describe('minHeap', () => {
  test('should push and pop values in ascending order', () => {
    const heap = new minHeap();
    heap.push(5);
    heap.push(1);
    heap.push(9);
    heap.push(3);
    expect(heap.pop()).toBe(1);
    expect(heap.pop()).toBe(3);
    expect(heap.pop()).toBe(5);
    expect(heap.pop()).toBe(9);
  });

  test('should return null when popping empty heap', () => {
    const heap = new minHeap();
    expect(heap.pop()).toBeNull();
  });

  test('peak should return min without removing', () => {
    const heap = new minHeap();
    heap.push(7);
    heap.push(2);
    expect(heap.peak()).toBe(2);
    expect(heap.pop()).toBe(2);
    expect(heap.peak()).toBe(7);
  });

  test('should handle duplicate values', () => {
    const heap = new minHeap();
    heap.push(4);
    heap.push(4);
    heap.push(2);
    expect(heap.pop()).toBe(2);
    expect(heap.pop()).toBe(4);
    expect(heap.pop()).toBe(4);
  });

  test('should work with negative numbers', () => {
    const heap = new minHeap();
    heap.push(-10);
    heap.push(-5);
    heap.push(-20);
    expect(heap.pop()).toBe(-20);
    expect(heap.pop()).toBe(-10);
    expect(heap.pop()).toBe(-5);
  });
});