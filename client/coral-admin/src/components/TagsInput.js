import React from 'react';
import TagsInput from 'react-tagsinput';
import styles from './TagsInput.css';
import AutosizeInput from 'react-input-autosize';
import PropTypes from 'prop-types';
import cn from 'classnames';

const autosizingRenderInput = ({ onChange, value, addTag: _, ...other }) => (
  <AutosizeInput type="text" onChange={onChange} value={value} {...other} />
);

autosizingRenderInput.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  addTag: PropTypes.func,
};

const TagsInputComponent = ({ className = '', ...props }) => {
  return (
    <TagsInput
      addOnBlur={true}
      addOnPaste={true}
      pasteSplit={data => data.split(',').map(d => d.trim())}
      className={cn(styles.root, 'tags-input', className)}
      focusedClassName={styles.rootFocus}
      renderInput={autosizingRenderInput}
      {...props}
      tagProps={{
        className: styles.tag,
        classNameRemove: styles.tagRemove,
        ...props.tagProps,
      }}
      inputProps={{
        className: styles.input,
        ...props.inputProps,
      }}
    />
  );
};

TagsInputComponent.propTypes = {
  className: PropTypes.string,
  inputProps: PropTypes.object,
  tagProps: PropTypes.object,
};

export default TagsInputComponent;
