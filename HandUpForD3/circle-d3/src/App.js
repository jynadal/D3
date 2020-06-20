import React, { useRef, useEffect, useState } from 'react';
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from 'd3';
import './App.css';
import BarChart from './BarChart';


function App() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75,]);

  return (
    <React.Fragment>
      <BarChart data={data} />
        <br />
      <button onClick={() => setData(data.map(value => value + 5))}>
        Update Data
      </button>
      <button onClick={() => setData(data.filter(value => value <= 35))}>
        Filter Data
      </button>
      <button onClick={() => setData([ ...data, Math.round(Math.random() * 100)])}> Add Data </button>
      </React.Fragment>
  );
}

export default App;
