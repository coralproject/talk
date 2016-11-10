import React, {PropTypes} from 'react';
import styles from './Pager.css';

const Rows = (curr, total) => {
  let items = [];
  for (let i = 0; i <= total; i++) {
    items[i] = <li className={`mdl-button mdl-js-button ${styles.li} ${curr === i ? styles.current : ''}`} key={i}>{i}</li>;
  }
  return items;
};

const Pager = ({totalPages, currentPage, onNext, onPrev}) => (
  <div className="pager">
    <ul>
      <li
        className={`mdl-button mdl-js-button ${styles.li}`}
        onClick={onPrev}>
        Prev
      </li>
      {Rows(currentPage, totalPages)}
      <li
        className={`mdl-button mdl-js-button ${styles.li}`}
        onClick={onNext}>
        Next
      </li>
    </ul>
  </div>
);

Pager.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired
};

export default Pager;

