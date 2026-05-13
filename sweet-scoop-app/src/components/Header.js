// Header.js
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthState, getAuthState } from "../auth";

function Header() {
  const navigate = useNavigate();
  useLocation();
  const authState = getAuthState();

  const handleLogout = () => {
    clearAuthState();
    navigate("/");
  };

  return (
    <>
      <header>
        <img src="/images/logo.jpeg" alt="Sweet Scoop Logo" width="80" />
        <h1>Sweet Scoop Ice Cream Shop</h1>
        <div className="auth-control">
          {authState ? (
            <button type="button" className="auth-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button type="button" className="auth-button" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </header>

      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/flavors">Flavors</Link>
        <Link to="/order-history">Order History</Link>
        <Link to="/signup">Signup</Link>
      </div>
    </>
  );
}

export default Header;