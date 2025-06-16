import { SelectHTMLAttributes, forwardRef } from 'react';
import styles from './select.module.scss';

type Option = {
  value: string;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'multiple'> & {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, error, helperText, className = '', disabled, ...props },
    ref
  ) => {
    const hasError = Boolean(error);

    const wrapperClasses = [
      styles.wrapper,
      hasError && styles['wrapper--error'],
      disabled && styles['wrapper--disabled'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
          </label>
        )}

        <div className={styles.selectWrapper}>
          <select
            ref={ref}
            className={styles.select}
            disabled={disabled}
            {...props}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className={styles.arrow}>
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {(error || helperText) && (
          <div className={styles.message}>{error || helperText}</div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
