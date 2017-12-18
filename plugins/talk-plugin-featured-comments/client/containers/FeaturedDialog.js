import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import {bindActionCreators} from 'redux';
import FeaturedDialog from '../components/FeaturedDialog';
import {withTags, connect} from 'plugin-api/beta/client/hocs';
import {closeFeaturedDialog} from '../actions';

class FeaturedDialogContainer extends React.Component {
  render() {
    const {showFeaturedDialog, closeFeaturedDialog, postTag} = this.props;
    return <FeaturedDialog
      open={showFeaturedDialog}
      onCancel={closeFeaturedDialog}
      onPerform={postTag}
    />;
  }
}

FeaturedDialogContainer.propTypes = {
  showFeaturedDialog: PropTypes.func,
  closeFeaturedDialog: PropTypes.func,
  postTag: PropTypes.func,
};

const mapStateToProps = ({talkPluginFeaturedComments: state}) => ({
  showFeaturedDialog: state.showFeaturedDialog,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    closeFeaturedDialog,
  }, dispatch);

const enhance = compose(
  withTags('featured'),
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(FeaturedDialogContainer);
