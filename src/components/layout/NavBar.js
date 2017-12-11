//Reference: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sidenav
import React, { Component } from 'react';
import "./NavBar.css"

class NavBar extends Component {
  openNav() {
    this.refs.navButton.style.opacity = 0
    this.refs.nav.style.width = "250px"
  }

  closeNav() {
    this.refs.nav.style.width = "0"
    this.refs.navButton.style.opacity = 1
  }

  goToHome() {
    this.closeNav()
    this.props.goToHome()
  }

  goToNetwork() {
    this.closeNav()
    this.props.goToNetwork()
  }

  showUpdateTopicLabel() {
    this.closeNav()
    this.props.showUpdateTopicLabel()
  }

  showTopicTrend() {
    this.closeNav()
    this.props.showTopicTrend()
  }

  render() {
    return (
      <div>
        <div ref="nav" className="sidenav">
          <div className="d-flex justify-content-end bg-faded">
            <div className="p-2 mr-auto text-center"><strong>Citation Network</strong></div>
            <div className="p-2 back-button" onClick={this.closeNav.bind(this)}>
              <i className="fa fa-chevron-left fa-lg" aria-hidden="true"></i>
            </div>
          </div>
          <hr className="mt-0"/>
          <a onClick={this.goToHome.bind(this)}><i className="fa fa-home fa-lg pr-3" aria-hidden="true"></i> Home</a>
          <a onClick={this.goToNetwork.bind(this)}><i className="fa fa-globe fa-lg pr-3" aria-hidden="true"></i> Network</a>
          {this.props.showTopicTrendButton ? <a onClick={this.showTopicTrend.bind(this)}><i className="fa fa-line-chart fa-lg pr-3" aria-hidden="true"></i>Show Topic Trends</a> : null}
          <a onClick={this.showUpdateTopicLabel.bind(this)}><i className="fa fa-wrench fa-lg pr-3" aria-hidden="true"></i>Update Topic Label</a>
        </div>
        <span ref="navButton" className="nav-button m-2" onClick={this.openNav.bind(this)}>
          <i className="fa fa-bars p-2" aria-hidden="true"></i>
        </span>
      </div>
    );
  }
}

export default NavBar
