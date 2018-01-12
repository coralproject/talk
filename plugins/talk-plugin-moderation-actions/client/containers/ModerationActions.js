import React from 'react';
import { bindActionCreators } from 'redux';
import { gql, compose } from 'react-apollo';
import { openMenu, closeMenu } from '../actions';
import { can } from 'plugin-api/beta/client/services';
import { getShallowChanges } from 'plugin-api/beta/client/utils';
import ModerationActions from '../components/ModerationActions';
import { connect, excludeIf, withFragments } from 'plugin-api/beta/client/hocs';

class ModerationActionsContainer extends React.Component {
  shouldComponentUpdate(nextProps) {
    // Specifically handle `showMenuForComment` if it is the only change.
    const changes = getShallowChanges(this.props, nextProps);
    if (changes.length === 1 && changes[0] === 'showMenuForComment') {
      const commentId = this.props.comment.id;
      if (
        commentId !== this.props.showMenuForComment &&
        commentId !== nextProps.showMenuForComment
      ) {
        return false;
      }
    }

    // Prevent Slot from rerendering when no props has shallowly changed.
    return changes.length !== 0;
  }

  toogleMenu = () => {
    if (this.props.showMenuForComment === this.props.comment.id) {
      this.props.closeMenu();
    } else {
      this.props.openMenu(this.props.comment.id);
    }
  };

  hideMenu = () => {
    if (this.props.showMenuForComment === this.props.comment.id) {
      this.props.closeMenu();
    }
  };

  render() {
    return (
      <ModerationActions
        data={this.props.data}
        root={this.props.root}
        asset={this.props.asset}
        comment={this.props.comment}
        toogleMenu={this.toogleMenu}
        hideMenu={this.hideMenu}
        menuVisible={this.props.showMenuForComment === this.props.comment.id}
      />
    );
  }
}

const mapStateToProps = ({ auth, talkPluginModerationActions: state }) => ({
  user: auth.user,
  showMenuForComment: state.showMenuForComment,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openMenu,
      closeMenu,
    },
    dispatch
  );

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFragments({
    root: gql`
      fragment TalkModerationActions_root on RootQuery {
        me {
          id
        }
      }
    `,
    asset: gql`
      fragment TalkModerationActions_asset on Asset {
        id
      }
    `,
    comment: gql`
      fragment TalkModerationActions_comment on Comment {
        id
        status
        user {
          id
        }
        tags {
          tag {
            name
          }
        }
      }
    `,
  }),
  excludeIf(props => !can(props.user, 'MODERATE_COMMENTS'))
);

export default enhance(ModerationActionsContainer);
