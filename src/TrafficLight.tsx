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
    <>
      <div
        style={{
          height: 100,
          width: 100,
          borderRadius: '50%',
          backgroundColor:
            trafficLightColor === TrafficLightColor.Red ? 'red' : '#5a3838'
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
              : '#726d42'
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
              : '#376b37'
        }}
      />
    </>
  );
};
