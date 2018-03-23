import createToggle from '../factories/createToggle';

const execCommand = () => document.execCommand('italic');
const syncState = () => document.queryCommandState('italic');

const Italic = createToggle(execCommand, syncState);

Italic.defaultProps = {
  children: 'Italic',
};

export default Italic;
