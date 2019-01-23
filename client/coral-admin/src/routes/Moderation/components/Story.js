import React from 'react';
import PropTypes from 'prop-types';
import styles from './Story.css';
import t from 'coral-framework/services/i18n';

const formatDate = date => {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

const Story = ({ author, title, createdAt, open, id, goToStory }) => {
  return (
    <li className={styles.story} onClick={() => goToStory(id)}>
      <span className={styles.title}>{title}</span>
      <div className={styles.meta}>
        <span className={styles.author}>By {author}</span>
        <span className={styles.createdAt}>{formatDate(createdAt)}</span>
        <span className={styles.status}>
          {open ? t('streams.open') : t('streams.closed')}
        </span>
      </div>
    </li>
  );
};

Story.propTypes = {
  id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  goToStory: PropTypes.func.isRequired,
};

export default Story;
