import type { ReactNode } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { Notification } from '../../molecules/notification';
import { FilterDrawer } from '../../organisms/filter-drawer/filter-drawer';
import { Modal } from '../../organisms/modal';
import { Header } from '../../templates/header/header';
import { Navigation } from '../../templates/navigation/navigation';
import styles from './layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const modals = useAppSelector(state => state.ui.modals);
  const notifications = useAppSelector(state => state.ui.notifications);

  return (
    <div className="app">
      <Header />
      <Navigation />
      <main className={styles.main}>
        <div className="container">{children}</div>
      </main>
      <FilterDrawer />

      {modals
        .filter(modal => modal.isOpen)
        .map(modal => (
          <Modal
            key={modal.id}
            id={modal.id}
            component={modal.component}
            props={modal.props || {}}
          />
        ))}

      <div className="notificationsContainer">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            id={notification.id}
            type={notification.type}
            message={notification.message}
            duration={notification.duration || 3000}
          />
        ))}
      </div>
    </div>
  );
}
