import React from 'react';
import {SnackBar} from 'coral-ui';

const Notification = (props) => {
  if (props.notification.text) {

    // setTimeout(() => {
    //   props.clearNotification();
    // }, props.notifLength);
  }
  return <div>
  {
    props.notification.text &&
    <SnackBar id='coral-notif' className={`coral-notif-${props.notification.type}`}>
      {props.notification.text}
    </SnackBar>
  }
  </div>;
};

export default Notification;
