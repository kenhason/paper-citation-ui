import React, { Component } from 'react';
import { Graph, UpdateTopic} from '../../components'
import './Home.css'

class Home extends Component {

  constructor() {
    super()
    this.state = {
      updateTopic: false
    }
  }

  closeUpdateTopic() {
    this.setState({
        updateTopic: false
    })
  }

  openUpdateTopic() {
    this.setState({
        updateTopic: true
    })
  }
  
  render() {
    return (
      <div className="hidden-scrolls">
        {/* <NavBar /> */}
        <button onClick={this.openUpdateTopic.bind(this)} type="button" className="updateTopicButton btn btn-primary">
          Update Topics
        </button>
        { this.state.updateTopic ? <UpdateTopic  onClose={this.closeUpdateTopic.bind(this)}/> : null }
        <Graph />
      </div>
    );
  }
}

export default Home;