/*global d3*/
import React, { Component } from 'react'
import './CitationEvolution.css'

export default class CitationEvolution extends Component {

    constructor() {
        super()
        this.drawChart = this.drawChart.bind(this)
        this.resizeChart = this.resizeChart.bind(this)
    }

    componentDidUpdate() {
        if (this.props.data !== null && this.props.data.length > 0 && this.props.modalReady) {
            this.drawChart()
            window.addEventListener('resize', this.resizeChart);
        }
    }

    resizeChart() {
        var maxNumber = d3.max(this.props.data, function(d) { return d.number; }),
        yearWidth = document.getElementsByClassName("year-label")[0].offsetWidth,
        rowWidth = document.getElementById("citation-evolution-chart").offsetWidth

        var x = d3.scale.linear()
                    .domain([0, maxNumber])
                    .range([30, rowWidth - yearWidth]);

        d3.select("#citation-evolution-chart")
        .selectAll(".column").style("width", function(d) { return x(d.number)+'px'; })
    }

    drawChart() {
        var barChart = d3.select("#citation-evolution-chart");

        var line = barChart
            .selectAll("div")
            .data(this.props.data)
            .enter()
            .append("div");
        
        line.append("span")
            .attr("class", "year-label")
            .text(function(d) { return d.year; });
            
        var bar = line.append("div").attr("class", "column");
        bar.text(function(d) { return d.number; });
        this.resizeChart()
    }
    
    render() {
        return (
            <div>
                {(this.props.data) ? null : <div className="text-center"><i className="fa fa-spinner fa-spin fa-2x fa-fw"></i></div>}
                <div id="citation-evolution-chart" style={{'width': '100%'}}></div>
                {
                    (this.props.data && this.props.data.length > 0)
                        ?   (<div className="text-center mt-3 caption">
                                <p id="figure-caption">Figure 1: Number of influenced papers over the years</p>
                            </div>)
                        :   null
                }
            </div>
        )
    }
}