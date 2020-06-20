import React, { useRef, useEffect, useState } from 'react';
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from 'd3';
import ResizeObserver from 'resize-observer-polyfill';


const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null);
    useEffect(() => {
        const observeTarget = ref.current;
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                setDimensions(entry.contentRect);
            });
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
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data changz
  useEffect(() => {
    const svg = select(svgRef.current);

    if(!dimensions) return;

    // scales
    const xScale = scaleBand()
          .domain(data.map((value, index) => index))
          .range([0, dimensions.width])  // change
          .padding(0.5);

    const yScale = scaleLinear()
          .domain([0, 150])  // todo
          .range([dimensions.height, -30]);  // change

    const colorScale = scaleLinear()
          .domain([75,100, 150])
          .range(["green","orange", "red"])
          .clamp(true)

    // create x-axis
    const xAxis = axisBottom(xScale).ticks(data.length);
    svg
        .select(".x-axis")
        .style("transform", "translateY(180px)")
        .call(xAxis);
        //`translateY(${dimensions.height}px)`

    // create y-axis
    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
      .style("transform", "translateX(0px)")
      .call(yAxis);
      //`translateX(${dimensions.height}px)`

    svg.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")      
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -dimensions.height)      
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
      .attr("height", value => dimensions.height - yScale(value));  
   }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      
      </div>
  );
}

export default BarChart;
