import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Counter } from './Counter';
// import { TrafficLight } from "./TrafficLight";
// import { TrafficLightColor } from "./TrafficLightState";
// import { Registration } from "./Registration";

ReactDOM.render(
  <>
    <Counter />
    {/*<br />*/}
    {/*<TrafficLight initialColor={TrafficLightColor.Green} />*/}
    {/*<TrafficLight initialColor={TrafficLightColor.Red} />*/}
    {/*<Registration />*/}
  </>,
  document.getElementById('root')
);
