type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: unknown }
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classNames: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classNames.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) {
        classNames.push(nested);
      }
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
          classNames.push(key);
        }
      }
    }
  }

  return classNames.join(' ');
}
