/*global d3*/
// Tutorial: http://www.puzzlr.org/force-graphs-with-d3/
import React, { Component } from 'react'
import './ForceGraph.css'
import { PaperInfoWindow } from '../'

class ForceGraph extends Component {
    constructor() {
        super() 
        window.addEventListener('resize', this.graphResize.bind(this));
        this.state = {
            selectedPaper: -1,
            graphLoaded: false
        }
    }    

    componentDidUpdate() {
        if (this.props.doneProcessing && !this.state.graphLoaded) {
            this.visualizeCluster()
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.graphResize.bind(this))
    }

    visualizeCluster() {
        this.setState({
            graphLoaded: true
        })
        this.width = this.props.dimensions.width
        this.height = this.props.dimensions.height
        this.padding = 1.5 // separation between same-color circles
        this.clusterPadding = 20 // separation between different-color circles
        this.maxRadius = 25
        this.minRadius = 7

        this.n = this.props.graph.nodes.length // total number of circles
        this.m = this.props.numOfClusters // number of distinct clusters
        
        var color = d3.scale.category20().domain(d3.range(this.m));
  
        this.radius = d3.scale.linear().range([this.minRadius, this.maxRadius])
                        .domain([0, d3.max(this.props.graph.nodes, function(d) { return d.cited; })]);
    
        // The largest node for each cluster.
        this.clusters = new Array(this.m);
        // console.log(this.state.m)
        this.nodes = this.props.graph.nodes.map(function(node) {
            var i = node.cluster,
                r = this.radius(node.cited),
                d = { cluster: i, 
                      radius: r, 
                      topic: node.topicLabel,
                      title: node.title,
                      id: node.id,
                      x: Math.cos(i / this.m * 2 * Math.PI) * 200 + this.width / 2 + Math.random(),
                      y: Math.sin(i / this.m * 2 * Math.PI) * 200 + this.height / 2 + Math.random()
                    };
            if (!this.clusters[i] || (r > this.clusters[i].radius)) this.clusters[i] = d;
            return d;
        }, this);
        
        this.force = d3.layout.force()
                    .nodes(this.nodes)
                    .linkStrength(0)
                    .links(this.props.graph.links)
                    .size([this.width, this.height])
                    .gravity(0)
                    .charge(0)
                    .on("tick", this.tick.bind(this))
                    .start();
        
        var drag = d3.behavior.drag()
        .on("dragstart", this.dragstarted.bind(this))
        .on("drag", this.dragged.bind(this))

        var min_zoom = 0.1;
        var max_zoom = 7;
        var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])

        this.svg = d3.select(this.node)
        this.g = this.svg.append("g")

        zoom.on("zoom", function() {
           this.g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }.bind(this));
        
        this.svg.call(drag).call(zoom);

        this.link = this.g.selectAll(".link")
        .data(this.props.graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", function (d) {
          return  0.4;
        })
        .attr("stroke", "#ccc")
        .attr("class", "link");

        this.node = this.g.selectAll(".node")
        .data(this.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("id", (d) => { return d.id })
        .on("click", this.selectPaper.bind(this))

        this.circle = this.node.append("circle")
        .attr("r", function(d) { return d.radius; })
        .style("fill", function(d) { return color(d.cluster); })
    }

    graphResize() {
        this.svg.attr("width", window.innerWidth).attr("height", window.innerHeight)
    }

    // Resolves collisions between d and all other circles.
    collide(alpha) {
        var quadtree = d3.geom.quadtree(this.nodes);
        return function(d) {
            var r = d.radius + this.maxRadius + Math.max(this.padding, this.clusterPadding),
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? this.padding : this.clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            }.bind(this));
        };
    }
    
    cluster(alpha) {
        return function(d) {
            var cluster = this.clusters[d.cluster],
            k = 1;
            
            // For cluster nodes, apply custom gravity.
            if (cluster === d) {
                cluster = {x: this.width / 2, y: this.height / 2, radius: -d.radius};
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

    tick(e) {
        this.circle
        .each(this.cluster(10 * e.alpha * e.alpha).bind(this))
        .each(this.collide(.5).bind(this))
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
        
        this.link.attr("x1", function (d) {
            return d.source.x;
        })
        this.link.attr("y1", function (d) {
            return d.source.y;
        })
        this.link.attr("x2", function (d) {
            return d.target.x;
        })
        this.link.attr("y2", function (d) {
            return d.target.y;
        });
    }

    dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.event.sourceEvent.preventDefault();
    }

    dragged(e) {
        var t = d3.transform(this.g.attr("transform")).translate;
        this.g.attr("transform", "translate(" + [t[0] + d3.event.dx, t[1] + d3.event.dy] + ")")
    }

    selectPaper(event) {
        this.setState({
            selectedPaper: event.id
        })      
    }

    deselectPaper() {
        this.setState({
            selectedPaper: -1
        })
    }

    render() {
        return (
            <div>
                { (this.state.selectedPaper === -1) ? null: <PaperInfoWindow selectedPaper={this.state.selectedPaper} onClose={this.deselectPaper.bind(this)}/> }
                { this.props.doneProcessing ? null : <i className="keep-center fa fa-cog fa-spin fa-3x fa-fw"></i>}
                <svg ref={node => this.node = node}
                    width={this.props.dimensions.width} 
                    height={this.props.dimensions.height}>
                </svg>
            </div>
        )
    }
}
export default ForceGraph