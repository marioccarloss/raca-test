import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import styles from './input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isLoading = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);
    const hasIcons = Boolean(leftIcon || rightIcon);

    const wrapperClasses = [
      styles.wrapper,
      hasError && styles['wrapper--error'],
      disabled && styles['wrapper--disabled'],
      isLoading && styles['wrapper--loading'],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      styles.input,
      hasIcons && styles['input--with-icons'],
      leftIcon && styles['input--with-left-icon'],
      rightIcon && styles['input--with-right-icon'],
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

        <div className={styles.container}>
          {leftIcon && <div className={styles.icon}>{leftIcon}</div>}

          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled || isLoading}
            {...props}
          />

          {rightIcon && <div className={styles.icon}>{rightIcon}</div>}

          {isLoading && (
            <div className={styles.spinner}>
              <div className={styles.spinner__circle} />
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div className={styles.message}>{error || helperText}</div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
