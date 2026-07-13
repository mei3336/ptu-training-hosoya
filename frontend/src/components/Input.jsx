import "./Input.css";

function Input({
  label,
  description,
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  error,
}) {
  const errorMessages = Array.isArray(error)
  ? error
  : error
    ? [error]
    : [];
  return (
    <div className="input-container">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
        </label>
      )}
      
      {errorMessages.map((message, index) => (
        <p key={index} className="input-error-message">
          {message}
        </p>
      ))}      

      {description && (
        <p className="input-description">
          {description}
        </p>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`input-field ${error ? "input-error" : ""}`}
      />
    </div>
  );
}

export default Input;
