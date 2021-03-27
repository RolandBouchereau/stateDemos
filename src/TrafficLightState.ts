import { useEffect, useReducer } from 'react';

export enum TrafficLightColor {
  Green = 'green',
  Yellow = 'yellow',
  Red = 'red'
}

export type State = TrafficLightColor;

const reducer = (state: State): State => {
  switch (state) {
    case TrafficLightColor.Green:
      return TrafficLightColor.Yellow;

    case TrafficLightColor.Yellow:
      return TrafficLightColor.Red;

    case TrafficLightColor.Red:
      return TrafficLightColor.Green;
  }
};

const durations = {
  [TrafficLightColor.Green]: 2000,
  [TrafficLightColor.Yellow]: 2000,
  [TrafficLightColor.Red]: 4000
};

export const useTrafficLight = (initialState: State) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const timeoutId = setTimeout(dispatch, durations[state]);
    return () => clearTimeout(timeoutId);
  }, [state]);

  return state;
};
