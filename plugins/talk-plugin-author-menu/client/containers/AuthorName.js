import React from 'react';
import {connect, withFragments} from 'plugin-api/beta/client/hocs';
import {bindActionCreators} from 'redux';
import AuthorName from '../components/AuthorName';
import {setContentSlot, resetContentSlot} from '../actions';
import {compose, gql} from 'react-apollo';
import {getSlotFragmentSpreads} from 'plugin-api/beta/client/utils';

class AuthorNameContainer extends React.Component {
  state = {
    menuVisible: false
  };

  toggleMenu = () => {
    this.setState({
      menuVisible: !this.state.menuVisible,
    });
  }

  hideMenu = () => {
    if (this.state.menuVisible) {
      this.setState({
        menuVisible: false
      });
      if (this.props.contentSlot) {
        this.props.resetContentSlot();
      }
    }
  }

  render() {
    return <AuthorName
      data={this.props.data}
      root={this.props.root}
      asset={this.props.asset}
      comment={this.props.comment}
      contentSlot={this.props.contentSlot}
      menuVisible={this.state.menuVisible}
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
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({setContentSlot, resetContentSlot}, dispatch);

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
