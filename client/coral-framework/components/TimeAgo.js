import React from 'react';
import PropTypes from 'prop-types';
import { timeago } from 'coral-framework/services/i18n';
import cn from 'classnames';
import styles from './TimeAgo.css';

class TimeAgo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { timeago: true };
  }
  toggleDate = () => this.setState({ timeago: !this.state.timeago });
  render() {
    var displayTime = this.state.timeago
      ? timeago(this.props.datetime)
      : new Date(this.props.datetime).toLocaleString();

    var titleDate = !this.state.timeago
      ? timeago(this.props.datetime)
      : new Date(this.props.datetime).toLocaleString();
    return (
      <span
        onClick={this.toggleDate}
        className={cn(
          this.props.className,
          styles.timeago,
          'talk-comment-timeago'
        )}
        title={titleDate}
      >
        {displayTime}
      </span>
    );
  }
}

TimeAgo.propTypes = {
  datetime: PropTypes.string,
  className: PropTypes.string,
};

export default TimeAgo;
