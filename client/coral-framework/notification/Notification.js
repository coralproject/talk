import React from 'react';

const Notification = (props) => {
  if (props.notification.text) {
    setTimeout(() => {
      props.clearNotification();
    }, props.notifLength);
  }
  return <div>
  {
    props.notification.text &&
    <dialog open id='coral-notif' className={`coral-notif-${  props.notification.type}`}>
      {props.notification.text}
    </dialog>
  }
  </div>;
};

export default Notification;
