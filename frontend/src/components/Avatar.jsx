import "./Avatar.css";

function Avatar({ src, fallback, className }) {
  return (
    <div className={`avatar ${className}`}>
      {src ? (
        <img src={src} alt="" />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}

export default Avatar;
