import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'coral-ui';

const EmptyCard = props => (
  <Card style={{ textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
    {props.children}
  </Card>
);

EmptyCard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EmptyCard;
