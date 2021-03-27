import { useMemo, useReducer } from 'react';
import { tuple } from './utility';

export type State = number;

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const INCREMENT_IF_ODD = 'INCREMENT_IF_ODD';
const BUMP = 'BUMP';
const RESET = 'RESET';

type CounterAction =
  | {
      type: typeof INCREMENT;
    }
  | {
      type: typeof DECREMENT;
    }
  | {
      type: typeof INCREMENT_IF_ODD;
    }
  | {
      type: typeof BUMP;
      n: number;
    }
  | {
      type: typeof RESET;
    };

export const isOddCount = (state: State): boolean => state % 2 !== 0;

const reducer = (state: State, action: CounterAction): State => {
  switch (action.type) {
    case INCREMENT:
      return state + 1;

    case DECREMENT:
      return state - 1;

    case INCREMENT_IF_ODD:
      return isOddCount(state) ? state + 1 : state;

    case BUMP:
      return state + action.n;

    case RESET:
      return 0;
  }
};

const slowAsyncFunction = () =>
  new Promise((resolve) => setTimeout(resolve, 3000));

export function useCountState() {
  const [state, dispatch] = useReducer(reducer, 0);

  const actions = useMemo(
    () => ({
      increment: () => dispatch({ type: INCREMENT }),
      incrementIfOdd: () => dispatch({ type: INCREMENT_IF_ODD }),
      decrement: () => dispatch({ type: DECREMENT }),
      bump: (n: number) => dispatch({ type: BUMP, n }),
      resetAsync: () => {
        slowAsyncFunction().then(() => dispatch({ type: RESET }));
      }
    }),
    []
  );

  // return [state, actions];
  return tuple(state, actions);
}
