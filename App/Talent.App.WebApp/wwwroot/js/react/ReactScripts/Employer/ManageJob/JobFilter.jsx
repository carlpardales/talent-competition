import React, { Fragment } from 'react';
import { Dropdown, Form } from 'semantic-ui-react';

export class JobFilter extends React.Component {
    constructor(props) {
        super(props);

        const filter = Object.assign({}, this.props.filter);

        this.state = {
            newFilter: filter
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, { checked, name }) {
        this.state.newFilter[name] = checked;

        this.setState({
            newFilter: this.state.newFilter
        })
    }

    render() {
        return (
            <Fragment>
                <i aria-hidden="true" className="filter icon"></i>
                {"Filter: "}
                <Dropdown inline simple text="Choose filter">
                    <Dropdown.Menu>
                        <Dropdown.Item key={"status"}>
                            <Form>
                                <Form.Group grouped>
                                    <Form.Checkbox label='Active Jobs'
                                        name="showActive" onChange={this.handleChange} defaultChecked={this.props.filter.showActive} />
                                    <Form.Checkbox label='Closed Jobs'
                                        name="showClosed" onChange={this.handleChange} defaultChecked={this.props.filter.showClosed} />
                                    <Form.Checkbox label='Drafts'
                                        name="showDraft" onChange={this.handleChange} defaultChecked={this.props.filter.showDraft} />
                                    <Form.Checkbox label='Expired Jobs'
                                        name="showExpired" onChange={this.handleChange} defaultChecked={this.props.filter.showExpired} />
                                    <Form.Checkbox label='Unexpired Jobs'
                                        name="showUnexpired" onChange={this.handleChange} defaultChecked={this.props.filter.showUnexpired} />
                                </Form.Group>
                            </Form>
                        </Dropdown.Item>
                        <button className="ui teal small button"
                            style={{ width: "100%", borderRadius: "0" }}
                            onClick={() => this.props.handleFilter(this.state.newFilter)}
                        >
                            <i className="filter icon" />
                            Filter
                        </button>
                    </Dropdown.Menu>
                </Dropdown>
            </Fragment>
        );
    }
}