import React, { Component } from 'react';
import './Graph.css'
import { ForceGraph } from '../../components'
import APIManager from '../../utils/APIManager'

class Graph extends Component {
  
  constructor() {
    super()

    this.state = {
      dimensions: {
        height: document.documentElement.clientHeight,
        width: document.documentElement.clientWidth
      },
      graph: null,
      numOfClusters: 0,
      topicLabels1: [],
      topicLabels2: [],
      topicLabels3: [],
      topicLabels4: [],
      doneProcessing: false
    }

    this.transformLinkId = this.transformLinkId.bind(this)
    this.getResources = this.getResources.bind(this)
    this.extractTopicLabel = this.extractTopicLabel.bind(this)
    this.loadTopicLabels = this.loadTopicLabels.bind(this)
    this.saveTopicLabelsToMemory = this.saveTopicLabelsToMemory.bind(this)
    this.updateTopicLabel = this.updateTopicLabel.bind(this)
    this.assignClusters = this.assignClusters.bind(this)

    this.getResources()
  }

  getResources() {
    let body =  {
      "statements": [
        {
            "statement": "match path = (p: Paper)-[: CITES]-(: Paper) where id(p) < {maxId} and id(p) > {minId} unwind nodes(path) as n unwind rels(path) as r return {nodes: collect(distinct {id: id(n), title: n.title, cited: n.cited, topics: n.topics}), links: collect(DISTINCT {source: id(startNode(r)), target: id(endNode(r))})}",
            "parameters": {
                "minId": 600,
                "maxId": 650
            }
        }
      ]
    };
    
    APIManager.queryNeo4j(body, (err, res) => {
      if (err) {
        alert(err)
      }
        
      let updatedGraph = Object.assign({}, this.state.graph)
      updatedGraph = res.results[0].data[0].row[0]
      this.setState({
        graph: updatedGraph
      })
      this.transformLinkId()
      this.extractTopicLabel()
      this.loadTopicLabels(1, 4)
    })
  }

  transformLinkId() {
    let graph = Object.assign({}, this.state.graph)
    var nodeTable = {};
    graph.nodes.forEach(function(node, i) {
      nodeTable[node.id] = i
    })
    graph.links.forEach(function(link) {
      link.source = nodeTable[link.source]
      link.target = nodeTable[link.target]
    })
  
    let updatedGraph = Object.assign({}, this.state.graph)
    updatedGraph = graph
    this.setState({
      graph: updatedGraph
    })
  }

  extractTopicLabel() {
    let nodes = Object.assign([], this.state.graph.nodes)
    nodes.forEach(function(node) {
      var topics = node.topics.trim().split(" ")
      var maxProb = 0.0, topicNumber = -1;
      topics.forEach(function(topic, index) {
        var topicProb = parseFloat(topic)
        if (topicProb > maxProb) {
          maxProb = topicProb
          topicNumber = index
        }
      })
      node['topicNumber'] = topicNumber
    })
    let updatedGraph = Object.assign({}, this.state.graph)
    updatedGraph.nodes = nodes
    this.setState({
      graph: updatedGraph
    })
  }

  loadTopicLabels(startFileIndex, endFileIndex) {
    APIManager.getFile("/PaperLDA"+startFileIndex+".topicLabels", (err, res) => {
      var response = res.trim();
      this.saveTopicLabelsToMemory(startFileIndex, response)
      startFileIndex += 1;
      if (startFileIndex <= endFileIndex) this.loadTopicLabels(startFileIndex, endFileIndex);
      if (startFileIndex === endFileIndex+1) this.updateTopicLabel()
    })
  }

  saveTopicLabelsToMemory(fileIndex, response) {
    var lines = response.split("\n");
    if (fileIndex === 1) {
      let labels = Object.assign([], this.state.topicLabels1)
      lines.forEach(function(line) {
        var label = line.split(": ")[1]
        labels.push(label.replace(/_/g, ' '));
      });
      this.setState({
        topicLabels1: labels
      })
    }
    if (fileIndex === 2) {
      let labels = Object.assign([], this.state.topicLabels2)
      lines.forEach(function(line) {
        var label = line.split(": ")[1]
        labels.push(label.replace(/_/g, ' '));
      });
      this.setState({
        topicLabels2: labels
      })
    }
    if (fileIndex === 3) {
      let labels = Object.assign([], this.state.topicLabels3)
      lines.forEach(function(line) {
        var label = line.split(": ")[1]
        labels.push(label.replace(/_/g, ' '));
      });
      this.setState({
        topicLabels3: labels
      })
    }
    if (fileIndex === 4) {
      let labels = Object.assign([], this.state.topicLabels4)
      lines.forEach(function(line) {
        var label = line.split(": ")[1]
        labels.push(label.replace(/_/g, ' '));
      });
      this.setState({
        topicLabels4: labels
      })
    }
  }

  updateTopicLabel() {
    let nodes = Object.assign([], this.state.graph.nodes),
    topicLabels1 = Object.assign([], this.state.topicLabels1),
    topicLabels2 = Object.assign([], this.state.topicLabels2),
    topicLabels3 = Object.assign([], this.state.topicLabels3),
    topicLabels4 = Object.assign([], this.state.topicLabels4);
    
    nodes.forEach(function(node) {
      if (node.id >= 0 && node.id < 500000) {
        node['topicLabel'] = topicLabels1[parseInt(node.topicNumber, 10)]
      }
  
      if (node.id >= 500000 && node.id < 1000000) {
        node['topicLabel'] = topicLabels2[parseInt(node.topicNumber, 10)]
      }
  
      if (node.id >= 1000000 && node.id < 1500000) {
        node['topicLabel'] = topicLabels3[parseInt(node.topicNumber, 10)]
      }
  
      if (node.id >= 1500000) {
        node['topicLabel'] = topicLabels4[parseInt(node.topicNumber, 10)]
      }
    })
    let newGraph = Object.assign({}, this.state.graph)
    newGraph.nodes = nodes;
    this.setState({
      graph: newGraph
    })
    this.assignClusters()

    // console.log(this.state.graph)
  
    // visualizeGraph_backup()
    // visualizeGraph()
    // mbostock7881887()
    // visualizeCluster()
  }

  assignClusters() {
    var count = 0,
    nodes = Object.assign([], this.state.graph.nodes),
    distinctSet = {};

    nodes.forEach(function(node) {
      if (!distinctSet.hasOwnProperty(node.topicLabel)) {
        distinctSet[node.topicLabel] = count
        count += 1
      }
      node['cluster'] = distinctSet[node.topicLabel]
    })

    let newGraph = Object.assign({}, this.state.graph)
    newGraph.nodes = nodes
    this.setState({
      graph: newGraph,
      numOfClusters: count,
      doneProcessing: true
    })
    // console.log(this.state.graph)
  }

  componentDidMount() {
    console.log(this.refs.graph.getBoundingClientRect().width)
  }

  render() {
    return (
      <div className='graph-container' ref="graph">
        <ForceGraph graph={this.state.graph} numOfClusters={this.state.numOfClusters} doneProcessing={this.state.doneProcessing} dimensions={this.state.dimensions}/>
      </div>
    );
  }
}

export default Graph
