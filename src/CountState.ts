import { useMemo, useReducer } from 'react';
import { tuple } from './utility';

export enum Availability {
  Available = 'Available',
  Busy = 'Busy'
}

export type State = { availability: Availability; count: number };

/*
type StateTransformAction<S> = (state: S) => S;

function reducer<S>(state: S, action: StateTransformAction<S>): S {
    return action(state);
}
*/

type StateTransformAction = (state: State) => State;

export const isAvailable = (state: State): boolean =>
  state.availability === Availability.Available;

const whenAvailable = (state: State, action: StateTransformAction): State => {
  if (isAvailable(state)) {
    return action(state);
  }
  console.log(`Can't perform action in ${state.availability} state.`);
  return state;
};

const startAsync = (f: () => Promise<void>) => (state: State): State => {
  if (!isAvailable(state)) {
    return state;
  }

  f().finally();

  return {
    ...state,
    availability: Availability.Busy
  };
};

const finish = (state: State): State => {
  if (isAvailable(state)) {
    console.log(`Can't finish in ${state.availability} state.`);
    return state;
  }

  return {
    ...state,
    availability: Availability.Available
  };
};

const increment = (state: State): State => {
  if (!isAvailable(state)) {
    console.log(`Can't increment in ${state.availability} state.`);
    return state;
  }

  return {
    ...state,
    count: state.count + 1
  };
};

const unguardedDecrement = (state: State) => ({
  ...state,
  count: state.count - 1
});

const decrement = (state: State): State =>
  whenAvailable(state, unguardedDecrement);

export const isOddCount = (state: State): boolean => state.count % 2 !== 0;

const incrementIfOdd = (state: State): State => {
  if (!isOddCount(state)) {
    return state;
  }

  return increment(state);
};

const bump = (n: number) => (state: State): State => {
  switch (state.availability) {
    case Availability.Available:
      return {
        ...state,
        count: state.count + n
      };

    case Availability.Busy:
      console.log(`Can't bump in ${Availability.Busy} state.`);
      return state;
  }
};

const unguardedReset = (state: State): State => ({
  ...state,
  count: 0
});

const reducer = (state: State, action: StateTransformAction): State =>
  action(state);

const initialState: State = {
  availability: Availability.Available,
  count: 0
};

const slowAsyncFunction = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 3000));

export function useCountState() {
  /* <Reducer<State, StateTransformAction>>*/
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(() => {
    const finishAsync = () => dispatch(finish);
    const guardAsync = (p: () => Promise<void>): void =>
      dispatch(startAsync(() => p().finally(finishAsync)));

    return {
      increment: () => dispatch(increment),
      incrementIfOdd: () => dispatch(incrementIfOdd),
      decrement: () => dispatch(decrement),
      bump: (n: number) => dispatch(bump(n)),
      resetAsync: () =>
        guardAsync(() =>
          slowAsyncFunction().then(() => dispatch(unguardedReset))
        )
    };
  }, []);

  // return [state, actions];
  return tuple(state, actions);
}
