import React from 'react';
import TagsInput from 'react-tagsinput';
import styles from './TagsInput.css';
import AutosizeInput from 'react-input-autosize';

const autosizingRenderInput = ({onChange, value, addTag: _, ...other}) =>
  <AutosizeInput type='text' onChange={onChange} value={value} {...other} />;

export default (props) => {
  return (
    <TagsInput
      addOnBlur={true}
      addOnPaste={true}
      pasteSplit={(data) => data.split(',').map((d) => d.trim())}
      className={styles.root}
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
