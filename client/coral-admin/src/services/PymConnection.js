import Pym from '../../node_modules/pym.js';

const pym = new Pym.Child({polling: 100});
export default pym;

export const link = url => e => {
  e.preventDefault();
  pym.sendMessage('navigate', url);
};
