/*global d3 $*/
import React, { Component } from 'react'

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
            this.drawChart() 
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
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}