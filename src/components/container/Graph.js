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
      topicEvolution: [],
      topicTrend: [],
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
    this.getTopicTrend()
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

  getTopicEvolution() {
    console.log("getting topic evolution ...")
    let body = {
      "statements": [
        {
          "statement": "match (o: Paper) where o.topicLabel={topic} and o.year>0 return o.year as year, count(o.year) as number ORDER BY year ASC",
          "parameters": {
            "topic": this.state.selectedTopic
          }
        }
      ]
    };

    APIManager.queryNeo4j(body, (err, res) => {
      if (err) {
        console.log(err)
        return
      }
      let data = res.results[0].data.map(function (data) { return {year: data.row[0], number: data.row[1]} })
      this.setState({
        topicEvolution: data
      })
    })
  }

  getTopicTrend() {
    console.log("getting topic trend ...")
    let body = {
      "statements": [
        {
          "statement": "match (n: Paper) where n.year > 0 and n.topicLabel <> '' return n.year, n.topicLabel, count(*) as papers order by n.year asc, papers desc"
        }
      ]
    };

    APIManager.queryNeo4j(body, (err, res) => {
      if (err) {
        console.log(err)
        return
      }
      
      let data = res.results[0].data.map(function (data) { return {year: data.row[0], topic: data.row[1], number: data.row[2]} })
      // console.log(data)
      // let topics = []
      // data.forEach((row) => {
      //   if (topics.indexOf(row.topic) === -1)
      //     topics.push(row.topic)
      // })
      
      // let years = []
      // data.forEach((row) => {
      //   if (years.indexOf(row.year) === -1)
      //     years.push(row.year)
      // })

      // let trends = []
      // years.forEach((year) => {
      //   let trend = new Object()
      //   trend['year'] = year
      //   topics.forEach((topic) => {
      //     trend[topic] = 0
      //   })
      //   trends.push(trend)
      // })

      // data.forEach((row) => {
      //   trends.forEach((trend) => {
      //     if (trend['year'] === row.year)
      //       trend[row.topic] = row.number
      //   })
      // })

      this.setState({
        topicTrend: data
      })
      // console.log(this.state.topicTrend)
    })
  }

  selectTopic(topic) {
    this.setState({
      selectedTopic: topic
    })
    this.getPapersData()
    this.getTopicEvolution()
  }

  backToTopicBubbles() {
    this.setState({
      selectedTopic: '',
      papers: [],
      topicEvolution: []
    })
  }

  render() {
    return (
      <div className='graph-container' ref="graph">
        {(this.state.selectedTopic === '') 
          ? <TopicBubbles topics={this.state.topics} trend={this.state.topicTrend} onTopicSelected={this.selectTopic.bind(this)}/> 
          : <ForceGraph topicEvolution={this.state.topicEvolution} papers={this.state.papers}  selectedTopic={this.state.selectedTopic} onClose={this.backToTopicBubbles.bind(this)} graph={this.state.graph} numOfClusters={this.state.numOfClusters} doneProcessing={this.state.doneProcessing} dimensions={this.state.dimensions}/>
        }   
      </div>
    );
  }
}

export default Graph
