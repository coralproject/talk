import React from 'react';
import cn from 'classnames';
import styles from './Slot.css';
import {getSlotElements} from 'coral-framework/helpers/plugins';

export default function Slot ({fill, inline = false, ...rest}) {
  return (
    <div className={cn({[styles.inline]: inline})}>
      {getSlotElements(fill, rest)}
    </div>
  );
}

Slot.propTypes = {
  fill: React.PropTypes.string
};