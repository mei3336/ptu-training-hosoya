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
  return (
    <div className="input-container">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
        </label>
      )}

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

      {error && (
        <p className="input-error-message">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
