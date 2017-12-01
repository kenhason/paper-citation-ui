/*global $*/
import React, { Component } from 'react'
import { PaperDetails, CitationEvolution } from '../'
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
            citationEvolution: null,
            modalReady: false
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
              alert(err)
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
              alert(err)
            }
            let citationEvolution = this.convertToBarChartJSON(res.results[0].data)
            this.setState({
                citationEvolution: citationEvolution
            })
            // console.log(this.state.citationEvolution)
        })
    }

    convertToBarChartJSON(res){
        var data=[];
        res.forEach(function(row){
          if (row.row[0] > 0) {
            if (data.length === 0) {
              data.push({number: row.row[1], year: row.row[0]});
            }
            else {
              var previousNumber = data[data.length - 1].number;
              data.push({number: row.row[1] + previousNumber, year: row.row[0]});
            }
          }
        });
        return data;
    }
    
    render() {
        return(
            <div id="myModal" className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog">
                <div id="my_modal" className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.selectedPaper}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div id="test"  className="modal-body">
                            <h4><strong>Paper Details</strong></h4>
                            <PaperDetails paper={this.state.paper}/>
                            <hr/>
                            <h4 ref="chartContent"><strong>Citation Evolution</strong></h4>
                            <CitationEvolution modalReady={this.state.modalReady} data={this.state.citationEvolution}/>
                        </div>
                    </div>
                </div>
            </div>
        ) 
    }
}

export default PaperInfo