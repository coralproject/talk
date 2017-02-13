import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';

import {I18n} from 'coral-framework';
import {updateOpenStatus, updateConfiguration} from 'coral-framework/actions/asset';

import CloseCommentsInfo from '../components/CloseCommentsInfo';
import ConfigureCommentStream from '../components/ConfigureCommentStream';

const lang = new I18n();

class ConfigureStreamContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      changed: false
    };

    this.toggleStatus = this.toggleStatus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleApply = this.handleApply.bind(this);
  }

  handleApply (e) {
    e.preventDefault();
    const {elements} = e.target;
    const premod = elements.premod.checked;
    const questionBoxEnable = elements.qboxenable.checked;

    // const premodLinks = elements.premodLinks.checked;
    const {changed} = this.state;

    const newConfig = {
      moderation: premod ? 'PRE' : 'POST',
      questionBoxEnable: questionBoxEnable
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

  handleChange () {
    this.setState({
      changed: true
    });
  }

  toggleStatus () {
    this.props.updateStatus(
      this.props.asset.closedAt === null ? 'closed' : 'open'
    );
  }

  getClosedIn () {
    const {closedTimeout} = this.props.asset.settings;
    const {created_at} = this.props.asset;
    return lang.timeago(new Date(created_at).getTime() + (1000 * closedTimeout));
  }

  render () {
    const status = this.props.asset.closedAt === null ? 'open' : 'closed';
    const premod = this.props.asset.settings.moderation === 'PRE';
    const questionBoxEnable = this.props.asset.settings.questionBoxEnable;
    const questionBoxContent = this.props.asset.settings.questionBoxContent;

    return (
      <div>
        <ConfigureCommentStream
          handleChange={this.handleChange}
          handleApply={this.handleApply}
          changed={this.state.changed}
          premodLinks={false}
          premod={premod}
          questionBoxEnable={questionBoxEnable}
          questionBoxContent={questionBoxContent}
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
  asset: state.asset.toJS()
});

const mapDispatchToProps = dispatch => ({
  updateStatus: status => dispatch(updateOpenStatus(status)),
  updateConfiguration: newConfig => dispatch(updateConfiguration(newConfig))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(ConfigureStreamContainer);
