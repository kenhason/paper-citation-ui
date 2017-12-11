import React, { Component } from 'react'

export default class Index extends Component {
    render() {
        return(
                <div className="container col-12 col-sm-10 col-md-8 offset-sm-1 offset-md-2 pt-5 pt-sm-3">
                    <div className="card">
                        <div className="card-header text-center">
                            <h4 className="card-title">Visualization of Topic Influence</h4>
                            <h6 className="card-subtitle mb-2 text-muted">in Citation Network</h6>
                        </div>
                        <div className="card-block">
                            
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" className="card-link">Card link</a>
                            <a href="#" className="card-link">Another link</a>
                        </div>
                    </div>
                </div>
        )
    }
}