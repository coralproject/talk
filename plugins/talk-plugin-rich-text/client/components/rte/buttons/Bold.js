import createToggle from '../factories/createToggle';

const execCommand = () => document.execCommand('bold');
const isActive = () => document.queryCommandState('bold');

const Bold = createToggle(execCommand, { isActive });

Bold.defaultProps = {
  children: 'Bold',
};

export default Bold;
