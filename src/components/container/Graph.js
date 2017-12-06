import React, { Component } from 'react';
import './Graph.css'
import { ForceGraph, TopicBubbles} from '../../components'
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
      topics: [],
      papers: [],
      numOfClusters: 0,
      topicLabels1: [],
      topicLabels2: [],
      topicLabels3: [],
      topicLabels4: [],
      doneProcessing: false,
      selectedTopic: '',
      numOfTopPapers: 100
    }

    this.getTopicsData()
  }

  getTopicsData() {
    console.log("getting topics ...")
    let body = {
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
    
      let results = []
      res.results[0].data.forEach((data) => {
        results.push({ topic: data.row[0], size: data.row[1] })
      })
      this.setState({
        topics: results
      })
    })
  }

  getPapersData() {
    console.log("getting papers ...")
    let body = {
      "statements": [
        {
          "statement": "match (n: Paper) where n.topicLabel={topic} and n.cited > 0 return {id: id(n), title: n.title, cited: n.cited} order by n.cited desc limit {topSize}",
          "parameters": {
            "topic": this.state.selectedTopic,
            "topSize": this.state.numOfTopPapers
          }
        }
      ]
    };

    APIManager.queryNeo4j(body, (err, res) => {
      if (err) {
        console.log(err)
        return
      }
      let papers = res.results[0].data.map(function (data) { return data.row[0] })
      this.setState({
        papers: papers
      })
    })
  }

  selectTopic(topic) {
    this.setState({
      papers: [],
      selectedTopic: topic
    })
    this.getPapersData()
  }

  backToTopicBubbles() {
    this.setState({
      selectedTopic: ''
    })
  }

  render() {
    return (
      <div className='graph-container' ref="graph">
        {(this.state.selectedTopic === '') 
          ? <TopicBubbles topics={this.state.topics} onTopicSelected={this.selectTopic.bind(this)}/> 
          : <ForceGraph papers={this.state.papers}  selectedTopic={this.state.selectedTopic} onClose={this.backToTopicBubbles.bind(this)} graph={this.state.graph} numOfClusters={this.state.numOfClusters} doneProcessing={this.state.doneProcessing} dimensions={this.state.dimensions}/>
        }   
      </div>
    );
  }
}

export default Graph
