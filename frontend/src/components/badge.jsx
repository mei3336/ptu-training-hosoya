import "./badge.css";

function Badge({ role, children }) {
  const className =
    role === "admin"
      ? "badge badge-admin"
      : "badge badge-member";

  return (
    <span className={className}>
      {children}
    </span>
  );
}

export default Badge;
