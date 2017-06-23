export const actionsMap = {
  PREMOD: ['APPROVE', 'REJECT'],
  FLAGGED: ['APPROVE', 'REJECT'],
  REJECTED: ['APPROVE', 'REJECTED']
};

export const menuActionsMap = {
  'REJECT': {status: 'REJECTED', text: 'reject', icon: 'close', key: 'f'},
  'REJECTED': {status: 'REJECTED', text: 'rejected', icon: 'close'},
  'APPROVE': {status: 'ACCEPTED', text: 'approve', icon: 'done', key: 'd'},
  'FLAGGED': {status: 'FLAGGED', text: 'flag', icon: 'flag', filter: 'Untouched'},
  'BAN': {status: 'BANNED', text: 'ban_user', icon: 'not interested'},
  '': {icon: 'done'}
};
