export const actionsMap = {
  PREMOD: ['APPROVE', 'REJECT'],
  FLAGGED: ['APPROVE', 'REJECT'],
  REJECTED: ['APPROVE', 'REJECTED']
};

export const menuActionsMap = {
  'REJECT': {status: 'REJECTED', text: 'Reject', icon: 'close', key: 'r'},
  'REJECTED': {status: 'REJECTED', text: 'Rejected', icon: 'close'},
  'APPROVE': {status: 'ACCEPTED', text: 'Approve', icon: 'done', key: 't'},
  'FLAGGED': {status: 'FLAGGED', text: 'Flag', icon: 'flag', filter: 'Untouched'},
  'BAN': {status: 'BANNED', text: 'Ban User', icon: 'not interested'},
  '': {icon: 'done'}
};
