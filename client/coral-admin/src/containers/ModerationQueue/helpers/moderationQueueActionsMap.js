export const actionsMap = {
  PREMOD: ['REJECT', 'APPROVE', 'BAN'],
  FLAGGED: ['REJECT', 'APPROVE', 'BAN'],
  REJECTED: ['APPROVE']
};

export const menuActionsMap = {
  'REJECT': {status: 'REJECTED', icon: 'close', key: 'r'},
  'APPROVE': {status: 'ACCEPTED', icon: 'done', key: 't'},
  'FLAGGED': {status: 'FLAGGED', icon: 'flag', filter: 'Untouched'},
  'BAN': {status: 'BANNED', icon: 'not interested'},
  '': {icon: 'done'}
};
