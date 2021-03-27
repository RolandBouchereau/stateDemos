import React from 'react';
import { isOddCount, useCountState } from './BasicCountState';

export const Counter = () => {
  const [
    state,
    { increment, decrement, incrementIfOdd, bump, resetAsync },
  ] = useCountState();

  const disabled = false;//!isAvailable(state);

  return (
    <div>
      <h3>Count: {state}</h3>
      <button disabled={disabled} onClick={increment}>
        +
      </button>
      <button disabled={disabled} onClick={decrement}>
        -
      </button>
      <button
        disabled={!isOddCount(state) || disabled}
        onClick={incrementIfOdd}
      >
        Increment if odd
      </button>
      <button disabled={disabled} onClick={() => bump(5)}>
        Bump by 5
      </button>
      <button disabled={disabled} onClick={resetAsync}>
        Zero, async
      </button>
    </div>
  );
};
