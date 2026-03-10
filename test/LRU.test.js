import { LRUCache } from './../src/LRU.js';

describe('LRUCache', () => {
  test('should get and put values', () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    expect(cache.get(1)).toBe(1);
    expect(cache.get(2)).toBe(2);
  });

  test('should evict least recently used item when capacity exceeded', () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.put(3, 3); // evicts key 1
    expect(cache.get(1)).toBe(-1);
    expect(cache.get(2)).toBe(2);
    expect(cache.get(3)).toBe(3);
  });

  test('get should update recent usage', () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.get(1); // now key 1 is most recently used
    cache.put(3, 3); // evicts key 2
    expect(cache.get(2)).toBe(-1);
    expect(cache.get(1)).toBe(1);
    expect(cache.get(3)).toBe(3);
  });

  test('put existing key should update value and usage', () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.put(1, 100); // update value
    expect(cache.get(1)).toBe(100);
    cache.put(3, 3); // evicts key 2
    expect(cache.get(2)).toBe(-1);
    expect(cache.get(1)).toBe(100);
  });

  test('should return -1 for non-existent key', () => {
    const cache = new LRUCache(2);
    expect(cache.get(99)).toBe(-1);
  });
});