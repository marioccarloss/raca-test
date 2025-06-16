import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './navigation.module.scss';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/favoritos', label: 'Favoritos' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      {navLinks.map(link => {
        const isActive = location.pathname === link.to;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive: navActive }) =>
              navActive ? styles.activeLink : ''
            }
            style={{ position: 'relative' }}
          >
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="nav-active-bg"
                  className={styles.activeLink}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: -1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 40,
                  }}
                />
              )}
            </AnimatePresence>
            <span style={{ position: 'relative', zIndex: 1 }}>
              {link.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
