import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DisplayStatus from "./DisplayStatus";

const USERS_API_URL = "https://jsonplaceholder.typicode.com/users";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [requestId, setRequestId] = useState(0);
  const [authPayload, setAuthPayload] = useState({ username: "", password: "" });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
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

    setMessageType("");
    setMessage("");
    setAuthPayload({ username: username.trim(), password: password.trim() });
    setRequestId((prev) => prev + 1);
  };

  useEffect(() => {
    if (requestId === 0) {
      return;
    }

    let isCancelled = false;

    const authenticateUser = async () => {
      try {
        const response = await fetch(USERS_API_URL);

        if (!response.ok) {
          throw new Error("Unable to fetch users");
        }

        const users = await response.json();
        const matchedUser = users.find(
          (user) =>
            user.username === authPayload.username &&
            user.email.toLowerCase() === authPayload.password.toLowerCase()
        );

        if (isCancelled) {
          return;
        }

        if (matchedUser) {
          setMessageType("success");
          setMessage("Login successful");
        } else {
          setMessageType("error");
          setMessage("Invalid username or password.");
        }
      } catch {
        if (!isCancelled) {
          setMessageType("error");
          setMessage("Login failed. Please try again.");
        }
      }
    };

    authenticateUser();

    return () => {
      isCancelled = true;
    };
  }, [requestId, authPayload]);

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
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit">Login</button>
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
