import t from 'coral-framework/services/i18n';

export default {
  new: {
    statuses: ['NONE'],
    icon: 'question_answer',
    name: t('modqueue.new'),
  },
  premod: {
    statuses: ['PREMOD'],
    icon: 'access_time',
    name: t('modqueue.premod'),
  },
  reported: {
    action_type: 'FLAG',
    statuses: ['NONE', 'PREMOD', 'SYSTEM_WITHHELD'],
    icon: 'flag',
    name: t('modqueue.reported'),
  },
  approved: {
    statuses: ['ACCEPTED'],
    icon: 'check',
    name: t('modqueue.approved'),
  },
  rejected: {
    statuses: ['REJECTED'],
    icon: 'close',
    name: t('modqueue.rejected'),
  },
  all: {
    icon: 'question_answer',
    name: t('modqueue.all'),
  },
};
