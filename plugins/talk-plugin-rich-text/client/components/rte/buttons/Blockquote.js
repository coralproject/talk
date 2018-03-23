import createToggle from '../factories/createToggle';
import { hasAncestor } from '../utils';
import bowser from 'bowser';

const execCommand = () => {
  if (hasAncestor('BLOCKQUOTE')) {
    document.execCommand('outdent');
  } else {
    if (bowser.msie) {
      document.execCommand('indent');
    } else {
      document.execCommand('formatBlock', false, 'blockquote');
    }
  }
};

const syncState = () => {
  return hasAncestor('BLOCKQUOTE');
};

const Blockquote = createToggle(execCommand, syncState);

Blockquote.defaultProps = {
  children: 'Blockquote',
};

export default Blockquote;
