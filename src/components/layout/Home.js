import React, { Component } from 'react';
import { Graph, UpdateTopic, NavBar, Index, TopicTrend } from '../../components'
import './Home.css'

class Home extends Component {

  constructor() {
    super()
    this.state = {
      showUpdateTopicLabel: false,
      showIndex: true,
      showNetwork: false,
      showTopicTrend: false
    }
  }

  closeUpdateTopic() {
    this.setState({
      showUpdateTopicLabel: false
    })
  }

  openUpdateTopic() {
    this.setState({
      showUpdateTopicLabel: true
    })
  }

  goToHome() {
    this.setState({
      showIndex: true,
      showNetwork: false
    })
  }

  goToNetwork() {
    this.setState({
      showIndex: false,
      showNetwork: true
    })
  }

  showTopicTrend() {
    this.setState({
      showTopicTrend: true
    })
  }

  closeTopicTrend() {
    this.setState({
      showTopicTrend: false
    })
  }
  
  render() {
    return (
      <div className="hidden-scrolls">
        <NavBar
          showTopicTrendButton={this.state.showNetwork}
          showTopicTrend={this.showTopicTrend.bind(this)}
          goToHome={this.goToHome.bind(this)} 
          goToNetwork={this.goToNetwork.bind(this)}
          showUpdateTopicLabel={this.openUpdateTopic.bind(this)}
        />
        { this.state.showTopicTrend ? <TopicTrend onClose={this.closeTopicTrend.bind(this)}/> : null}
        { this.state.showUpdateTopicLabel ? <UpdateTopic  onClose={this.closeUpdateTopic.bind(this)}/> : null }
        { this.state.showIndex ? <Index />: null}
        { this.state.showNetwork ? <Graph /> : null}
      </div>
    );
  }
}

export default Home;