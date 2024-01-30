import React, { ButtonHTMLAttributes } from 'react';
import styles from './button.module.scss';
import classNames from 'classnames';
// import { Icon, IconProps } from '../Icon/icon';

export interface CommonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'filled' | 'outline';
  color?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  iconPosition?: 'left' | 'right';
  // icon?: IconProps['name'];
  children: string;
}

interface ButtonProps extends CommonButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  color = 'primary',
  fullWidth = false,
  // icon,
  iconPosition = 'left',
  isLoading = false,
  disabled = false,
  children,
  ...props // native button props
}) => {
  const rootStyle = classNames(styles.root, {
    [styles[variant]]: true,
    [styles[color]]: true,
    [styles.button]: true,
    [styles['full-width']]: fullWidth,
    [styles['icon-right']]: iconPosition === 'right',
  });

  const iconTheme = variant === 'filled' ? 'dark' : 'light';

  return (
    <button className={rootStyle} name={children} {...props} disabled={isLoading || disabled}>
      {/* {isLoading && <Icon name='spinner' theme={iconTheme} />}
      {!isLoading && <>{icon && <Icon name={icon} theme={iconTheme} />}</>} */}
      <span>{children}</span>
    </button>
  );
};
