/*global $*/
import React, { Component } from 'react'
import APIManager from '../../utils/APIManager'
import { setInterval, clearInterval } from 'timers';

export default class UpdateTopic extends Component {

    constructor() {
        super()
        this.state = {
            nodes: [],
            timerInSecond: 0,
            latestUpdatedId: -1,
            dbMaxId: -1,
            currentNode: {
                id: -1,
                topics: ''
            },
            updatedId: -1,
            isRunning: false,
            topicLabels1: [],
            topicLabels2: [],
            topicLabels3: [],
            topicLabels4: []
        }
        this.timer = setInterval(this.tick.bind(this), 1000)
        this.loadTopicLabels(1, 4)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    loadTopicLabels(startFileIndex, endFileIndex) {
        APIManager.getFile("/PaperLDA"+startFileIndex+".topicLabels", (err, res) => {
          var response = res.trim();
          this.saveTopicLabelsToMemory(startFileIndex, response)
          startFileIndex += 1;
          if (startFileIndex <= endFileIndex) this.loadTopicLabels(startFileIndex, endFileIndex);
          if (startFileIndex === endFileIndex+1) this.getMaxId()
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

    getTopicLabel(id, topicNumber) {
        if (id < 500000) {
            return this.state.topicLabels1[topicNumber]
        } else if (id < 1000000) {
            return this.state.topicLabels2[topicNumber]
        } else if (id < 1500000) {
            return this.state.topicLabels3[topicNumber]
        } else {
            return this.state.topicLabels4[topicNumber]
        }    
    }

    getMaxId() {
        let body =  {
            "statements": [
                {
                    "statement": "MATCH (n:Paper) RETURN Max(id(n))"
                },
                {
                    "statement": "MATCH (n: Paper) where n.topicLabel <> '' return max(id(n))"
                }
            ]
          };
        APIManager.queryNeo4j(body, (err, res) => {
            if (err) {
                console.log(err)
                return
            }
            this.setState({
                dbMaxId: res.results[0].data[0].row[0],
                latestUpdatedId: res.results[1].data[0].row[0],
                isRunning: true
            })
            this.getPaper(this.state.latestUpdatedId)
        })
    }

    updateTopicLabelProperty(id, topicLabel) {
        let body =  {
            "statements": [
              {
                  "statement": "match (p: Paper) where id(p) = {id} set p.topicLabel = {topicLabel}",
                  "parameters": {
                      "id": id,
                      "topicLabel": topicLabel
                  }
              }
            ]
          };
        APIManager.queryNeo4j(body, (err, res) => {
            if (err) {
                console.log(err)
                return
            }
            this.setState({
                updatedId: id
            })
        })
    }

    getPaper(id) {
        if(id <= this.state.dbMaxId && this.state.isRunning === true) {
            let body =  {
                "statements": [
                  {
                      "statement": "match (p: Paper) where id(p) = {id} return {id: id(p), topics: p.topics}",
                      "parameters": {
                          "id": id
                      }
                  }
                ]
              };
            APIManager.queryNeo4j(body, (err, res) => {
                if (err) {
                    console.log(err)
                    return
                }
                let node = res.results[0].data[0].row[0]
                if (node !== null) {
                    this.setState({
                        currentNode: node
                    })
                    if (node.topics !== '' && node.topics !== null) {
                        let topicNumber = this.extractTopicNumber(node)
                        let topicLabel = this.getTopicLabel(node.id, topicNumber)
                        this.updateTopicLabelProperty(node.id, topicLabel)
                    }
                }
                if (id === this.state.dbMaxId) clearInterval(this.timer)
                this.getPaper(id + 1)
            })
        }
    }

    extractTopicNumber(node) {
        var topics = node.topics.trim().split(" ")
        var maxProb = 0.0, topicNumber = -1;
        topics.forEach(function(topic, index) {
        var topicProb = parseFloat(topic)
        if (topicProb > maxProb) {
            maxProb = topicProb
            topicNumber = index
        }
        })
        //console.log(topics[topicNumber])
        return topicNumber
    }

    tick() {
        let currentTimerInSecond = this.state.timerInSecond + 1
        this.setState({
            timerInSecond: currentTimerInSecond
        })
    }

    componentDidMount() {
        $('#updateTopicModal').on('hide.bs.modal', function (e) {
            this.stopLabelUpdate()
        }.bind(this))

        $('#updateTopicModal').on('hidden.bs.modal', function (e) {
            this.props.onClose()
        }.bind(this))
        
        $('#updateTopicModal').modal('show')  
    }

    stopLabelUpdate() {
        this.setState({
            isRunning: false
        })
        clearInterval(this.timer)
    }

    render() {
        return(
            <div id="updateTopicModal" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Database Topic</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="text-center">
                                <p>
                                    Updated Paper Id: {(this.state.updatedId === -1) 
                                        ? <i className="fa fa-spinner fa-pulse fa-fw"></i> 
                                        : this.state.updatedId}
                                </p>
                                <p className="text-muted">
                                    <small>Time elapsed: {this.state.timerInSecond} (s)</small>
                                </p>
                                <button type="button" className="btn btn-danger" onClick={this.stopLabelUpdate.bind(this)}>Stop</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}