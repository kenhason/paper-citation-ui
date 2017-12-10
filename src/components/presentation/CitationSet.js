import  React, { Component } from 'react'
import './CitationSet.css'
import { CitationList } from '../'

export default class CitationSet extends Component {

    showOrHideList(e) {
        this.props.changeListExistence()
    }

    onLevelIncrease() {
        this.props.increaseLevel()
    }

    onLevelDecrease() {
        this.props.decreaseLevel()
    }

    render() {
        return(
            <div>
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
                        {
                            (this.props.count < 1)
                                ? <button onClick={this.showOrHideList.bind(this)} type="button" className="disabled btn btn-danger btn-sm ml-3">
                                    {this.props.showList ? <small>Hide List</small> : <small>Show List</small>}
                                </button>
                                : <button onClick={this.showOrHideList.bind(this)} type="button" className="btn btn-danger btn-sm ml-3">
                                    {this.props.showList ? <small>Hide List</small> : <small>Show List</small>}
                                </button>
                        }
                    </small>
                    <div className="col-12 col-sm-6">
                        <ul className="pagination justify-content-start justify-content-sm-end m-0">
                            {
                                (this.props.level <= 1)
                                    ? null
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
                                    ? null
                                    : <li className="page-item" onClick={this.onLevelIncrease.bind(this)}>
                                        <button type="button" className="page-link">
                                            <i className="fa fa-plus" aria-hidden="true"></i>
                                        </button>
                                    </li>
                            }

                        </ul>
                    </div>
                </div>
                {this.props.showList ? <CitationList list={this.props.list}/> : null}
            </div>
        )
    }
}