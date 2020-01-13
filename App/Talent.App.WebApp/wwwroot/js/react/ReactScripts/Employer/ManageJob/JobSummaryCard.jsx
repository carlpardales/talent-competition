import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.selectJob = this.selectJob.bind(this)
        this.renderExpiredLabel = this.renderExpiredLabel.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        this.selectJob(this.props.id);
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        var link = 'https://competitiontalentservicestalent.azurewebsites.net/listing/listing/closeJob';

        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(id),
            success: function (res) {
                if (res.success) {
                    TalentUtil.notification.show(res.message, "success", null, null);
                }
                else {
                    TalentUtil.notification.show(res.message, "error", null, null);
                }
            }.bind(this),
            error: function (res) {
                TalentUtil.notification.show(res.message, "error", null, null);
            }.bind(this)
        })
    }

    renderExpiredLabel(expiryDate) {
        // Need to add condition to check if job is expired before rendering the label.
        return (
            <div className="ui small red label">Expired</div>
        );
    }

    render() {
        const editJobPath = `/EditJob/${this.props.id}`;
        const copyJobPath = `/PostJob/${this.props.id}`;

        return (
            <div className="ui card">
                <div className="content">
                    <div className="header">{this.props.title}</div>
                    <a className="ui black right ribbon label">
                        <i aria-hidden="true" className="user icon"></i>
                        {this.props.noOfSuggestions}
                    </a>
                    <div className="meta">{this.props.location}</div>
                    <div className="description job-summary">
                        {this.props.summary}
                    </div>
                </div>
                <div className="extra content">
                    {this.renderExpiredLabel(this.props.expiryDate)}
                    <div className="ui compact mini right floated buttons">
                        <button className="ui blue basic button" onClick={this.handleClick}>
                            <i aria-hidden="true" className="ban icon"></i>
                            Close
                        </button>
                        <a className='ui blue basic button' href={editJobPath}>
                            <i aria-hidden="true" className="edit icon"></i>
                            Edit
                        </a>
                        <a className='ui blue basic button' href={copyJobPath}>
                            <i aria-hidden="true" className="copy outline icon"></i>
                            Copy
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}