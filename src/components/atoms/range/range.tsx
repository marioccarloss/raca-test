import {
  ChangeEvent,
  MouseEvent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './range.module.scss';

type RangeProps = {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
  step?: number;
  label?: string;
};

export function Range({
  min,
  max,
  value,
  onChange,
  step = 1,
  label,
}: RangeProps) {
  const [localValue, setLocalValue] = useState(value);
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
  const minRangeRef = useRef<HTMLInputElement>(null);
  const maxRangeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!dragging) {
      setLocalValue(value);
    }
  }, [value, dragging]);

  useEffect(() => {
    if (localValue.min > localValue.max - step) {
      setLocalValue(prev => ({
        ...prev,
        min: localValue.max - step,
      }));
    }

    if (localValue.max < localValue.min + step) {
      setLocalValue(prev => ({
        ...prev,
        max: localValue.min + step,
      }));
    }
  }, [localValue.min, localValue.max, step]);

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    const newValue = parseInt(inputValue, 10);

    if (name === 'min') {
      const updatedValue = {
        ...localValue,
        min: Math.min(newValue, localValue.max - step),
      };
      setLocalValue(updatedValue);
      onChange(updatedValue);
    } else if (name === 'max') {
      const updatedValue = {
        ...localValue,
        max: Math.max(newValue, localValue.min + step),
      };
      setLocalValue(updatedValue);
      onChange(updatedValue);
    }
  };

  const handleRangeEnd = () => {
    setDragging(null);
  };

  const handleMouseDown = (e: MouseEvent<HTMLInputElement>) => {
    setDragging(e.currentTarget.name as 'min' | 'max');
  };

  const handleTouchStart = (e: TouchEvent<HTMLInputElement>) => {
    setDragging(e.currentTarget.name as 'min' | 'max');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    const newValue = parseInt(inputValue, 10) || 0;

    if (name === 'min') {
      const updatedValue = {
        ...localValue,
        min: Math.min(Math.max(newValue, min), localValue.max - step),
      };
      setLocalValue(updatedValue);
      onChange(updatedValue);
    } else if (name === 'max') {
      const updatedValue = {
        ...localValue,
        max: Math.min(Math.max(newValue, localValue.min + step), max),
      };
      setLocalValue(updatedValue);
      onChange(updatedValue);
    }
  };

  const minPos = ((localValue.min - min) / (max - min)) * 100;
  const maxPos = ((localValue.max - min) / (max - min)) * 100;

  const minThumbClassName = `${styles.thumb} ${styles.thumbMin} ${
    dragging === 'min' ? styles.active : ''
  }`;
  const maxThumbClassName = `${styles.thumb} ${styles.thumbMax} ${
    dragging === 'max' ? styles.active : ''
  }`;

  return (
    <div className={styles.wrapper}>
      {label && <div className={styles.label}>{label}</div>}

      <div className={styles.inputs}>
        <input
          type="number"
          name="min"
          value={localValue.min}
          onChange={handleInputChange}
          min={min}
          max={max}
          className={styles.numberInput}
        />
        <span className={styles.separator}>-</span>
        <input
          type="number"
          name="max"
          value={localValue.max}
          onChange={handleInputChange}
          min={min}
          max={max}
          className={styles.numberInput}
        />
      </div>

      <div className={styles.rangeContainer}>
        <div className={styles.slider}>
          <div
            className={styles.track}
            style={{
              left: `${minPos}%`,
              width: `${maxPos - minPos}%`,
            }}
          />
        </div>

        <input
          ref={minRangeRef}
          type="range"
          name="min"
          min={min}
          max={max}
          value={localValue.min}
          onChange={handleRangeChange}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onMouseUp={handleRangeEnd}
          onTouchEnd={handleRangeEnd}
          onBlur={handleRangeEnd}
          step={step}
          className={minThumbClassName}
          aria-label="Valor mínimo"
        />

        <input
          ref={maxRangeRef}
          type="range"
          name="max"
          min={min}
          max={max}
          value={localValue.max}
          onChange={handleRangeChange}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onMouseUp={handleRangeEnd}
          onTouchEnd={handleRangeEnd}
          onBlur={handleRangeEnd}
          step={step}
          className={maxThumbClassName}
          aria-label="Valor máximo"
        />
      </div>
    </div>
  );
}
