import  React, { Component } from 'react'
import './CitingList.css'

export default class CitingList extends Component {

    onCitingListExpand(e) {

    }

    onLevelIncrease() {
        this.props.increaseLevel()
    }

    onLevelDecrease() {
        this.props.decreaseLevel()
    }

    render() {
        return(
            <div className="row">
                <small className="col-12 col-sm-6 d-flex align-items-center m-0">
                    <a>
                        <i className="pr-2 text-nuted">Total:</i>
                        {
                            (this.props.count === -1)
                                ? <i className="fa fa-spinner fa-spin fa-fw"></i>
                                : <strong>{this.props.count}</strong>
                        }
                    </a>
                    <a className="pl-3" data-toggle="collapse" onClick={this.onCitingListExpand.bind(this)} href="#citing-table-collapse">Show List</a>
                </small>
                <div className="col-12 col-sm-6">
                    <ul className="pagination justify-content-start justify-content-sm-end m-0">
                        {
                            (this.props.level <= 1)
                                ? <li className="page-item disabled" onClick={this.onLevelDecrease.bind(this)}>
                                    <button type="button" className="page-link">
                                        <i className="fa fa-minus" aria-hidden="true"></i>
                                    </button>
                                </li>
                                : <li className="page-item" onClick={this.onLevelDecrease.bind(this)}>
                                    <button type="button" className="page-link">
                                        <i className="fa fa-minus" aria-hidden="true"></i>
                                    </button>
                                </li>
                        }
                        <li className="page-item">
                            <a className="page-link" id="citing-level">
                                <small className="text-muted">Level</small> <strong>{this.props.level}</strong>
                            </a>
                        </li>
                        {
                            (this.props.level >= 5)
                                ? <li className="page-item disabled" onClick={this.onLevelIncrease.bind(this)}>
                                    <button type="button" className="page-link">
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </button>
                                </li>
                                : <li className="page-item" onClick={this.onLevelIncrease.bind(this)}>
                                    <button type="button" className="page-link">
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </button>
                                </li>
                        }
                        
                    </ul>
                </div>
            </div>
        )
    }
}