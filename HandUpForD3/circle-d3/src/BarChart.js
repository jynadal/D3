import React, { useRef, useEffect, useState } from 'react';
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from 'd3';

const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
        const observeTarget = ref.current;
        const resizeObserver = new ResizeObserver((entries) => {
            console.log(entries);
            // set resized dimensions here
        });
        resizeObserver.observe(observeTarget);
        return () => {
            resizeObserver.unobserve(observeTarget);
        };

    }, [ref])
    return dimensions;
};



function BarChart({data}) {
 // const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75,])
  const svgRef = useRef();
  const dimensions = useResizeObserver(svgRef);

  // will be called initially and on every data changz
  useEffect(() => {
    const svg = select(svgRef.current);

    // scales
    const xScale = scaleBand()
          .domain(data.map((value, index) => index))
          .range([0, 300])  // change
          .padding(0.5);

    const yScale = scaleLinear()
          .domain([0, 150])  // todo
          .range([150, 0]);  // change

    const colorScale = scaleLinear()
          .domain([75,100, 150])
          .range(["green","orange", "red"])
          .clamp(true)

    // create x-axis
    const xAxis = axisBottom(xScale).ticks(data.length);
    svg
        .select(".x-axis")
        .style("transform", "translateY(150px)")
        .call(xAxis);

    // create y-axis
    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
      .style("transform", "translateX(0px)")
      .call(yAxis);

    svg.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")      
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -150)      
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (value, index) => {
        svg
          .selectAll(".tooltip")
          .data([value])
          .join(enter => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(index) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value) - 8)
          .attr("opacity", 1);
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("fill", colorScale)
      .attr("height", value => 150 - yScale(value));  
   }, [data]);

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      
      </React.Fragment>
  );
}

export default BarChart;
