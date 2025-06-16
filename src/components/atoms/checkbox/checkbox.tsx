import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './checkbox.module.scss';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string;
  error?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const wrapperClasses = [
      styles.wrapper,
      error && styles['wrapper--error'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        <label className={styles.label}>
          <input
            ref={ref}
            type="checkbox"
            className={styles.input}
            {...props}
          />
          <span className={styles.checkmark}></span>
          <span className={styles.text}>{label}</span>
        </label>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
