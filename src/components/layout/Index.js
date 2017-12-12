import React, { Component } from 'react'

export default class Index extends Component {
    render() {
        return(
                <div className="container col-12 col-sm-10 col-md-8 offset-sm-1 offset-md-2 py-5 py-sm-3">
                    <div className="card">
                        <div className="card-header text-center">
                            <h4 className="card-title">Visualization of Topic Influence</h4>
                            <h6 className="card-subtitle mb-2 text-muted">in <strong>Citation Network</strong></h6>
                        </div>
                        <div className="card-block">
                            <div className="card mb-3">
                                <div className="card-block bg-faded">
                                    <h4 className="card-title"><strong>Objectives</strong></h4>
                                    <ul className="text-muted">
                                        <li>Display citation network in the way that increases user’s cognition and comprehension about the network and its related information.</li>
                                        <li>Show how topics of scientific paper influence or being influenced within the network.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-block bg-faded">
                                    <h4 className="card-title pb-4"><strong>Contact</strong></h4>
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="card">
                                                <img className="card-img-top" style={{width: '100%', height: 'auto'}} src="img/phuc.jpeg" alt="Card image cap"/>
                                                    <div className="card-block">
                                                        <h4 className="card-title"><strong>Prof. Phuc Do</strong></h4>
                                                        <a className="card-text text-muted">Advisor</a><br/>
                                                        <a className="card-text text-muted">phucdo@uit.edu.vn</a>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="card">
                                                <img className="card-img-top" style={{width: '100%', height: 'auto'}}  src="img/kiet.png" alt="Card image cap"/>
                                                    <div className="card-block">
                                                        <h4 className="card-title"><strong>Kiet Huynh</strong></h4>
                                                        <a className="card-text text-muted">Undergraduate</a><br/>
                                                        <a className="card-text text-muted">kenhason@gmail.com</a>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="card">
                                                <img className="card-img-top" style={{width: '100%', height:'auto'}}  src="img/huy.jpg" alt="Card image cap"/>
                                                    <div className="card-block">
                                                        <h4 className="card-title"><strong>Huy Le</strong></h4>
                                                        <a className="card-text text-muted">Undergraduate</a><br/>
                                                        <a className="card-text text-muted">lhvhuy@gmail.com</a>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}