import {getClient as getFrameworkClient} from 'coral-framework/services/client';
import fragmentMatcher from './fragmentMatcher';

export function getClient() {
  return getFrameworkClient({fragmentMatcher});
}
