import t from 'coral-framework/services/i18n';
import {toast} from 'react-toastify';

export function success(msg) {
  return toast(msg, {type: 'success'});
}

export function error(msg) {
  return toast(msg, {type: 'error'});
}

export function info(msg) {
  return toast(msg, {type: 'info'});
}

export function showMutationErrors(err) {
  const errors = Array.isArray(err) ? err : [err];
  errors.forEach((err) => {
    console.error(err);
    toast(
      err.translation_key ? t(`errors.${err.translation_key}`) : err,
      {type: 'error'}
    );
  });
}
