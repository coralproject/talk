import React, {Component} from 'react';
import {connect} from 'react-redux';

import {I18n} from '../../coral-framework';
import {updateOpenStatus, updateConfiguration} from '../../coral-framework/actions/config';

import CloseCommentsInfo from '../components/CloseCommentsInfo';
import ConfigureCommentStream from '../components/ConfigureCommentStream';

const lang = new I18n();

class ConfigureStreamContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      premod: props.config.moderation === 'pre',
      premodLinks: false
    };

    this.toggleStatus = this.toggleStatus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleApply = this.handleApply.bind(this);
  }

  handleApply () {
    const {premod, changed} = this.state;
    const newConfig = {
      moderation: premod ? 'pre' : 'post'
    };
    if (changed) {
      this.props.updateConfiguration(newConfig);
      setTimeout(() => {
        this.setState({
          changed: false
        });
      }, 300);
    }
  }

  handleChange (e) {
    const {name, checked} = e.target;
    this.setState({
      [name]: checked,
      changed: true
    });
  }

  toggleStatus () {
    this.props.updateStatus(this.props.config.status === 'open' ? 'closed' : 'open');
  }

  getClosedIn () {
    const {closedTimeout} = this.props.config;
    const {created_at} = this.props.asset;
    return lang.timeago(new Date(created_at).getTime() + (1000 * closedTimeout));
  }

  render () {
    const {status} = this.props;

    return (
      <div>
        <ConfigureCommentStream
          handleChange={this.handleChange}
          handleApply={this.handleApply}
          changed={this.state.changed}
          {...this.state}
        />
        <hr />
        <h3>{status === 'open' ? 'Close' : 'Open'} Comment Stream</h3>
        {status === 'open' ? <p>The comment stream will close in {this.getClosedIn()}.</p> : ''}
        <CloseCommentsInfo
          onClick={this.toggleStatus}
          status={status}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.config.toJS(),
  asset: state.items.get('assets').first().toJS()
});

const mapDispatchToProps = dispatch => ({
  updateStatus: status => dispatch(updateOpenStatus(status)),
  updateConfiguration: newConfig => dispatch(updateConfiguration(newConfig))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigureStreamContainer);
