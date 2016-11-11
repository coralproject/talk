import React, {PropTypes} from 'react';
import styles from './Pager.css';

const Rows = (curr, total, onClickHandler) => Array.from(Array(total)).map((e, i) =>
  <li className={`mdl-button mdl-js-button ${styles.li} ${curr === i ? styles.current : ''}`}
      key={i} onClick={() => onClickHandler(i + 1)}>
    {i + 1}
  </li>
);

const Pager = ({totalPages, page, onNewPageHandler}) => (
  <div className="pager">
    <ul>
      {
        (totalPages > page) ?
          <li
            className={`mdl-button mdl-js-button ${styles.li}`}
            onClick={() => onNewPageHandler(page - 1)}>
            Prev
          </li>
        :
          null
      }
      {Rows(page, totalPages, onNewPageHandler)}
      {
        (page < totalPages) ?
        <li
          className={`mdl-button mdl-js-button ${styles.li}`}
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

