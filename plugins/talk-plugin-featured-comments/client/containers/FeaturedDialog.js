import {compose} from 'react-apollo';
import {bindActionCreators} from 'redux';
import FeaturedDialog from '../components/FeaturedDialog';
import {withTags, connect} from 'plugin-api/beta/client/hocs';
import {closeFeaturedDialog} from '../actions';

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

export default enhance(FeaturedDialog);
