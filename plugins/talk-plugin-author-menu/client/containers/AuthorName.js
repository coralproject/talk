import React from 'react';
import {connect, withFragments} from 'plugin-api/beta/client/hocs';
import {bindActionCreators} from 'redux';
import AuthorName from '../components/AuthorName';
import {setContentSlot, resetContentSlot, openMenu, closeMenu} from '../actions';
import {compose, gql} from 'react-apollo';
import {getSlotFragmentSpreads} from 'plugin-api/beta/client/utils';

class AuthorNameContainer extends React.Component {

  toggleMenu = () => {
    if (this.props.showMenuForComment === this.props.comment.id) {
      this.props.closeMenu();
    } else {
      this.props.openMenu(this.props.comment.id);
    }
  }

  hideMenu = () => {
    if (this.props.showMenuForComment === this.props.comment.id) {
      this.props.closeMenu();
    }
  }

  render() {
    return <AuthorName
      data={this.props.data}
      root={this.props.root}
      asset={this.props.asset}
      comment={this.props.comment}
      contentSlot={this.props.contentSlot}
      menuVisible={this.props.showMenuForComment === this.props.comment.id}
      toggleMenu={this.toggleMenu}
      hideMenu={this.hideMenu}
    />;
  }
}

const slots = [
  'authorMenuInfos',
  'authorMenuActions',
];

const mapStateToProps = ({talkPluginAuthorMenu: state}) => ({
  contentSlot: state.contentSlot,
  showMenuForComment: state.showMenuForComment,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    setContentSlot,
    resetContentSlot,
    openMenu,
    closeMenu,
  }, dispatch);

const withAuthorNameFragments = withFragments({
  root: gql`
    fragment TalkAuthorMenu_AuthorName_root on RootQuery {
      __typename
      ${getSlotFragmentSpreads(slots, 'root')}
    }`,
  asset: gql`
    fragment TalkAuthorMenu_AuthorName_asset on Asset {
      __typename
      ${getSlotFragmentSpreads(slots, 'asset')}
    }`,
  comment: gql`
    fragment TalkAuthorMenu_AuthorName_comment on Comment {
      __typename
      id
      user {
        username
      }
      ${getSlotFragmentSpreads(slots, 'comment')}
    }`,
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAuthorNameFragments,
);

export default enhance(AuthorNameContainer);
