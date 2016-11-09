import React from 'react'
import styles from './Community.css'

const Table = ({ headers, data }) => (
  <table className={`mdl-data-table ${styles.dataTable}`}>
    <thead>
      <tr>
        {headers.map((header, i) =>(<th key={i} className="mdl-data-table__cell--non-numeric">{header}</th>))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i)=> (
        <tr key={i}>
          <td className="mdl-data-table__cell--non-numeric">
            {row.name}
            <span>{row.email}</span>
          </td>
          <td className="mdl-data-table__cell--non-numeric">
            {row.date}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default Table