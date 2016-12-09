import React, {Component} from 'react';
import {connect} from 'react-redux';

import {updateOpenStatus, updateConfiguration} from '../../coral-framework/actions/config';

import CloseCommentsInfo from '../components/CloseCommentsInfo';
import ConfigureCommentStream from '../components/ConfigureCommentStream';

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
        <CloseCommentsInfo
          onClick={this.toggleStatus}
          status={status}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.config.toJS()
});

const mapDispatchToProps = dispatch => ({
  updateStatus: status => dispatch(updateOpenStatus(status)),
  updateConfiguration: newConfig => dispatch(updateConfiguration(newConfig))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigureStreamContainer);
