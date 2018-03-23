import createToggle from '../factories/createToggle';

const execCommand = () => document.execCommand('bold');
const syncState = () => document.queryCommandState('bold');

const Bold = createToggle(execCommand, syncState);

Bold.defaultProps = {
  children: 'Bold',
};

export default Bold;
