import React, { Component } from 'react'

export default class PaperDetails extends Component {
    render() {
        return(
            <table className="table table-striped">
                <tbody>
                    {
                        (this.props.paper.authors === null || this.props.paper.authors === '') 
                            ?   null
                            : <tr>
                                <th className="text-muted"><label><em>Authors</em></label></th>
                                <td style={{color: 'rgb(29, 33, 41)'}}><label id="authors">{this.props.paper.authors}</label></td>
                            </tr>
                    }
                    {
                        (this.props.paper.year === null || this.props.paper.year === '') 
                            ?   null
                            : <tr>
                                <th className="text-muted"><em>Year</em></th>
                                <td style={{color: 'rgb(29, 33, 41)'}}><label id="year">{this.props.paper.year}</label></td>
                            </tr>
                    }
                    {
                        (this.props.paper.publicationVenue === null || this.props.paper.publicationVenue === '') 
                            ?   null
                            : <tr>
                                <th className="text-muted"><em>Publication Venue</em></th>
                                <td style={{color: 'rgb(29, 33, 41)'}}><label id="publication-venue">{this.props.paper.publicationVenue}</label></td>
                            </tr>
                    }
                    {
                        (this.props.paper.abstract === null || this.props.paper.abstract === '') 
                            ?   null
                            : <tr>
                                <th className="text-muted"><em>Abstract</em></th>
                                <td style={{color: 'rgb(29, 33, 41)'}}><label id="paper-abstract">{this.props.paper.abstract}</label></td>
                            </tr>
                    }
                    {
                        (this.props.paper.affiliations === null || this.props.paper.affiliations === '') 
                            ?   null
                            : <tr>
                                <th className="text-muted"><em>Affiliation</em></th>
                                <td style={{color: 'rgb(29, 33, 41)'}}><label id="affiliation">{this.props.paper.affiliations}</label></td>
                            </tr>
                    }
                </tbody>
            </table>
        )
    }
}