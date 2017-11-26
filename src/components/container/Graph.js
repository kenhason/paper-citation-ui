import React, { Component } from 'react';
import './Graph.css'
import { ForceGraph } from '../../components'
// import { findDOMNode } from 'react-dom'

class Graph extends Component {

  constructor() {
    super()

    this.state = {
      dimensions: {
        height: window.innerHeight,
        width: window.innerWidth
      },
      graph: {
        nodes: [
          {"name": "Lillian", "sex": "F"},
          {"name": "Gordon", "sex": "M"},
          {"name": "Sylvester", "sex": "M"},
          {"name": "Mary", "sex": "F"},
          {"name": "Helen", "sex": "F"},
          {"name": "Jamie", "sex": "M"},
          {"name": "Jessie", "sex": "F"},
          {"name": "Ashton", "sex": "M"},
          {"name": "Duncan", "sex": "M"},
          {"name": "Evette", "sex": "F"},
          {"name": "Mauer", "sex": "M"},
          {"name": "Fray", "sex": "F"},
          {"name": "Duke", "sex": "M"},
          {"name": "Baron", "sex": "M"},
          {"name": "Infante", "sex": "M"},
          {"name": "Percy", "sex": "M"},
          {"name": "Cynthia", "sex": "F"}
        ],
        links: [
          {"source": "Sylvester", "target": "Gordon", "type":"A" },
          {"source": "Sylvester", "target": "Lillian", "type":"A" },
          {"source": "Sylvester", "target": "Mary", "type":"A"},
          {"source": "Sylvester", "target": "Jamie", "type":"A"},
          {"source": "Sylvester", "target": "Jessie", "type":"A"},
          {"source": "Sylvester", "target": "Helen", "type":"A"},
          {"source": "Helen", "target": "Gordon", "type":"A"},
          {"source": "Mary", "target": "Lillian", "type":"A"},
          {"source": "Ashton", "target": "Mary", "type":"A"},
          {"source": "Duncan", "target": "Jamie", "type":"A"},
          {"source": "Gordon", "target": "Jessie", "type":"A"},
          {"source": "Sylvester", "target": "Fray", "type":"E"},
          {"source": "Fray", "target": "Mauer", "type":"A"},
          {"source": "Fray", "target": "Cynthia", "type":"A"},
          {"source": "Fray", "target": "Percy", "type":"A"},
          {"source": "Percy", "target": "Cynthia", "type":"A"},
          {"source": "Infante", "target": "Duke", "type":"A"},
          {"source": "Duke", "target": "Gordon", "type":"A"},
          {"source": "Duke", "target": "Sylvester", "type":"A"},
          {"source": "Baron", "target": "Duke", "type":"A"},
          {"source": "Baron", "target": "Sylvester", "type":"E"},
          {"source": "Evette", "target": "Sylvester", "type":"E"},
          {"source": "Cynthia", "target": "Sylvester", "type":"E"},
          {"source": "Cynthia", "target": "Jamie", "type":"E"},
          {"source": "Mauer", "target": "Jessie", "type":"E"}
        ]
      }
    }

    this.resetDimensions = this.resetDimensions.bind(this)
  }

  componentDidMount() {
    //add resize listener
    window.addEventListener('resize', this.resetDimensions);
  }

  resetDimensions() {
    let updatedDims = Object.assign({}, this.state.dimensions)
    updatedDims.width = window.innerWidth
    updatedDims.height = window.innerHeight

    this.setState({
        dimensions: updatedDims
    })
    // console.log(this.state.dimensions)
}

  componentWillUnmount() {
    //remove resize listener
    window.removeEventListener('resize', this.resetDimensions)
  }

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
