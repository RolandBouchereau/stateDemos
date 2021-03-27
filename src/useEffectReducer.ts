import { Dispatch, useCallback, useEffect, useReducer, useState } from 'react';

export type Action<S> = (state: S) => [S, Effects<S>];

export type Effects<S> = Effect<S>[];

type Effect<S> = (state: S, dispatch: Dispatch<Action<S>>) => void;

function effectReducer<S, A extends Action<S>>(
  state: S,
  action: A
): [S, Effects<S>] {
  return action(state);
}

export function useEffectReducer<S>(initialState: S): [S, Dispatch<Action<S>>] {
  let [pendingEffects, setPendingEffects] = useState<Effects<S>>([]);

  const simpleReducer = useCallback((state: S, action: Action<S>): S => {
    const [newState, reducedEffects] = effectReducer(state, action);

    if (reducedEffects.length > 0) {
      setPendingEffects((pendingEffects) =>
        reducedEffects.concat(pendingEffects)
      );
    }

    return newState;
  }, []);

  const [state, dispatch] = useReducer(simpleReducer, initialState);

  useEffect(() => {
    const effect = pendingEffects.shift();
    if (effect === undefined) {
      return;
    }

    setPendingEffects([...pendingEffects]);

    effect(state, dispatch);
  }, [pendingEffects, state]);

  return [state, dispatch];
  // return tuple(state, dispatch);
}
