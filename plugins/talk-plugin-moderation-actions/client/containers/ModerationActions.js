import React from 'react';
import {bindActionCreators} from 'redux';
import {gql, compose} from 'react-apollo';
import {openTooltip, closeTooltip} from '../actions';
import {can} from 'plugin-api/beta/client/services';
import {getShallowChanges} from 'plugin-api/beta/client/utils';
import ModerationActions from '../components/ModerationActions';
import {connect, excludeIf, withFragments} from 'plugin-api/beta/client/hocs';

class ModerationActionsContainer extends React.Component {

  shouldComponentUpdate(nextProps) {
    
    // Specifically handle `showTooltipForComment` if it is the only change.
    const changes = getShallowChanges(this.props, nextProps);
    if (changes.length === 1 && changes[0] === 'showTooltipForComment') {
      const commentId = this.props.comment.id;
      if (
        commentId !== this.props.showTooltipForComment &&
        commentId !== nextProps.showTooltipForComment
      ) {
        return false;
      }
    }
    
    // Prevent Slot from rerendering when no props has shallowly changed.
    return changes.length !== 0;
  }

  toogleTooltip = () => {
    if (this.props.showTooltipForComment === this.props.comment.id) {
      this.props.closeTooltip();
    } else {
      this.props.openTooltip(this.props.comment.id);
    }
  }

  hideTooltip = () => {
    if (this.props.showTooltipForComment === this.props.comment.id) {
      this.props.closeTooltip();
    }
  }

  render() {
    return <ModerationActions
      data={this.props.data}
      root={this.props.root}
      asset={this.props.asset}
      comment={this.props.comment}
      tooltipVisible={this.props.showTooltipForComment === this.props.comment.id}
      toogleTooltip={this.toogleTooltip}
      hideTooltip={this.hideTooltip}
    />;
  }
}

const mapStateToProps = ({auth, talkPluginModerationActions: state}) => ({
  user: auth.user,
  showTooltipForComment: state.showTooltipForComment,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    openTooltip,
    closeTooltip,
  }, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFragments({
    asset: gql`
      fragment TalkModerationActions_asset on Asset {
        id
      }`
    ,
    comment: gql`
      fragment TalkModerationActions_comment on Comment {
        id
        status
        tags {
          tag {
            name
          }
        }
      }
  `}),
  excludeIf((props) => !can(props.user, 'MODERATE_COMMENTS')),
);

export default enhance(ModerationActionsContainer);
