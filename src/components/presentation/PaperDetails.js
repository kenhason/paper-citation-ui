import React, { Component } from 'react'

export default class PaperDetails extends Component {
    render() {
        return(
            <table className="table table-striped">
                <tbody>
                <tr>
                    <th><label>Id</label></th>
                    <td><label id="paper-id">{this.props.paper.id}</label></td>
                </tr>
                <tr>
                    <th><label>Title</label></th>
                    <td><label id="paper-title">{this.props.paper.title}</label></td>
                </tr>
                <tr>
                    <th><label>Authors</label></th>
                    <td><label id="authors">{this.props.paper.authors}</label></td>
                </tr>
                <tr>
                    <th><label></label>Year</th>
                    <td><label id="year">{this.props.paper.year}</label></td>
                </tr>
                <tr>
                    <th><label>Publication Venue</label></th>
                    <td><label id="publication-venue">{this.props.paper.publicationVenue}</label></td>
                </tr>
                <tr>
                    <th><label>Abstract</label></th>
                    <td><label id="paper-abstract">{this.props.paper.abstract}</label></td>
                </tr>
                <tr>
                    <th><label></label>Affiliation</th>
                    <td><label id="affiliation">{this.props.paper.affiliation}</label></td>
                </tr>
                </tbody>
            </table>
        )
    }
}