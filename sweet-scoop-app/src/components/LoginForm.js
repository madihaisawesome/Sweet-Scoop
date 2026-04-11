import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DisplayStatus from "./DisplayStatus";
import { loginUser } from "../api";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setMessageType("error");
      setMessage("Username and password cannot be empty.");
      return;
    }

    if (password.length < 8) {
      setMessageType("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    setMessageType("");
    setMessage("");
    try {
      await loginUser({
        username: username.trim(),
        password: password.trim(),
      });

      setMessageType("success");
      setMessage("Login successful");
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messageType !== "success") {
      return;
    }

    const redirectTimeout = setTimeout(() => {
      navigate("/flavors");
    }, 2000);

    return () => clearTimeout(redirectTimeout);
  }, [messageType, navigate]);

  return (
    <main className="mainsection login-main">
      <section className="login-section">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <a href="/forgot-password" onClick={(event) => event.preventDefault()}>
            Forgot Password?
          </a>
        </form>

        {message && <DisplayStatus type={messageType} message={message} />}
      </section>
    </main>
  );
}

export default LoginForm;
