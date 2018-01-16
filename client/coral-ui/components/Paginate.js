import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import styles from './Paginate.css';
import Icon from './Icon';

const Paginate = ({ pageCount, page, onPageChange }) => (
  <ReactPaginate
    initialPage={0}
    forcePage={page}
    pageCount={pageCount}
    pageRangeDisplayed={5}
    marginPagesDisplayed={2}
    onPageChange={onPageChange}
    breakClassName={styles.break}
    containerClassName={styles.container}
    pageClassName={styles.page}
    pageLinkClassName={styles.pageLink}
    activeClassName={styles.active}
    previousLabel={<Icon name="chevron_left" />}
    previousClassName={styles.previous}
    previousLinkClassName={styles.previousLink}
    nextLabel={<Icon name="chevron_right" />}
    nextClassName={styles.next}
    nextLinkClassName={styles.nextLink}
  />
);

Paginate.propTypes = {
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Paginate;
