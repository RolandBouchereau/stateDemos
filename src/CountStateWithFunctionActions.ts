import { useMemo, useReducer } from 'react';
import { tuple } from './utility';

export type State = { count: number };

type StateTransformAction = (state: State) => State;

const increment = (state: State): State => ({
  ...state,
  count: state.count + 1
});

const decrement = (state: State): State => ({
  ...state,
  count: state.count - 1
});

export const isOddCount = (state: State): boolean => state.count % 2 !== 0;

const incrementIfOdd = (state: State): State => {
  if (isOddCount(state)) {
    return increment(state);
  }

  return state;
};

const bump = (n: number) => (state: State): State => ({
  ...state,
  count: state.count + n
});

const reset = (state: State): State => {
  return {
    ...state,
    count: 0
  };
};

const reducer = (state: State, action: StateTransformAction): State =>
  action(state);

const initialState: State = {
  count: 0
};

const slowAsyncFunction = () =>
  new Promise((resolve) => setTimeout(resolve, 3000));

export function useCountState() {
  /*<Reducer<State, StateTransformAction>>*/
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      increment: () => dispatch(increment),
      incrementIfOdd: () => dispatch(incrementIfOdd),
      decrement: () => dispatch(decrement),
      bump: (n: number) => dispatch(bump(n)),
      resetAsync: () => {
        slowAsyncFunction().then(() => dispatch(reset));
      }
    }),
    []
  );

  // return [state, actions];
  return tuple(state, actions);
}
