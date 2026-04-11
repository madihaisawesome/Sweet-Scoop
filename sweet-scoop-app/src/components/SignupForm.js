import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DisplayStatus from "./DisplayStatus";
import { signupUser } from "../api";

const USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9_-]{2,19}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!USERNAME_REGEX.test(trimmedUsername)) {
      setMessageType("error");
      setMessage(
        "Username must be 3-20 characters, start with a letter, and use only letters, numbers, underscores, or hyphens."
      );
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setMessageType("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setMessageType("error");
      setMessage(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessageType("error");
      setMessage("Confirm password must match password.");
      return;
    }

    setMessage("");
    setMessageType("");
    setIsSubmitting(true);

    try {
      const response = await signupUser({
        username: trimmedUsername,
        email: trimmedEmail,
        password,
      });

      setMessageType("success");
      setMessage(response?.message || "Registration successful.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mainsection login-main">
      <section className="login-section">
        <h2>Signup</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />

          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />

          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Signup"}
          </button>
          <Link to="/login">Back to Login</Link>
        </form>

        {message ? <DisplayStatus type={messageType} message={message} /> : null}
      </section>
    </main>
  );
}

export default SignupForm;
