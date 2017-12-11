import React, { Component } from 'react'
import './Search.css'
import APIManager from '../../utils/APIManager'

export default class Search extends Component {

    constructor() {
        super()
        this.state = {
            results: [], 
            searching: false,
            keyword: ''
        }
    }

    search() {
        if (this.state.keyword.trim() !== '') {
            this.setState({
                results: [],
                searching: true
            }, () => {
                console.log("getting search results ...")
                let body = {
                  "statements": [
                    {
                      "statement": "MATCH (n:Paper) WHERE n.topicLabel={topic} and lower(n.title) CONTAINS lower({keyword}) RETURN id(n), n.title LIMIT 20",
                      "parameters": {
                        "keyword": this.state.keyword,
                        "topic": this.props.topic
                      }
                    }
                  ]
                };
            
                APIManager.queryNeo4j(body, (err, res) => {
                  if (err) {
                    console.log(err)
                    return
                  }
                  let data = res.results[0].data.map(function (data) { return {id: data.row[0], title: data.row[1]} })
                  this.setState({
                    results: data,
                    searching: false
                  })
                })
            })
        }  
    }

    updateKeyword(event) {
        console.log(event.target.value)
        if (event.target.value === '') 
            this.setState({
                results: []
            })
        this.setState({
            keyword: event.target.value
        })
    } 
    
    selectPaper(id) {
        console.log(id)
        this.props.selectPaper(id)
    }

    render() {
        let list = this.state.results.map((result) => {
            return (
                <li onClick={() => this.selectPaper(result.id)} className="list-group-item search-result-card" key={result.id}>{result.title}</li>
            )
        })
        return (
            <div className="card bg-faded search-container p-0 m-0 b-0">
                <div className="card-block p-1 m-0 b-0">
                    <div className="input-group card-title m-0">
                        <input type="text" className="form-control" placeholder="Search for..." onChange={this.updateKeyword.bind(this)} />
                        <span className="input-group-btn">
                            <button className="btn btn-success" type="button" onClick={this.search.bind(this)}>
                                <i className="fa fa-search" aria-hidden="true"></i>
                            </button>
                        </span>
                    </div>
                    {this.state.searching ? <div className="text-center mt-2 "><i className="fa fa-spinner fa-pulse fa-fw"></i></div> : null}
                    {this.state.results.length > 0
                        ? <div className="scroll mt-2">
                            <ul className="list-group">
                            {list}
                        </ul>
                        </div>
                        : null
                    }
                    
                </div>
                
            </div>
        )
    }
}