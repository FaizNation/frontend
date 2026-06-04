const Button = ({ children, onClick, type = 'button', className = '', variant = 'primary', ...props }) => {
  const baseStyles = 'font-lexend text-sm py-[16px] rounded-xl transition-all duration-300 flex justify-center items-center';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-surface-tint hover:shadow-lg',
    secondary: 'bg-secondary text-on-secondary hover:opacity-90',
    outline: 'border border-outline-variant/60 text-on-surface hover:bg-surface-container-low',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
