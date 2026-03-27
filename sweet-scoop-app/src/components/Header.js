import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <header>
        <img
          src="/images/logo.png"
          alt="Sweet Scoop Logo"
          width="80"
        />
        <h1>Sweet Scoop</h1>
      </header>

      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/flavors">Flavors</Link>
        <Link to="/login">Login</Link>
      </div>
    </>
  );
}

export default Header;