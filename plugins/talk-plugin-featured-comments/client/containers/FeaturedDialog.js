import { compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import FeaturedDialog from '../components/FeaturedDialog';
import { withTags, connect } from 'plugin-api/beta/client/hocs';
import { closeFeaturedDialog } from '../actions';

const mapStateToProps = ({ talkPluginFeaturedComments: state }) => ({
  showFeaturedDialog: state.showFeaturedDialog,
  comment: state.comment,
  asset: state.asset,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      closeFeaturedDialog,
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTags('featured')
);

export default enhance(FeaturedDialog);
