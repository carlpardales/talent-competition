import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';
import { JobFilter } from './JobFilter.jsx';

const sortByDate = [
    { key: '0', value: 'desc', text: 'Newest first' },
    { key: '1', value: 'asc', text: 'Oldest first' }
];

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            recordsPerPage: 6,
            totalPages: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.renderJobs = this.renderJobs.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        // this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
    }

    componentDidMount() {
        this.init();
    };

    handleFilter(newFilter) {
        var data = {
            filter: newFilter,
            activePage: 1
        }
        console.log(data);
        this.loadNewData(data);
    }

    handleSortChange(event, { value, name }) {
        this.state.sortBy[name] = value;
        this.loadNewData({ sortBy: this.state.sortBy });
    }

    handlePageChange(event, { activePage }) {
        if (activePage !== this.state.activePage) {
            this.setState({
                activePage: activePage
            }, this.loadData);
        }
    }

    loadData(callback) {
        const activePage = this.state.activePage;
        const sortbyDate = this.state.sortBy.date;
        const { showActive, showClosed, showDraft, showExpired, showUnexpired } = this.state.filter;

        const params = '?activePage=' + activePage + '&sortbyDate=' + sortbyDate + '&showActive=' + showActive +
            '&showClosed=' + showClosed + '&showDraft=' + showDraft + '&showExpired=' + showExpired +
            '&showUnexpired=' + showUnexpired;

        // Changed to Azure address for review purposes.
        // Must revert to local url during development.
        //var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';

        var link = 'https://competitiontalentservicestalent.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: link + params,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                if (res.myJobs) {
                    this.setState({
                        loadJobs: res.myJobs,
                        totalPages: Math.ceil(res.totalCount / this.state.recordsPerPage)
                    })
                }
                if (callback && typeof (callback) === "function") {
                    callback();
                }
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    renderJobs() {
        const jobs = this.state.loadJobs;

        const result = (jobs.length > 0) ?
            jobs.map(job =>
                <JobSummaryCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    noOfSuggestions={job.noOfSuggestions}
                    location={`${job.location.city}, ${job.location.country}`}
                    summary={job.summary}
                    expiryDate={job.expiryDate} />)
            : <p style={{
                paddingTop: 20,
                paddingBottom: 50,
                marginLeft: 15
            }}>
                No Jobs Found
             </p>

        return result;
    }

    render() {
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <div className="ui grid">
                        <h2 className="ui header">List of Jobs</h2>
                        <div className="row">
                            <div className="padded column">
                                <JobFilter filter={this.state.filter} handleFilter={this.handleFilter} />
                                <i aria-hidden="true" className="calendar icon"></i>
                                {"Sort by date: "}
                                <Dropdown
                                    name="date"
                                    inline
                                    simple
                                    options={sortByDate}
                                    value={this.state.sortBy.date}
                                    onChange={this.handleSortChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="column">
                                <div className="ui three cards">
                                    {this.renderJobs()}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="center aligned padded column">
                                <Pagination
                                    defaultActivePage={this.state.activePage}
                                    totalPages={this.state.totalPages}
                                    onPageChange={this.handlePageChange} />
                            </div>
                        </div>
                        <div className="row">
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}