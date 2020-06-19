import React, { useRef, useEffect, useState } from 'react';
import { select, line, curveCardinal, axisBottom, axisLeft, scaleLinear} from 'd3';
import './App.css';


function App() {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75,])
  const svgRef = useRef();
  console.log(svgRef);

  // will be called initially and on every data changz
  useEffect(() => {
    const svg = select(svgRef.current);
    const xScale = scaleLinear()
          .domain([0, data.length - 1])
          .range([0, 300]);

    const yScale = scaleLinear()
          .domain([0, 150])
          .range([150, 0]);

    const xAxis = axisBottom(xScale).ticks(data.length).tickFormat(index => index +1);

    const yAxis = axisLeft(yScale);

    svg
        .select(".x-axis")
        .style("transform", "translateY(150px)")
        .call(xAxis);

    svg
      .select(".y-axis")
      .style("transform", "translateX(0px)")
      .call(yAxis);
  
  // generates the "d" attrubute of a path element
    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

  // svg of the "Circle"
  //   svg
  //   .selectAll("circle")
  //   .data(data)
  //   .join("circle")
  //   .attr("r", value => value)
  //   .attr("cx", value => value * 2)
  //   .attr("cy", value => value * 2)
  //   .attr("stroke", "blue")

  //renders path element, and attaches
  //the "d" attribute from line generator above
      svg
        .selectAll(".line")
        .data([data])
        .join("path")
        .attr("class", "line")
        .attr("d", myLine)
        .attr("fill", "none")
        .attr("stroke", "blue");
   }, [data])

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <br />
      <button onClick={() => setData(data.map(value => value - 5))}>
        Update Data
      </button>
      <button onClick={() => setData(data.filter(value => value <= 35))}>
        Filter Data
      </button>
      </React.Fragment>
  );
}

export default App;
