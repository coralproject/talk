export {t, timeago} from 'coral-framework/services/i18n';
export {can} from 'coral-framework/services/perms';
import {isSlotEmpty as ise} from 'coral-framework/helpers/plugins';

// @TODO: Deprecated.
export function isSlotEmpty(...args) {
  console.warn('A plugin is using `isSlotEmpty` which has been deprecated, please port to the new API using the `IfSlotIsEmpty` and `IfSlotIsNotEmpty` components.');
  return ise(...args);
}
