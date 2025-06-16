import { useState } from 'react';
import styles from './toggle.module.scss';

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}: ToggleProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;

    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <div className={`${styles.toggleContainer} ${className}`}>
      {label && <span className={styles.label}>{label}</span>}
      <button
        type="button"
        onClick={handleToggle}
        className={`${styles.toggle} ${isChecked ? styles.checked : ''} ${
          disabled ? styles.disabled : ''
        }`}
        disabled={disabled}
        aria-checked={isChecked}
        role="switch"
      >
        <span className={styles.slider} />
      </button>
    </div>
  );
}
