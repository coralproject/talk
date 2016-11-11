import React from 'react';
import styles from './Community.css';

const Table = ({headers, data, onHeaderClickHandler}) => (
  <table className={`mdl-data-table ${styles.dataTable}`}>
    <thead>
      <tr>
        {headers.map((header, i) =>(
          <th
          key={i}
          className="mdl-data-table__cell--non-numeric"
          onClick={() => onHeaderClickHandler({field: header.field})}>
            {header.title}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i)=> (
        <tr key={i}>
          <td className="mdl-data-table__cell--non-numeric">
            {row.displayName}
            <span className={styles.email}>{row.profiles.map(({id}) => id)}</span>
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            {row.created_at}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
