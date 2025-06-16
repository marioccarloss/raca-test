import { useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { removeNotification } from '../../../store/slices/ui-slice';
import { NotificationType } from '../../../types';
import { Icon } from '../../atoms/icons/icon';

import styles from './notification.module.scss';

type NotificationProps = {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
};

export function Notification({
  id,
  type,
  message,
  duration = 3000,
}: NotificationProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeNotification(id));
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  const handleClose = () => {
    dispatch(removeNotification(id));
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Icon size="small" name="success" />;
      case 'error':
        return <Icon size="small" name="error" />;
      case 'warning':
        return <Icon size="small" name="warning" />;
      case 'info':
        return <Icon size="small" name="info" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.notification} ${styles[`notification--${type}`]}`}
    >
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeButton} onClick={handleClose}>
        <Icon size="small" name="close" />
      </button>
    </div>
  );
}
