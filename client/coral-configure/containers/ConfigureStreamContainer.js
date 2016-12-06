import React, {Component} from 'react';
import {connect} from 'react-redux';

import {updateOpenStatus} from '../../coral-framework/actions/config';

import CloseCommentsInfo from '../components/CloseCommentsInfo';
import ConfigureCommentStream from '../components/ConfigureCommentStream';

class ConfigureStreamContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      premod: false,
      premodLinks: false
    };

    this.toggleStatus = this.toggleStatus.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
          handleApply={this.props.handleApply}
          changed={this.state.changed}
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
  handleApply: () => {}
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigureStreamContainer);
