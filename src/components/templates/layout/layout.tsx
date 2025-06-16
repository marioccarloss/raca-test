import { useAppSelector } from '../../../store/hooks';
import { Notification } from '../../molecules/notification';
import { FilterDrawer } from '../../organisms/filter-drawer/filter-drawer';
import { Modal } from '../../organisms/modal';
import { ProductGrid } from '../../organisms/product-grid/product-grid';
import { Header } from '../header/header';
import styles from './layout.module.scss';

export function Layout() {
  const modals = useAppSelector(state => state.ui.modals);
  const notifications = useAppSelector(state => state.ui.notifications);

  return (
    <div className="app">
      <Header />
      <main className={styles.main}>
        <div className="container">
          <ProductGrid />
        </div>
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
