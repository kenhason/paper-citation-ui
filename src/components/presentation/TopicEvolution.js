/*global d3 $*/
import React, { Component } from 'react'
import './TopicEvolution.css'

export default class TopicEvolution extends Component {
    constructor() {
        super()
        this.state = {
            modalReady: false
        }
    }
    componentDidMount() {
        $('#topicEvolution').on('hide.bs.modal', function (e) {
            this.props.onClose()
        }.bind(this))

        $('#topicEvolution').on('shown.bs.modal', function (e) {
            this.setState({
                modalReady: true
            })
        }.bind(this))
        
        $('#topicEvolution').modal('show')  
    }

    componentDidUpdate() {
        if (this.props.chartData.length > 0 && this.state.modalReady === true)
            this.drawLineChart() 
    }

    drawChart() {
        var barChart = d3.select("#topic-evolution-chart");
        console.log(document.getElementById("topic-evolution-chart").offsetWidth)
        var line = barChart
            .selectAll("div")
            .data(this.props.chartData)
            .enter()
            .append("div");
        
        line.append("span")
            .attr("class", "year-label")
            .text(function(d) { return d.year; });
            
        var bar = line.append("div").attr("class", "column");
        bar.text(function(d) { return d.number; });
        window.addEventListener('resize', this.resizeChart.bind(this));
        this.resizeChart()
    }

    resizeChart() {
        var maxNumber = d3.max(this.props.chartData, function(d) { return d.number; }),
        yearWidth = document.getElementsByClassName("year-label")[0].offsetWidth,
        rowWidth = document.getElementById("topic-evolution-chart").offsetWidth

        var x = d3.scale.linear()
                    .domain([0, maxNumber])
                    .range([30, rowWidth - yearWidth]);

        d3.select("#topic-evolution-chart")
        .selectAll(".column").style("width", function(d) { return x(d.number)+'px'; })
    }

    drawLineChart() {
        d3.select(this.refs.chart).selectAll("*").remove()

        var margin = { top: 30, right: 20, bottom: 30, left: 60 },
            width = this.refs.topicChart.clientWidth - margin.left - margin.right,
            height = 0.4*this.refs.topicChart.clientWidth - margin.top - margin.bottom;

        // Set the ranges
        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
            .ticks(5)
            .orient("bottom")
            .tickFormat(d3.format('.0f'))

        var yAxis = d3.svg.axis().scale(y)
            .ticks(5)
            .orient("left");

        // Define the line
        var valueline = d3.svg.line()
            .x(function (d) { return x(d.year); })
            .y(function (d) { return y(d.number); })
            .interpolate("cardinal");

        // Adds the svg canvas
        var svg = d3.select(this.refs.chart)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        var data = Object.assign([], this.props.chartData)

        // Scale the range of the data
        x.domain([d3.min(data, function (d) { return d.year; }), d3.max(data, function (d) { return d.year; })]);
        y.domain([0, d3.max(data, function (d) { return d.number; })]);

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("dy", "-0.71em")
            .attr("text-anchor", "end")
            .text("# papers");
    }

    render() {
        return (
            <div id="topicEvolution" className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.topic}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {(this.props.chartData.length > 0) ? null : <div className="text-center"><i className="fa fa-spinner fa-spin fa-2x fa-fw"></i></div>}
                            <div id="topic-evolution-chart" style={{'width': '100%'}}></div>
                            <div ref="topicChart">
                                <svg style={{"font": "10.5px Arial"}} id="chart" ref="chart" width="300" height="200"></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}