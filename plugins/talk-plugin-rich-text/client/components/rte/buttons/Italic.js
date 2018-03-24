import createToggle from '../factories/createToggle';

const execCommand = () => document.execCommand('italic');
const isActive = () => document.queryCommandState('italic');

const Italic = createToggle(execCommand, { isActive });

Italic.defaultProps = {
  children: 'Italic',
};

export default Italic;
