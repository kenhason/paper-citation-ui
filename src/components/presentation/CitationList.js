import React, { Component } from 'react'

export default class CitationList extends Component {
    
    constructor() {
        super()
        this.state = {
            currentPage: -1,
            numOfPages: -1
        }
    }

    componentDidUpdate() {
        if (this.props.list.length > 0 && this.state.numOfPages === -1) 
            this.setState({
                currentPage: 1,
                numOfPages: this.getTotalPagesFromListLength(this.props.list.length)
            })
    }

    getTotalPagesFromListLength(length) {
        var totalPages;
        if (length/10 === Math.floor(length/10))
            totalPages = length/10
        else 
            totalPages = Math.floor(length/10)+1;
        return totalPages;
    }

    increasePage() {
        let current = this.state.currentPage,
        max = this.state.numOfPages
        if (current < max) {
            this.setState({
                currentPage: current+1
            })
        }
    }

    decreasePage() {
        let current = this.state.currentPage
        if (current > 1) {
            this.setState({
                currentPage: current-1
            })
        }
    }

    render() {
        var listEls = this.props.list
            .slice((this.state.currentPage-1)*10, (this.state.currentPage-1)*10+10)
            .map((el, index) => {
                return(
                    <tr key={index}>
                        <th className="text-muted"><label><em>{el.id}</em></label></th>
                        <td style={{ color: 'rgb(29, 33, 41)' }}><label id="authors">{el.title}</label></td>
                    </tr>
                )
            })
        return (
            <div>
                {(this.props.list.length < 1)
                    ? <div className="text-center"><i className="fa fa-spinner fa-spin fa-2x fa-fw"></i></div>
                    : <div>
                        <ul className="pagination justify-content-center pt-3">
                            {(this.state.currentPage < 2)
                                ? null
                                : <li className="page-item" onClick={this.decreasePage.bind(this)}>
                                    <button type="button" className="page-link">
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </button>
                                </li>
                            }
                            <li className="page-item"><a className="page-link">Page {this.state.currentPage} of {this.state.numOfPages}</a></li>
                            {
                                (this.state.currentPage < this.state.numOfPages)
                                    ? <li className="page-item" onClick={this.increasePage.bind(this)}>
                                        <button type="button" className="page-link">
                                            <span aria-hidden="true">&raquo;</span>
                                            <span className="sr-only">Next</span>
                                        </button>
                                    </li>
                                    : null
                            }
                        </ul>

                        <table className="table-respontive table table-striped">
                            <tbody>
                                <tr>
                                    <th className="text-muted"><label><em>Id</em></label></th>
                                    <td style={{ color: 'rgb(29, 33, 41)' }}><label id="authors">Title</label></td>
                                </tr>
                                {listEls}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        )
    }
}