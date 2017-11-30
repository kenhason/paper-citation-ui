/*global $*/
import React, { Component } from 'react'

class PaperInfo extends Component {
    
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
                        ...
                    </div>
                </div>
            </div>
        ) 
    }
}

export default PaperInfo