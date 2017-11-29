/*global d3*/

// Tutorial: http://www.puzzlr.org/force-graphs-with-d3/
import React, { Component } from 'react'
// import * as d3 from 'd3'
import './ForceGraph.css'

class ForceGraph extends Component {    

    constructor() {
        super()
        this.visualizeCluster = this.visualizeCluster.bind(this)
        // this.tick = this.tick.bind(this)
        // this.cluster = this.cluster.bind(this)
        // this.collide = this.collide.bind(this)
    }

    componentDidMount() {
        // this.visualizeGraph()
    }

    componentDidUpdate() {
        if (this.props.doneProcessing === true) {
            console.log("done processing");
            console.log(this.props.numOfClusters)
            this.visualizeCluster()
        }
    }

    visualizeCluster() {
        console.log("Hello from Visualize Cluster")
        var width = this.props.dimensions.width,
        height = this.props.dimensions.height,
        padding = 1.5, // separation between same-color circles
        clusterPadding = 20, // separation between different-color circles
        maxRadius = 25,
        minRadius = 7;

        var n = this.props.graph.nodes.length, // total number of circles
        m = this.props.numOfClusters; // number of distinct clusters
        console.log(m, n)

        var color = d3.scale.category20().domain(d3.range(m));
  
        var radius = d3.scale.linear().range([minRadius, maxRadius]);
        radius.domain([0, d3.max(this.props.graph.nodes, function(d) { return d.cited; })]);
    
        // The largest node for each cluster.
        var clusters = new Array(m);
        console.log(this.clusters)

        var width = this.props.dimensions.width,
        height = this.props.dimensions.height;
        

        var nodes = this.props.graph.nodes.map(function(node) {
            var i = node.cluster,
                r = radius(node.cited),
                d = { cluster: i, 
                      radius: r, 
                      topic: node.topicLabel ,
                      x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
                      y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
                    };
            if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
            return d;
        });
        
        var force = d3.layout.force()
                    .nodes(nodes)
                    .linkStrength(0)
                    .links(this.props.graph.links)
                    .size([this.props.dimensions.width, this.props.dimensions.height])
                    .gravity(0)
                    .charge(0)
                    .on("tick", tick)
                    .start();
        
        var svg = d3.select(this.node)

        var link = svg.selectAll(".link")
        .data(this.props.graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", function (d) {
          return  0.4;
        })
        .attr("stroke", "#ccc")
        .attr("class", "link");

        var node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(force.drag)

        var circle = node.append("circle")
        .attr("r", function(d) { return d.radius; })
        .style("fill", function(d) { return color(d.cluster); })
  
        function tick(e) {
            console.log(circle)
            circle
            .each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.5))
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    
            link.attr("x1", function (d) {
            return d.source.x;
            })
            link.attr("y1", function (d) {
            return d.source.y;
            })
            link.attr("x2", function (d) {
            return d.target.x;
            })
            link.attr("y2", function (d) {
            return d.target.y;
            });
        }

        function cluster(alpha) {
            return function(d) {
                var cluster = clusters[d.cluster],
                    k = 1;
    
                // For cluster nodes, apply custom gravity.
                if (cluster === d) {
                cluster = {x: width / 2, y: height / 2, radius: -d.radius};
                k = .1 * Math.sqrt(d.radius);
                }
    
                var x = d.x - cluster.x,
                    y = d.y - cluster.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + cluster.radius;
                if (l !== r) {
                l = (l - r) / l * alpha * k;
                d.x -= x *= l;
                d.y -= y *= l;
                cluster.x += x;
                cluster.y += y;
                }
            };
        }

          // Resolves collisions between d and all other circles.
          function collide(alpha) {
            var quadtree = d3.geom.quadtree(nodes);
            return function(d) {
                var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            };
        }
    }

    

    
    
    

    // visualizeGraph() {
    //     if (this.props.graph != null) {
    //         console.log(this.props.graph)
    //         this.svg = d3.select(this.node)
    //         this.inializeNodesAndLinksInDOM()
    //         this.initializeSimulation()
    //         this.applySimulationFeatures()
    //         this.applyDrag()
    //     }
    // }  

    // initializeSimulation() {
    //     this.simulation = d3.forceSimulation()
    //                         .nodes(this.props.graph.nodes)
    //                         .force('charge', d3.forceManyBody())
    //                         .force('center', d3.forceCenter(this.props.dimensions.width/2, this.props.dimensions.height/2))
    // }

    // inializeNodesAndLinksInDOM() {
    //     this.DOMNodes = this.svg
    //                         .append('g')
    //                         .attr('class', 'nodes')
    //                         .selectAll('circle')
    //                         .data(this.props.graph.nodes)
    //                         .enter()
    //                         .append('circle')
    //                         .attr('r', 10)
    //                         .attr('fill', circleColor.bind(this))
    //     this.DOMLinks = this.svg
    //                         .append('g')
    //                         .attr('class', 'links')
    //                         .selectAll('line')
    //                         .data(this.props.graph.links)
    //                         .enter()
    //                         .append('line')
    //                         .attr('stroke-width', 2)
    //                         .attr('stroke', this.linkColour.bind(this))
    // }

    // applySimulationFeatures() {
    //     //Update nodes and links positions to reflect data updates
    //     this.simulation.on("tick", this.tickActions.bind(this))

    //     //draw links
    //     var linkForce = d3.forceLink(this.props.graph.links)
    //                         .id(function(d) { return d.id; })
    //                         .distance(100).strength(1)

    //     this.simulation.force('links', linkForce)
    // }

    // applyDrag() {
    //     var dragHandler = d3.drag()
    //                         .on('start', this.dragStart.bind(this))
    //                         .on('drag', this.dragDrag.bind(this))
    //                         .on('end', this.dragEnd.bind(this))

    //     dragHandler(this.DOMNodes)
    // }
    
    // tickActions() {
    //     this.DOMNodes
    //         .attr("cx", function(d) { return d.x; })
    //         .attr("cy", function(d) { return d.y; })

    //     this.DOMLinks
    //         .attr('x1', function(d) { return d.source.x;})
    //         .attr('y1', function(d) { return d.source.y;})
    //         .attr('x2', function(d) { return d.target.x;})
    //         .attr('y2', function(d) { return d.target.y;})
    // }

    // dragStart(d) {
    //     if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    //     d.fx = d.x
    //     d.fy = d.y
    // }

    // dragDrag(d) {
    //     d.fx = d3.event.x
    //     d.fy = d3.event.y
    // }

    // dragEnd(d) {
    //     if (!d3.event.active) this.simulation.alphaTarget(0);
    //     d.fx = null
    //     d.fy = null
    // }  
    
    // circleColor(d) {
    //     return 'blue'
    // }

    // linkColour(d) {
    //     return 'red'
    // }
    
    render() {
        return (
            <svg ref={node => this.node = node}
                width={this.props.dimensions.width} 
                height={this.props.dimensions.height}>
            </svg>
        )
    }
}
export default ForceGraph