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
      graph: null
    }

    // this.resetDimensions = this.resetDimensions.bind(this)
  }

  componentWillMount() {
    let auth = btoa("neo4j:Neo4j");
    let url = "http://localhost:7474/db/data/cypher",
    headers = {
      'accept': 'application/json',
      'X-Stream': 'true',
      'authorization': 'Basic ' + auth
    },
    body =  {
      "query" : "match path = (p: Paper)-[: CITES]-(: Paper) where id(p) < 650 and id(p) > 600 unwind nodes(path) as n unwind rels(path) as r return {nodes: collect(distinct {id: id(n), title: n.title, cited: n.cited, topics: n.topics}), links: collect(DISTINCT {source: id(startNode(r)), target: id(endNode(r))})}"
    };
    
    APIManager.post(url, headers, body, (err, res) => {
      if (err)
        alert(err)

      let updatedGraph = Object.assign({}, this.state.graph)
      updatedGraph = res.data[0][0]
      this.setState({
        graph: updatedGraph
      })
      console.log(this.state.graph)
    })
  }

  // componentDidMount() {
  //   //add resize listener
  //   // window.addEventListener('resize', this.resetDimensions);
  // }

//   resetDimensions() {
//     let updatedDims = Object.assign({}, this.state.dimensions)
//     updatedDims.width = document.documentElement.clientWidth
//     updatedDims.height = document.documentElement.clientHeight

//     this.setState({
//         dimensions: updatedDims
//     })
//     // console.log(this.state.dimensions)
// }

  // componentWillUnmount() {
  //   //remove resize listener
  //   window.removeEventListener('resize', this.resetDimensions)
  // }

  render() {
    return (
      <div className='graph-container'>
        {/* <BarChart  data={[2,4,2,8]} dimensions={this.state.dimensions}/> */}
        <ForceGraph graph={this.state.graph} dimensions={this.state.dimensions}/>
      </div>
    );
  }
}

export default Graph
