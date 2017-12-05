/*global d3*/
import React, { Component } from 'react'
import APIManager from '../../utils/APIManager'
import './TopicBubbles.css'

export default class TopicBubbles extends Component {
    constructor() {
        super()
        this.getData()
        this.state = {
            topics: [],
            sample: '',
            doneProcessing: false
        }
    }

    componentDidUpdate() {
        if (this.state.topics.length > 0){
            console.log("done")
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.graphResize.bind(this))
    }

    graphResize() {
        if (this.svg !== null)
            this.svg.attr("width", window.innerWidth).attr("height", window.innerHeight)
    }

    getData() {
        let body =  {
            "statements": [
                {
                    "statement": "match (n: Paper) where EXISTS(n.topicLabel) return distinct(n.topicLabel), count(*)"
                }
            ]
          };
        APIManager.queryNeo4j(body, (err, res) => {
            if (err) {
                console.log(err)
                return
            }
            // console.log(res)
            let results = []
            res.results[0].data.forEach((data) => {
                results.push({topic: data.row[0], size: data.row[1]})
            })
            this.setState({
                topics: results,
                doneProcessing: true
            })
            this.visualizeCluster()
        })
    }

    visualizeCluster() {
        this.width = this.props.dimensions.width
        this.height = this.props.dimensions.height
        this.padding = 1.5 // separation between same-color circles
        this.clusterPadding = 20 // separation between different-color circles
        this.maxRadius = 100
        this.minRadius = 35

        this.n = this.state.topics.length // total number of circles
        this.m = this.state.topics.length // number of distinct clusters
        
        var color = d3.scale.category20().domain(d3.range(this.m));
  
        this.radius = d3.scale.linear().range([this.minRadius, this.maxRadius])
                        .domain([0, d3.max(this.state.topics, function(d) { return d.size; })]);
    
        // The largest node for each cluster.
        this.clusters = new Array(this.m);
        // console.log(this.state.m)
        this.nodes = this.state.topics.map(function(topic, i) {
            var r = this.radius(topic.size),
                d = { cluster: i, 
                      radius: r, 
                      topic: topic.topic,
                      id: i
                    };
            if (!this.clusters[i] || (r > this.clusters[i].radius)) this.clusters[i] = d;
            return d;
        }, this);
        console.log(this.nodes)
        
        this.force = d3.layout.force()
                    .nodes(this.nodes)
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

        this.node = this.g.selectAll(".node")
        .data(this.nodes)
        .enter()
        .append("g")
        .attr("class", "bubbles")
        .attr("id", (d) => { return d.id })
        .on("click", this.selectTopic.bind(this))

        this.circle = this.node.append("circle")
        .attr("r", function(d) { return d.radius; })
        .style("fill", function(d) { return color(d.cluster); })

        this.node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .text(function (d) { return d.topic; })
        .style("font-size", function(d) { return Math.min(2 * d.radius, (2 * d.radius - 8)/this.getComputedTextLength() * 24)/1.5 + "px"; })

        window.addEventListener('resize', this.graphResize.bind(this));
    }

    tick(e) {
        this.node
        .each(this.cluster(10 * e.alpha * e.alpha).bind(this))
        .each(this.collide(.5).bind(this))
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
    }

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

    dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.event.sourceEvent.preventDefault();
    }

    dragged(e) {
        var t = d3.transform(this.g.attr("transform")).translate;
        this.g.attr("transform", "translate(" + [t[0] + d3.event.dx, t[1] + d3.event.dy] + ")")
    }

    selectTopic(event) {
        this.force.on('tick', null)
        this.props.onTopicSelected(event.topic)
        console.log(event.topic)
    }

    render() {
        return(
            <div>
                {/* <i className="keep-center fa fa-cog fa-spin fa-3x fa-fw"></i> */}
                { this.state.doneProcessing ? null : <i className="keep-center fa fa-cog fa-spin fa-3x fa-fw"></i>}
                <svg ref={node => this.node = node}
                    width={window.innerWidth} 
                    height={window.innerHeight}>
                </svg>
            </div>
        )
    }
}