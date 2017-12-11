/*global d3 $*/
// Reference: http://bl.ocks.org/d3noob/7cd5a74c4620db72f43f
import React, { Component } from 'react'
import APIManager from '../../utils/APIManager'

export default class TopicTrend extends Component {
    constructor() {
        super()
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        $('#topicTrend').on('hidden.bs.modal', function (e) {
            this.props.onClose()
        }.bind(this))

        $('#topicTrend').on('shown.bs.modal', function (e) {
            this.getTopicTrend()
        }.bind(this))
        
        $('#topicTrend').modal('show')  
    }

    getTopicTrend() {
        console.log("getting topic trend ...")
        let body = {
            "statements": [
                {
                    "statement": "match (n: Paper) where n.year > 0 and n.topicLabel <> '' return n.year, n.topicLabel, count(*) as papers order by n.year asc, papers desc"
                }
            ]
        };

        APIManager.queryNeo4j(body, (err, res) => {
            if (err) {
                console.log(err)
                return
            }

            let data = res.results[0].data.map(function (data) { return { year: data.row[0], topic: data.row[1], number: data.row[2] } })

            this.setState({
                data: data
            }, () => this.visualizeChart())
        })
    }

    visualizeChart() {
        // Set the dimensions of the canvas / graph
        var margin = { top: 30, right: 20, bottom: 70, left: 50 },
            width = this.refs.container.clientWidth - margin.left - margin.right,
            height = 0.5*this.refs.container.clientWidth - margin.top - margin.bottom;

        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5);

        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(5);

        // Define the line
        var priceline = d3.svg.line()
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

        var legend = d3.select(this.refs.legend)
        var data = this.state.data

        // Scale the range of the data
        x.domain([d3.min(data, function (d) { return d.year; }), d3.max(data, function (d) { return d.year; })]);
        y.domain([0, d3.max(data, function (d) { return d.number; })]);

        // Nest the entries by symbol
        var dataNest = d3.nest()
            .key(function (d) { return d.topic; })
            .entries(data);
            
        var color = d3.scale.category20();   // set the colour scale

        var legendSpace = width / dataNest.length; // spacing for legend

        // Loop through each symbol / key
        dataNest.forEach(function (d, i) {

            svg.append("path")
                .attr("class", "line")
                .style("stroke", function () { // Add the colours dynamically
                    return d.color = color(d.key);
                })
                .attr("d", priceline(d.values));

            // Add the Legend
            legend.append("a")
                // .attr("x", (legendSpace / 2) + i * legendSpace) // spacing
                // .attr("y", height + (margin.bottom / 2) + 5)
                .attr("class", "col-7")    // style the legend
                .style("color", function () { // dynamic colours
                    return d.color = color(d.key);
                })
                .text(d.key);
        });

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    }

    render() {
        return(
            <div id="topicTrend" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Topic Trend</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div ref="container" className="text-center">
                                { (this.state.data.length > 0) 
                                    ?   <div id="chart-line-1" ref="topicChart">
                                            <svg style={{ "font": "10.5px Arial" }} ref="chart" width="300" height="200"></svg>
                                            <div ref="legend"></div>
                                        </div>
                                    :   <div className="text-center">
                                            <i className="fa fa-cog fa-spin fa-3x fa-fw"></i>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        )
    }
}