function DisplayStatus({ type, message }) {
  const statusClass = type === "success" ? "status-success" : "status-error";

  return <div className={`status-message ${statusClass}`}>{message}</div>;
}

export default DisplayStatus;
