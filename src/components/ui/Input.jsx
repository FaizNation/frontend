const Input = ({ label, id, placeholder, type = 'text', className = '', error, ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label 
          className={`font-lexend text-sm ml-1 transition-colors duration-300 ${error ? 'text-red-500 font-bold' : 'text-on-surface-variant/80'}`} 
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-5 py-[14px] bg-surface-container-low border rounded-[18px] font-lexend text-sm text-on-surface placeholder:text-outline/40 transition-all duration-300 outline-none ${
          error 
            ? 'border-red-500 bg-red-50/10 focus:ring-4 focus:ring-red-500/5' 
            : 'border-outline-variant/60 focus:border-primary/50 focus:ring-4 focus:ring-primary/5'
        }`}
        {...props}
      />
      {error && (
        <p className="text-[11px] text-red-600 font-bold ml-1 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
