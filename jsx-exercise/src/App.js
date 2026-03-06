import './App.css';
import Controls from './Controls';
import UserList from './UserList';
import Footer from './Footer';

function App() {
  const currentYear = new Date().getFullYear();
  const isLoggedIn = true;

  return (
    <div className="App">
      <h1>ENSF-381: Full Stack Web Development</h1>
      <p>React Components</p>
      <p>{currentYear}</p>
      <p>{isLoggedIn ? 'Welcome back!' : 'Please log in.'}</p>

      {isLoggedIn && (
        <>
          <section className="controls-section">
            <Controls />
          </section>

          <section className="users-section">
            <h2>User List</h2>
            <UserList />
          </section>

          <Footer />
        </>
      )}
    </div>
  );
}

export default App;