import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, gql } from 'react-apollo';
import { withQuery, withMergedSettings } from 'coral-framework/hocs';
import { Spinner } from 'coral-ui';
import PropTypes from 'prop-types';
import { withUpdateSettings } from 'coral-framework/graphql/mutations';
import { getDefinitionName } from 'coral-framework/utils';
import StreamSettings from './StreamSettings';
import TechSettings from './TechSettings';
import ModerationSettings from './ModerationSettings';
import {
  clearPending,
  showSaveDialog,
  hideSaveDialog,
} from '../../../actions/configure';
import Configure from '../components/Configure';
import OrganizationSettings from './OrganizationSettings';
import { withRouter } from 'react-router';

class ConfigureContainer extends React.Component {
  nextRoute = '';
  unregisterLeaveHook = null;

  savePending = async () => {
    await this.props.updateSettings(this.props.pending);
    this.props.clearPending();
  };

  saveChanges = async () => {
    await this.savePending();
    this.props.hideSaveDialog();
    this.gotoNextRoute();
  };

  discardChanges = async () => {
    await this.props.clearPending();
    this.props.hideSaveDialog();
    this.gotoNextRoute();
  };

  gotoNextRoute = () => {
    if (this.nextRoute) {
      this.props.router.push(this.nextRoute);
      this.nextRoute = '';
    }
  };

  handleSectionChange = async section => {
    const nextRoute = `/admin/configure/${section}`;
    if (this.hasPendingData()) {
      this.nextRoute = nextRoute;
      this.props.showSaveDialog();
    } else {
      // Just go to the section
      this.props.router.push(nextRoute);
    }
  };

  navigationPrompt = e => {
    if (this.hasPendingData()) {
      const confirmationMessage = 'Changes that you made may not be saved.';
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
      return confirmationMessage; // Gecko, WebKit, Chrome <34
    }
  };

  hasPendingData = () => {
    return !!Object.keys(this.props.pending).length;
  };

  routeLeave = ({ pathname }) => {
    if (this.hasPendingData()) {
      this.nextRoute = pathname;
      this.props.showSaveDialog();
      return false;
    }
  };

  componentDidMount() {
    this.unregisterLeaveHook = this.props.router.setRouteLeaveHook(
      this.props.route,
      this.routeLeave
    );
    window.addEventListener('beforeunload', this.navigationPrompt);
  }

  componentWillUnmount() {
    this.unregisterLeaveHook();
    window.removeEventListener('beforeunload', this.navigationPrompt);
  }

  render() {
    if (this.props.data.error) {
      return <div>{this.props.data.error.message}</div>;
    }

    if (this.props.data.loading) {
      return <Spinner />;
    }

    const activeSection = this.props.routes[3].path;

    return (
      <Configure
        saveChanges={this.saveChanges}
        discardChanges={this.discardChanges}
        saveDialog={this.props.saveDialog}
        activeSection={activeSection}
        hideSaveDialog={this.props.hideSaveDialog}
        canSave={this.props.canSave}
        currentUser={this.props.currentUser}
        root={this.props.root}
        settings={this.props.mergedSettings}
        handleSectionChange={this.handleSectionChange}
        clearPending={this.props.clearPending}
        savePending={this.savePending}
      >
        {this.props.children}
      </Configure>
    );
  }
}

const withConfigureQuery = withQuery(
  gql`
  query TalkAdmin_Configure {
    settings {
      ...${getDefinitionName(StreamSettings.fragments.settings)}
      ...${getDefinitionName(TechSettings.fragments.settings)}
      ...${getDefinitionName(ModerationSettings.fragments.settings)}
      ...${getDefinitionName(OrganizationSettings.fragments.settings)}
    }
    ...${getDefinitionName(StreamSettings.fragments.root)}
    ...${getDefinitionName(TechSettings.fragments.root)}
    ...${getDefinitionName(ModerationSettings.fragments.root)}
    ...${getDefinitionName(OrganizationSettings.fragments.root)}
  }
  ${StreamSettings.fragments.root}
  ${StreamSettings.fragments.settings}
  ${TechSettings.fragments.root}
  ${TechSettings.fragments.settings}
  ${ModerationSettings.fragments.root}
  ${ModerationSettings.fragments.settings}
  ${OrganizationSettings.fragments.root}
  ${OrganizationSettings.fragments.settings}
  `,
  {
    options: () => ({
      variables: {},
      fetchPolicy: 'network-only',
    }),
  }
);

const mapStateToProps = state => ({
  currentUser: state.auth.user,
  pending: state.configure.pending,
  canSave: state.configure.canSave,
  activeSection: state.configure.activeSection,
  saveDialog: state.configure.saveDialog,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearPending,
      showSaveDialog,
      hideSaveDialog,
    },
    dispatch
  );

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withUpdateSettings,
  withConfigureQuery,
  withMergedSettings('root.settings', 'pending', 'mergedSettings')
)(ConfigureContainer);

ConfigureContainer.propTypes = {
  activeSection: PropTypes.string,
  updateSettings: PropTypes.func.isRequired,
  clearPending: PropTypes.func.isRequired,
  showSaveDialog: PropTypes.func.isRequired,
  hideSaveDialog: PropTypes.func.isRequired,
  saveDialog: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  canSave: PropTypes.bool.isRequired,
  pending: PropTypes.object.isRequired,
  mergedSettings: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  router: PropTypes.object,
  route: PropTypes.object,
  routes: PropTypes.array,
};
