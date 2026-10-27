import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded border transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2',
    xl: 'px-6 py-3 text-base gap-3 font-semibold',
    icon: 'p-2',
  };

  const variants = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    glass: 'button-secondary',
    cyan: 'button-primary',
    danger: 'button-danger',
    ghost: 'button-ghost',
    outline: 'button-secondary',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variants[variant] || variants.primary
      } ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
