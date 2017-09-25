import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';

import {updateOpenStatus, updateConfiguration} from 'coral-embed-stream/src/actions/asset';

import CloseCommentsInfo from '../components/CloseCommentsInfo';
import ConfigureCommentStream from '../components/ConfigureCommentStream';

import t, {timeago} from 'coral-framework/services/i18n';

class ConfigureStreamContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      changed: false,
      dirtySettings: {...props.asset.settings},
      closedAt: !props.asset.isClosed ? 'open' : 'closed'
    };

    this.toggleStatus = this.toggleStatus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleApply = this.handleApply.bind(this);
  }

  handleApply (e) {
    e.preventDefault();
    const {elements} = e.target;
    const {questionBoxIcon, questionBoxContent} = this.state.dirtySettings;
    const premod = elements.premod.checked;
    const questionBoxEnable = elements.qboxenable.checked;
    const premodLinksEnable = elements.plinksenable.checked;
    const {changed} = this.state;

    const newConfig = {
      moderation: premod ? 'PRE' : 'POST',
      questionBoxEnable,
      questionBoxContent,
      questionBoxIcon,
      premodLinksEnable
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

  handleChange (e, newChanges) {
    let changes = {};

    if (changes) {
      changes = {...newChanges};
    }

    if (e.target && e.target.id === 'qboxenable') {
      changes.questionBoxEnable = e.target.checked;
    }
    if (e.currentTarget && e.currentTarget.id === 'qboxicon') {
      changes.questionBoxIcon = e.currentTarget.dataset.icon;
    }
    if (e.target && e.target.id === 'plinksenable') {
      changes.premodLinksEnable = e.target.value;
    }

    this.setState({
      changed: true,
      dirtySettings: {
        ...this.state.dirtySettings,
        ...changes,
      },
    });
  }

  toggleStatus () {

    // update the closedAt status for the asset
    this.props.updateStatus(
      this.state.closedAt === 'open' ? 'closed' : 'open'
    );
    this.setState({
      closedAt: (this.state.closedAt === 'open' ? 'closed' : 'open')
    });
  }

  getClosedIn () {
    const {closedTimeout} = this.props.asset.settings;
    const {created_at} = this.props.asset;

    return timeago(new Date(created_at).getTime() + (1000 * closedTimeout));
  }

  render () {
    const {dirtySettings} = this.state;
    const premod = dirtySettings.moderation === 'PRE';
    const {closedAt} = this.state;
    const closedTimeout = dirtySettings.closedTimeout;

    return (
      <div className='talk-embed-stream-configuration-container'>
        <ConfigureCommentStream
          handleChange={this.handleChange}
          handleApply={this.handleApply}
          changed={this.state.changed}
          premodLinksEnable={dirtySettings.premodLinksEnable}
          premod={premod}
          questionBoxIcon={dirtySettings.questionBoxIcon}
          questionBoxEnable={dirtySettings.questionBoxEnable}
          questionBoxContent={dirtySettings.questionBoxContent}
        />
        <hr />
        <h3>{closedAt === 'open' ? t('configure.close') : t('configure.open')} {t('configure.comment_stream')}</h3>
        {(closedAt === 'open' && closedTimeout) ? <p>{t('configure.comment_stream_will_close')} {this.getClosedIn()}.</p> : ''}
        <CloseCommentsInfo
          onClick={this.toggleStatus}
          status={closedAt}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  asset: state.asset
});

const mapDispatchToProps = (dispatch) => ({
  updateStatus: (status) => dispatch(updateOpenStatus(status)),
  updateConfiguration: (newConfig) => dispatch(updateConfiguration(newConfig)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(ConfigureStreamContainer);
