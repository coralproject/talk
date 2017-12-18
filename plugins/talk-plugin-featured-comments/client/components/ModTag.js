import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './ModTag.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import {getErrorMessages} from 'plugin-api/beta/client/utils';

export default class ModTag extends React.Component {
  constructor() {
    super();

    this.state = {
      on: false
    };

  }

  handleMouseEnter = (e) => {
    e.preventDefault();
    this.setState({
      on: true
    });
  }

  handleMouseLeave = (e) => {
    e.preventDefault();
    this.setState({
      on: false
    });
  }

  render() {
    const {alreadyTagged, deleteTag} = this.props;

    return alreadyTagged ? (
      <span className={cn(styles.tag, styles.featured)}
        onClick={deleteTag}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave} >
        <Icon name="star_outline" className={cn(styles.tagIcon)} />
        {!this.state.on ? t('talk-plugin-featured-comments.featured') : t('talk-plugin-featured-comments.un_feature')}
      </span>
    ) : (
      <span className={cn(styles.tag, {[styles.featured]: alreadyTagged})}
        onClick={this.props.openFeaturedDialog} >
        <Icon name="star_outline" className={cn(styles.tagIcon)} />
        {alreadyTagged ? t('talk-plugin-featured-comments.featured') : t('talk-plugin-featured-comments.feature')}
      </span>
    );
  }
}

ModTag.propTypes = {
  alreadyTagged: PropTypes.bool,
  deleteTag: PropTypes.func,
  notify: PropTypes.func,
  openFeaturedDialog: PropTypes.func,
};
