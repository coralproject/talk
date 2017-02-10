import React from 'react';
import translations from '../../translations.json';
import I18n from 'coral-framework/modules/i18n/i18n';
const lang = new I18n(translations);

const StreamsTable = props => (
  <table className={'mdl-data-table'}>
    <thead>
    <tr>
        <th className="mdl-data-table__cell--non-numeric">
          {lang.t('streams.article')}
        </th>
        <th className="mdl-data-table__cell--non-numeric">
          {lang.t('streams.pubdate')}
        </th>
        <th className="mdl-data-table__cell--non-numeric">
          {lang.t('streams.status')}
        </th>
    </tr>
    </thead>
    <tbody>
    {props.rows.map((row, i)=> (
      <tr key={i}>
        <td className="mdl-data-table__cell--non-numeric">
          {row.title}
        </td>
        <td className="mdl-data-table__cell--non-numeric">
          {row.publication_date}
        </td>
        <td className="mdl-data-table__cell--non-numeric">
          {lang.t('streams.status')}
        </td>
      </tr>
    ))}
    </tbody>
  </table>
);

export default StreamsTable;
