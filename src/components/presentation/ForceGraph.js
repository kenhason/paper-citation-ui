// Tutorial: http://www.puzzlr.org/force-graphs-with-d3/
import React, { Component } from 'react'
import * as d3 from 'd3'
import './ForceGraph.css'

class ForceGraph extends Component {
    
    componentDidMount() {
        this.visualizeGraph()
    }

    visualizeGraph() {
        this.svg = d3.select(this.node)
        this.inializeNodesAndLinksInDOM()
        this.initializeSimulation()
        this.applySimulationFeatures()
        this.applyDrag()
    }  

    initializeSimulation() {
        this.simulation = d3.forceSimulation()
                            .nodes(this.props.graph.nodes)
                            .force('charge_force', d3.forceManyBody())
                            .force('center-force', d3.forceCenter(this.props.dimensions.width/2, this.props.dimensions.height/2))
    }

    inializeNodesAndLinksInDOM() {
        this.DOMNodes = this.svg
                            .append('g')
                            .attr('class', 'nodes')
                            .selectAll('circle')
                            .data(this.props.graph.nodes)
                            .enter()
                            .append('circle')
                            .attr('r', 10)
                            .attr('fill', this.circleColor.bind(this))
        this.DOMLinks = this.svg
                            .append('g')
                            .attr('class', 'links')
                            .selectAll('line')
                            .data(this.props.graph.links)
                            .enter()
                            .append('line')
                            .attr('stroke-width', 2)
                            .attr('stroke', this.linkColour.bind(this))
    }

    applySimulationFeatures() {
        //Update nodes and links positions to reflect data updates
        this.simulation.on("tick", this.tickActions.bind(this))

        //draw links
        var linkForce = d3.forceLink(this.props.graph.links)
                            .id(function(d) { return d.name; })

        this.simulation.force('links', linkForce)
    }

    applyDrag() {
        var dragHandler = d3.drag()
                            .on('start', this.dragStart.bind(this))
                            .on('drag', this.dragDrag.bind(this))
                            .on('end', this.dragEnd.bind(this))

        dragHandler(this.DOMNodes)
    }
    
    tickActions() {
        this.DOMNodes
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })

        this.DOMLinks
            .attr('x1', function(d) { return d.source.x;})
            .attr('y1', function(d) { return d.source.y;})
            .attr('x2', function(d) { return d.target.x;})
            .attr('y2', function(d) { return d.target.y;})
    }

    dragStart(d) {
        if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x
        d.fy = d.y
    }

    dragDrag(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
    }

    dragEnd(d) {
        if (!d3.event.active) this.simulation.alphaTarget(0);
        d.fx = null
        d.fy = null
    }  
    
    circleColor(d) {
        if (d.sex === 'M') return 'blue'
        else return 'pink'
    }

    linkColour(d) {
        if (d.type === 'E') return 'red'
        else return 'green'
    }
    
    render() {
        return (
            <svg    ref={node => this.node = node}
                    width={this.props.dimensions.width} 
                    height={this.props.dimensions.height}>
            </svg>
        )
    }
}
export default ForceGraph