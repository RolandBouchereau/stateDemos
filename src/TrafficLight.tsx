import React from 'react';
import { TrafficLightColor, useTrafficLight } from './TrafficLightState';

interface TrafficLightProps {
  initialColor: TrafficLightColor;
}

export const TrafficLight: React.FC<TrafficLightProps> = ({
  initialColor
}: TrafficLightProps) => {
  const trafficLightColor = useTrafficLight(initialColor);

  return (
    <div
      style={{
        display: 'inline-block',
        margin: '2rem'
      }}
    >
      <div
        style={{
          height: 100,
          width: 100,
          borderRadius: '50%',
          backgroundColor:
            trafficLightColor === TrafficLightColor.Red ? 'red' : '#280000'
        }}
      />
      <div
        style={{
          height: 100,
          width: 100,
          borderRadius: '50%',
          backgroundColor:
            trafficLightColor === TrafficLightColor.Yellow
              ? 'yellow'
              : '#282800'
        }}
      />
      <div
        style={{
          height: 100,
          width: 100,
          borderRadius: '50%',
          backgroundColor:
            trafficLightColor === TrafficLightColor.Green
              ? 'lawngreen'
              : '#002800'
        }}
      />
    </div>
  );
};
