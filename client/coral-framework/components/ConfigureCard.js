import React from 'react';
import PropTypes from 'prop-types';
import styles from './ConfigureCard.css';
import { Card } from 'coral-ui';
import { Checkbox } from 'react-mdl';
import cn from 'classnames';

const ConfigureCard = ({
  title,
  children,
  className,
  onCheckbox,
  checked,
  ...rest
}) => (
  <Card
    {...rest}
    className={cn(styles.card, className, {
      [styles.enabledSetting]: checked === true,
      [styles.disabledSetting]: checked === false,
    })}
  >
    {checked !== undefined && (
      <div className={styles.action}>
        <Checkbox onChange={onCheckbox} checked={checked} />
      </div>
    )}
    <div
      className={cn(styles.wrapper, {
        [styles.content]: checked !== undefined,
      })}
    >
      <div className={styles.header}>{title}</div>
      <div
        className={cn({
          [styles.disabledSettingText]: checked === false,
        })}
      >
        {children}
      </div>
    </div>
  </Card>
);

ConfigureCard.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  onCheckbox: PropTypes.func,
  checked: PropTypes.bool,
  children: PropTypes.node,
};

export default ConfigureCard;
