import t from 'coral-framework/services/i18n';

export default {
  premod: {
    statuses: ['PREMOD'],
    icon: 'access_time',
    name: t('modqueue.premod'),
  },
  new: {
    statuses: ['NONE', 'PREMOD'],
    icon: 'question_answer',
    name: t('modqueue.new'),
  },
  reported: {
    action_type: 'FLAG',
    statuses: ['NONE', 'PREMOD'],
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
    statuses: ['NONE', 'PREMOD', 'ACCEPTED', 'REJECTED'],
    icon: 'question_answer',
    name: t('modqueue.all'),
  },
};
