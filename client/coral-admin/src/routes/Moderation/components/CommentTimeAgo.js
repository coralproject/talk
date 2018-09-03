import React from 'react';
import PropTypes from 'prop-types';
import { timeago } from 'coral-framework/services/i18n';

class CommentTimeAgo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { timeago: true };
  }
  toggleDate() {
    this.setState({ timeago: !this.state.timeago });
  }
  render() {
    return (
      <div onClick={this.toggleDate.bind(this)}>
        {this.state.timeago && timeago(this.props.date)}
        {!this.state.timeago && new Date(this.props.date).toLocaleString()}
      </div>
    );
  }
}

CommentTimeAgo.propTypes = {
  date: PropTypes.string,
};

export default CommentTimeAgo;
