/*global $*/
import React, { Component } from 'react'
import { PaperDetails, CitationEvolution, CitingList, CitedList } from '../'
import APIManager from '../../utils/APIManager'

class PaperInfo extends Component {

    constructor() {
        super()
        this.getPaperDetails = this.getPaperDetails.bind(this)
        this.getCitationEvolution = this.getCitationEvolution.bind(this)
        this.convertToBarChartJSON = this.convertToBarChartJSON.bind(this)
        this.state = {
            paper: {},
            topicProbs: '',
            citationEvolution: [],
            modalReady: false, 
            citingLevel: 1,
            citedLevel: 1,
            citingCount: -1,
            citedCount: -1,
            citingList: [],
            citedList: []
        }
    }

    componentDidMount() {
        $('#myModal').on('hide.bs.modal', function (e) {
            this.props.onClose()
        }.bind(this))

        $('#myModal').on('shown.bs.modal', function (e) {
            // console.log(this.refs.modalBody.getBoundingClientRect().width)
            this.setState({
                modalReady: true
            })
        }.bind(this))
      
        if (this.props.selectedPaper >= 0) {
            this.getPaperDetails()
            this.getCitationEvolution()
            this.getCitingCount()
            this.getCitedCount()
        }
        
        $('#myModal').modal('show')  
    }

    getPaperDetails() {
        let body = {
            "statements": [
                {
                    "statement": "MATCH (n: Paper) where id(n) = {id} RETURN n",
                    "parameters": {
                        "id": this.props.selectedPaper
                    }
                }
            ]
        }
        
        APIManager.queryNeo4j(body, (err, res) => {
            if (err) {
              console.log(err)
            }

            let paper = res.results[0].data[0].row[0]
            paper['id'] = res.results[0].data[0].meta[0].id
            let topicProbs = paper.topics
            delete paper.topics
              
            let updatedPaper = Object.assign({}, this.state.paper)
            updatedPaper = paper
            this.setState({
              paper: updatedPaper,
              topicProbs: topicProbs
            })
        })
    }

    getCitationEvolution() {
        let body = {
            "statements": [
                {
                    "statement": "match (t: Paper)<-[:CITES]-(o: Paper) where ID(t) = {id} return o.year as year, count(o.year) as number ORDER BY year ASC",
                    "parameters": {
                        "id": this.props.selectedPaper
                    }
                }
            ]
        }
        
        APIManager.queryNeo4j(body, (err, res) => {
            if (err) {
              console.log(err)
            }
            let citationEvolution = this.convertToBarChartJSON(res.results[0].data)
            this.setState({
                citationEvolution: citationEvolution
            })
            // console.log(this.state.citationEvolution)
        })
    }

    getCitingCount() {
        let body = {
            "statements": [
                {
                    "statement": "match (a:Paper)-[r:CITES*1.."+this.state.citingLevel+"]->(b:Paper) where id(a)={id} return count(DISTINCT b) AS citing",
                    "parameters": {
                        "id": this.props.selectedPaper
                    }
                }
            ]
        }
        
        APIManager.queryNeo4j(body, (err, res) => {
            if (err) {
              console.log(err)
            }

            this.setState({
                citingCount: res.results[0].data[0].row[0]
            })
        })
    }

    getCitedCount() {
        let body = {
            "statements": [
                {
                    "statement": "match (a:Paper)<-[r:CITES*1.."+this.state.citedLevel+"]-(b:Paper) where id(a)={id} return count(DISTINCT b) AS citing",
                    "parameters": {
                        "id": this.props.selectedPaper
                    }
                }
            ]
        }
        
        APIManager.queryNeo4j(body, (err, res) => {
            if (err) {
              console.log(err)
            }

            this.setState({
                citedCount: res.results[0].data[0].row[0]
            })
        })
    }

    convertToBarChartJSON(res){
        var data=[];
        res.forEach(function(row){
          if (row.row[0] > 0) {
            // if (data.length === 0) {
            //   data.push({number: row.row[1], year: row.row[0]});
            // }
            // else {
            //   var previousNumber = data[data.length - 1].number;
            //   data.push({number: row.row[1] + previousNumber, year: row.row[0]});
            // }
            data.push({number: row.row[1], year: row.row[0]})
          }
        });
        return data;
    }

    increaseCitingLevel() {
        let current = this.state.citingLevel
        if (current < 5) {
            this.setState({
                citingLevel: current + 1,
                citingCount: -1
            }, () => {
                this.getCitingCount()
            })        
        }
    }

    increaseCitedLevel() {
        let current = this.state.citedLevel
        if (current < 5) {
            this.setState({
                citedLevel: current + 1,
                citedCount: -1
            }, () => {
                this.getCitedCount()
            })
        }
    }

    decreaseCitingLevel() {
        let current = this.state.citingLevel
        if (current > 1) {
            this.setState({
                citingLevel: current - 1,
                citingCount: -1
            }, () => {
                this.getCitingCount()
            })
        }
    }

    decreaseCitedLevel() {
        let current = this.state.citedLevel
        if (current > 1) {
            this.setState({
                citedLevel: current - 1,
                citedCount: -1
            }, () => {
                this.getCitedCount()
            })
        }
    }
    
    render() {
        return(
            <div id="myModal" className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog">
                <div id="my_modal" className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title"><strong>{this.state.paper.title}</strong></h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div id="test"  className="modal-body">
                            <PaperDetails paper={this.state.paper}/>
                            <hr/>
                            <h5 ref="chartContent"><strong>Citation Evolution</strong></h5>
                            <CitationEvolution modalReady={this.state.modalReady} data={this.state.citationEvolution}/>
                            <hr/>
                            <h5 ref="chartContent"><strong>Citing Set</strong></h5>
                            <CitingList 
                                count={this.state.citingCount} 
                                level={this.state.citingLevel} 
                                increaseLevel={this.increaseCitingLevel.bind(this)} 
                                decreaseLevel={this.decreaseCitingLevel.bind(this)} 
                            />
                            <hr/>
                            <h5 ref="chartContent"><strong>Cited Set</strong></h5>
                            <CitedList 
                                count={this.state.citedCount} 
                                level={this.state.citedLevel}
                                increaseLevel={this.increaseCitedLevel.bind(this)}
                                decreaseLevel={this.decreaseCitedLevel.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        ) 
    }
}

export default PaperInfo