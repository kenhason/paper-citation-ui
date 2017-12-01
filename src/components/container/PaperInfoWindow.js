/*global $*/
import React, { Component } from 'react'
import { PaperDetails } from '../'

class PaperInfo extends Component {

    constructor() {
        super()
        // this.getPaperDetails.bind(this)
    }

    getPaperDetails() {
        // let auth = btoa("neo4j:Neo4j");
        // let url = "http://localhost:7474/db/data/cypher",
        // headers = {
        //   'accept': 'application/json',
        //   'X-Stream': 'true',
        //   'authorization': 'Basic ' + auth
        // },
        // body =  {
        //   "query" : "match path = (p: Paper)-[: CITES]-(: Paper) where id(p) < 650 and id(p) > 600 unwind nodes(path) as n unwind rels(path) as r return {nodes: collect(distinct {id: id(n), title: n.title, cited: n.cited, topics: n.topics}), links: collect(DISTINCT {source: id(startNode(r)), target: id(endNode(r))})}"
        // };
        
        // APIManager.post(url, headers, body, (err, res) => {
        //   if (err) {
        //     alert(err)
        //   }
            
        //   let updatedGraph = Object.assign({}, this.state.graph)
        //   updatedGraph = res.data[0][0]
        //   this.setState({
        //     graph: updatedGraph
        //   })
        //   this.transformLinkId()
        //   this.extractTopicLabel()
        //   this.loadTopicLabels(1, 4)
        // })
    }
    
    componentDidMount() {
        $('#myModal').on('hide.bs.modal', function (e) {
            this.props.onClose()
        }.bind(this))
        
        $('#myModal').modal('show')
    }

    render() {
        return(
            <div id="myModal" className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.selectedPaper}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <PaperDetails />
                        </div>
                    </div>
                </div>
            </div>
        ) 
    }
}

export default PaperInfo