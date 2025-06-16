import { cn } from '../../../utils/cn';
import * as icons from './index';

import styles from './icon.module.scss';

export type IconsType = keyof typeof icons;

interface IndividualIconSvgProps extends React.SVGProps<SVGSVGElement> {
  className?: string | undefined;
}

export interface IconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'name' | 'className'> {
  name: IconsType;
  size?: 'small' | 'medium' | 'large' | 'full';
  className?: string | undefined;
  'data-filled'?: boolean | string;
  svgProps?: IndividualIconSvgProps;
}

const iconsMap: Record<
  IconsType,
  React.ComponentType<IndividualIconSvgProps>
> = {
  ...(icons as Record<IconsType, React.ComponentType<IndividualIconSvgProps>>),
};

export const Icon = ({
  size = 'small',
  name,
  className,
  'data-filled': dataFilled,
  svgProps,
  ...spanProps
}: IconProps) => {
  const IconComponent = iconsMap[name];

  if (!IconComponent) {
    return null;
  }

  return (
    <span
      className={cn(styles[`icon--${size}`], className)}
      {...(dataFilled !== undefined && { 'data-filled': String(dataFilled) })}
      {...spanProps}
    >
      <IconComponent {...svgProps} />
    </span>
  );
};
