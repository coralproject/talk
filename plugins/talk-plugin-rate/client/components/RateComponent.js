import React from 'react';
import styles from './RateComponent.css';
import { withReaction } from 'plugin-api/beta/client/hocs';

const RateComponent = React.createClass({
  propTypes: {
    disabled: React.PropTypes.bool,
  },
  getInitialState() {
    const { count, alreadyReacted } = this.props;
    return {
      rating: alreadyReacted ? count : null,
      temp_rating: null,
    };
  },
  rate(rating) {
    const {
      postReaction,
      // deleteReaction,
      // alreadyReacted,
      showSignInDialog,
      user,
    } = this.props;
    if (!user) {
      showSignInDialog();
      return;
    }
    postReaction();
    this.setState({
      rating: rating,
      temp_rating: rating,
    });
  },
  star_over(rating) {
    this.state.temp_rating = this.state.rating;
    this.state.rating = rating;
    this.setState({
      rating: this.state.rating,
      temp_rating: this.state.temp_rating,
    });
  },
  star_out() {
    this.state.rating = this.state.temp_rating;
    this.setState({ rating: this.state.rating });
  },
  render() {
    var stars = [];
    for (var i = 0; i < 5; i++) {
      var klass = styles['star-rating__star'];
      if (this.state.rating >= i && this.state.rating != null) {
        klass += ' ' + styles['is-selected'];
      }
      stars.push(
        <label
          className={klass}
          onClick={this.rate.bind(this, i)}
          onMouseOver={this.star_over.bind(this, i)}
          onMouseOut={this.star_out}
        >
          ★
        </label>
      );
    }
    return <div className={styles['star-rating']}>{stars}</div>;
  },
});

export default withReaction('rate')(RateComponent);
