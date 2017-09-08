import React from 'react';
import PropTypes from 'prop-types';
import styles from './Pager.css';

const Rows = (curr, total, onClickHandler) => Array.from(Array(total)).map((e, i) =>
  <li className={curr === i ? styles.current : ''}
    key={i} onClick={() => onClickHandler(i + 1)}>
    {i + 1}
  </li>
);

const Pager = ({totalPages, page, onNewPageHandler}) => (
  <div className={styles.pager}>
    <ul>
      {
        (totalPages > page && totalPages > 1) ?
          <li
            onClick={() => onNewPageHandler(page - 1)}>
            Prev
          </li>
          :
          null
      }
      {Rows(page, totalPages, onNewPageHandler)}
      {
        (page < totalPages && totalPages > 1) ?
          <li
            onClick={() => onNewPageHandler(page + 1)}>
          Next
          </li>
          :
          null
      }
    </ul>
  </div>
);

Pager.propTypes = {
  totalPages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default Pager;
