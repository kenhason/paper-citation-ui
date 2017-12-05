/*global d3*/
// Tutorial: http://www.puzzlr.org/force-graphs-with-d3/
import React, { Component } from 'react'
import './ForceGraph.css'
import { PaperInfoWindow } from '../'
import APIManager from '../../utils/APIManager'

class ForceGraph extends Component {
    constructor() {
        super() 
        this.state = {
            defaultCapacity: 100,
            nodes: [],
            selectedPaper: -1,
            dataReady: false
        }
        console.log("hello from force graph")
    }    

    componentDidMount() {
        this.getData() 
    }

    getData() {
        let body = {
            "statements": [
                {
                    "statement": "match (n: Paper) where n.topicLabel={topic} and n.cited > 0 return {id: id(n), title: n.title, cited: n.cited} order by n.cited desc limit 100",
                    "parameters": {
                        "topic": this.props.selectedTopic
                    }
                }
            ]
        };

        APIManager.queryNeo4j(body, (err, res) => {
            if (err) {
                console.log(err)
                return
            }
            let nodes = res.results[0].data.map(function(data) { return data.row[0] })
            // console.log(nodes)
            this.setState({
                nodes: nodes,
                dataReady: true
            })
            this.visualize()
            // console.log(this.state.nodes)
        })
    }

    visualize() {
        var width = 960,
            height = 500,
            padding = 1.5, // separation between same-color nodes
            clusterPadding = 6, // separation between different-color nodes
            minRadius = 5,
            maxRadius = 100;

        var m = this.state.nodes.length; // number of distinct clusters

        var color = d3.scale.category10()
            .domain(d3.range(m));

        var radius = d3.scale.linear().range([minRadius, maxRadius])
            .domain([0, d3.max(this.state.nodes, function(d) { return d.cited; })]);

        // The largest node for each cluster.
        var clusters = new Array(m);

        var nodes = this.state.nodes.map(function (node) {
            var i = node.id,
                r = radius(node.cited),
                d = {
                    cluster: i,
                    radius: r,
                    x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
                    y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
                };
            if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
            return d;
        });

        var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(0.02)
            .charge(0)
            .on("tick", tick)
            .start();

        var drag = d3.behavior.drag()
        .on("dragstart", dragstarted)
        .on("drag", dragged)

        var min_zoom = 0.1;
        var max_zoom = 7;
        var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom])

        var svg = d3.select(this.node)
        var g = svg.append("g")

        zoom.on("zoom", function() {
            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        });
         
        svg.call(drag).call(zoom);

        var node = g.selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .style("fill", function (d) { return color(d.cluster); })
            .call(force.drag);

        node.transition()
            .duration(750)
            .delay(function (d, i) { return i * 5; })
            .attrTween("r", function (d) {
                var i = d3.interpolate(0, d.radius);
                return function (t) { return d.radius = i(t); };
            });

        function tick(e) {
            node
                .each(cluster(10 * e.alpha * e.alpha))
                .each(collide(.5))
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        }

        // Move d to be adjacent to the cluster node.
        function cluster(alpha) {
            return function (d) {
                var cluster = clusters[d.cluster];
                if (cluster === d) return;
                var x = d.x - cluster.x,
                    y = d.y - cluster.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + cluster.radius;
                if (l !== r) {
                    l = (l - r) / l * alpha;
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
            return function (d) {
                var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                    nx1 = d.x - r,
                    nx2 = d.x + r,
                    ny1 = d.y - r,
                    ny2 = d.y + r;
                quadtree.visit(function (quad, x1, y1, x2, y2) {
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

        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.event.sourceEvent.preventDefault();
        }
    
        function dragged(e) {
            var t = d3.transform(g.attr("transform")).translate;
            g.attr("transform", "translate(" + [t[0] + d3.event.dx, t[1] + d3.event.dy] + ")")
        }
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

    backToTopicBubbles() {
        d3.select(this.node).remove()
        this.props.onClose()
    }

    render() {
        return (
            <div>
                <button onClick={this.backToTopicBubbles.bind(this)} type="button" className="graph-back-button btn btn-primary">
                    Back
                </button>
                { (this.state.selectedPaper === -1) ? null: <PaperInfoWindow selectedPaper={this.state.selectedPaper} onClose={this.deselectPaper.bind(this)}/> }
                { this.state.dataReady ? null : <i className="keep-center fa fa-cog fa-spin fa-3x fa-fw"></i>}
                <svg ref={node => this.node = node}
                    width={window.innerWidth} 
                    height={window.innerHeight}>
                </svg>
            </div>
        )
    }
}
export default ForceGraph