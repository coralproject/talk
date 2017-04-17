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
      changed: false,
      dirtySettings: props.asset.settings
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
    const questionBoxContent = elements.qboxcontent.value;

    const premodLinksEnable = elements.plinksenable.checked;
    const {changed} = this.state;

    const newConfig = {
      moderation: premod ? 'PRE' : 'POST',
      questionBoxEnable,
      questionBoxContent,
      premodLinksEnable
    };

    if (changed) {
      this.props.updateConfiguration(newConfig);
      setTimeout(() => {
        this.setState({
          changed: false
        });
      }, 300);

      // this.props.loadAsset(this.props.data.asset);
    }
  }

  handleChange (e) {

    // TO DO: Don’t directly manipulate state and make state change immutable.
    if (e.target && e.target.id === 'qboxenable') {
      this.state.dirtySettings.questionBoxEnable = e.target.checked;
    }
    if (e.target && e.target.id === 'qboxcontent') {
      this.state.dirtySettings.questionBoxContent = e.target.value;
    }
    if (e.target && e.target.id === 'plinksenable') {
      this.state.dirtySettings.premodLinksEnable = e.target.value;
    }

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
    const {closedAt} = this.props.asset;
    const {dirtySettings} = this.state;
    const status = closedAt === null ? 'open' : 'closed';
    const premod = dirtySettings.moderation === 'PRE';

    return (
      <div>
        <ConfigureCommentStream
          handleChange={this.handleChange}
          handleApply={this.handleApply}
          changed={this.state.changed}
          premodLinksEnable={dirtySettings.premodLinksEnable}
          premod={premod}
          questionBoxEnable={dirtySettings.questionBoxEnable}
          questionBoxContent={dirtySettings.questionBoxContent}
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
  updateConfiguration: newConfig => dispatch(updateConfiguration(newConfig)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(ConfigureStreamContainer);
