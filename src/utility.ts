export interface DispatchActions {
  increment(): void;
  incrementIfOdd(): void;
  decrement(): void;
  bump(n: number): void;
  resetAsync(): void;
}

export const tuple = <T extends any[]>(...args: T): T => args;
