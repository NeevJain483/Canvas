export class Stack<T> {
  private items: T[] = [];
  private readonly maxCapacity: number;

  constructor(capacity: number = 10) {
    this.maxCapacity = capacity;
  }

  push(item: T): void {
  if (this.size() === this.maxCapacity) {
    this.popBottom(); // drop oldest
  }
  this.items.push(item);
}

  pop(): T | undefined {
    if (this.isEmpty()) {
      console.log("Stack Underflow!");
      return undefined;
    }
    return this.items.pop();
  }

  peek(): T | undefined {
    if (this.isEmpty()) {
      console.log("Stack is empty!");
      return undefined;
    }
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  isFull(): boolean {
    return this.maxCapacity == this.size();
  }

  size(): number {
    return this.items.length;
  }

  capacity(): number {
    return this.maxCapacity;
  }
  popBottom(): T | undefined {
  if (this.isEmpty()) return undefined;
  return this.items.shift();
}
}
