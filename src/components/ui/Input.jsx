const Input = ({ label, id, placeholder, type = 'text', className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label 
          className="font-lexend text-sm text-on-surface-variant/80 ml-1" 
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-[14px] bg-surface-container-low border border-outline-variant/60 rounded-xl font-lexend text-sm text-on-surface placeholder:text-outline/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all duration-300 outline-none"
        {...props}
      />
    </div>
  );
};

export default Input;
