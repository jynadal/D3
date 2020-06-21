import React, { useRef, useEffect, useState } from 'react';
import {select, min, max } from 'd3';
import './App.css';
import useResizeObserver from './useResizeObserver';

const getDate = dateString => {
    const date = dateString.split("-");
    return new Date(date[2], date[0] -1, date[1]);
};

function BBTimeline({ data, highlight }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    // will be called initially and on every data change
    useEffect(() => {
       const svg = select(svgRef.current);
       if(!dimensions) return;

    // draw the Gauge
    }, [data, dimensions, highlight]);

    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem"}}>
            <svg ref={svgRef}>
                <g className="x-axis" />
            </svg>
        </div>
    );
}

export default BBTimeline;
