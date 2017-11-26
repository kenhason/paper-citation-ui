import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
class BarChart extends Component {
    constructor(){
        super()
        this.createBarChart = this.createBarChart.bind(this)
        this.scaleBarChart = this.createBarChart.bind(this)
    }
    
    componentDidMount() {
        this.createBarChart()
    }

    componentWillReceiveProps() {
        // console.log("props are updated")
        this.scaleBarChart()
    }

    componentWillUnmount() {
        select(this.node)
            .selectAll('rect')
            .data(this.props.data)
            .exit()
            .remove()
    }
       
    createBarChart() {
        const dataMax = max(this.props.data)
        const yScale = scaleLinear()
                        .domain([0, dataMax])
                        .range([0, this.props.dimensions.height])
        
        select(this.node)
            .selectAll('rect')
            .data(this.props.data)
            .enter()
            .append('rect')
        
        select(this.node)
        .selectAll('rect')
        .data(this.props.data)
        .style('fill', '#fe9922')
        .attr('x', (d,i) => i * (this.props.dimensions.width/this.props.data.length))
        .attr('y', d => this.props.dimensions.height - yScale(d))
        .attr('height', d => yScale(d))
        .attr('width', this.props.dimensions.width/this.props.data.length)
    }

    scaleBarChart() {
        const dataMax = max(this.props.data)
        const yScale = scaleLinear()
                        .domain([0, dataMax])
                        .range([0, this.props.dimensions.height])
        select(this.node)
            .selectAll('rect')
            .attr('x', (d,i) => i * (this.props.dimensions.width/this.props.data.length))
            .attr('y', d => this.props.dimensions.height - yScale(d))
            .attr('height', d => yScale(d))
            .attr('width', this.props.dimensions.width/this.props.data.length)
    }

    render() {
        return <svg ref={node => this.node = node}
        width={this.props.dimensions.width} height={this.props.dimensions.height}>
        </svg>
    }
}
export default BarChart