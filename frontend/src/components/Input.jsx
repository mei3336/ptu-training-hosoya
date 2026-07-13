import { useState } from "react";
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
  const [isRevealed, setIsRevealed] = useState(false);
  const isPassword = type === "password";
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

      <div className="input-field-wrapper">
        <input
          id={name}
          name={name}
          type={isPassword && isRevealed ? "text" : type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`input-field ${isPassword ? "input-field-with-toggle" : ""} ${error ? "input-error" : ""}`}
        />

        {isPassword && (
          <button
            type="button"
            className="input-toggle-visibility"
            onClick={() => setIsRevealed((prev) => !prev)}
            aria-label={isRevealed ? "パスワードを非表示にする" : "パスワードを表示する"}
          >
            {isRevealed ? "非表示" : "表示"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Input;
