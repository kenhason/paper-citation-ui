/*global d3*/
import React, { Component } from 'react'
import './TopicBubbles.css'

export default class TopicBubbles extends Component {
    constructor() {
        super()
        this.state = {
            doneVisualized: false
        }
    }

    componentDidMount() {
        if (this.props.topics.length > 0 && this.state.doneVisualized === false)
            this.visualizeCluster()
    }

    componentDidUpdate() {
        if (this.props.topics.length > 0 && this.state.doneVisualized === false)
            this.visualizeCluster()
    }

    visualizeCluster() {
        console.log("visualizing topics ...")
        var width = window.innerWidth,
            height = window.innerHeight,
            padding = 1.5, // separation between same-color circles
            clusterPadding = 20, // separation between different-color circles
            maxRadius = 100,
            minRadius = 35,
            m = this.props.topics.length // number of distinct clusters
        
        var color = d3.scale.category20().domain(d3.range(m));
  
        var radius = d3.scale.linear().range([minRadius, maxRadius])
                        .domain([0, d3.max(this.props.topics, function(d) { return d.size; })]);
    
        // The largest node for each cluster.
        var clusters = new Array(m);
        // console.log(this.state.m)
        var nodes = this.props.topics.map(function(topic, i) {
            var r = radius(topic.size),
                d = { cluster: i, 
                      radius: r, 
                      topic: topic.topic,
                      id: i
                    };
            if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
            return d;
        });
        // console.log(this.nodes)
        
        d3.layout.force()
                    .nodes(nodes)
                    .size([width, height])
                    .gravity(0)
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

        var node = g.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "bubbles")
        .attr("id", (d) => { return d.id })
        .on("click", this.selectTopic.bind(this))

        node.append("circle")
        .attr("r", function(d) { return d.radius; })
        .style("fill", function(d) { return color(d.cluster); })

        node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .text(function (d) { return d.topic; })
        .style("font-size", function(d) { return Math.min(2 * d.radius, (2 * d.radius - 8)/this.getComputedTextLength() * 24)/1.5 + "px"; })

        window.addEventListener('resize', function() {
            svg.attr("width", window.innerWidth).attr("height", window.innerHeight)
        });

        this.setState({
            doneVisualized: true
        })
        
        function tick(e) {
            node
            .each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.5))
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
        }
        
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
        
        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.event.sourceEvent.preventDefault();
        }
    
        function dragged(e) {
            var t = d3.transform(g.attr("transform")).translate;
            g.attr("transform", "translate(" + [t[0] + d3.event.dx, t[1] + d3.event.dy] + ")")
        }
    }

    selectTopic(event) {
        this.props.onTopicSelected(event.topic)
    }

    render() {
        return(
            <div>
                { (this.props.topics.length > 0) ? null : <div className="keep-center"><i className="fa fa-cog fa-spin fa-3x fa-fw"></i></div>}
                <svg ref={node => this.node = node}
                    width={window.innerWidth} 
                    height={window.innerHeight}>
                </svg>
            </div>
        )
    }
}