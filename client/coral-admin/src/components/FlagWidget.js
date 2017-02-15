import React, {PropTypes} from 'react';

const FlagWidget = () => {
  return (
    <table>
      <thead>
        <tr><th>Article</th><th>Flags</th></tr>
      </thead>
      <tbody>
        {/* display asset list as rows here */}
      </tbody>
    </table>
  );
};

FlagWidget.propTypes = {
  assets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
    count: PropTypes.number
  })).isRequired
};

export default FlagWidget;
