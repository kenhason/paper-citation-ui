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
            graph: {},
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
                    "statement": "match path = (p: Paper)-[: CITES]-(: Paper) where id(p) < 1000 and p.topicLabel={topic} unwind nodes(path) as n unwind rels(path) as r return {nodes: collect(distinct {id: id(n), title: n.title, cited: n.cited, topics: n.topics}), links: collect(DISTINCT {source: id(startNode(r)), target: id(endNode(r))})}",
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
            console.log(res)
            this.setState({
                graph: this.transformLinkId(res.results[0].data[0].row[0]),
                dataReady: true
            })
            this.visualizeCluster()
            console.log(this.state.graph)
        })
    }

    transformLinkId(graph) {
        var nodeTable = {};
        graph.nodes.forEach(function(node, i) {
          nodeTable[node.id] = i
        })
        graph.links.forEach(function(link) {
          link.source = nodeTable[link.source]
          link.target = nodeTable[link.target]
        })
        return graph
    }

    visualizeCluster() {
        var graph = Object.assign({}, this.state.graph)
        var svg = d3.select(this.node).append("g")
        d3.layout.force()
        .nodes(graph.nodes)
        .linkDistance(20)
        .linkStrength(1)
        .links(graph.links)
        .size([window.innerWidth, window.innerHeight])
        .on("tick", tick)
        .start();
    
        var link = svg.selectAll(".link")
                        .data(graph.links)
                        .enter().append("line")
                        .attr("class", "link");
        
        var node = svg.selectAll(".node")
                        .data(graph.nodes)
                        .enter().append("circle")
                        .attr("class", "node")
                        .attr("r", 4.5);

        function tick() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            
            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }
    }

    tick(e) {
        this.node
        .each(this.cluster(10 * e.alpha * e.alpha).bind(this))
        .each(this.collide(.5).bind(this))
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
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