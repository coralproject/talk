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

export function showMutationErrors(error) {
  console.error(error);
  if (error.errors) {
    error.errors.forEach((err) => {
      toast(
        err.translation_key ? t(`error.${err.translation_key}`) : err,
        {type: 'error'}
      );
    });
  }
}
