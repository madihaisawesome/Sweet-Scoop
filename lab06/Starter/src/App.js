import { useState } from 'react';
import './App.css';
import TicTacToePage from './exercise2/TicTacToePage';
import UserDirectoryPage from './exercise1/UserDirectoryPage';

function App() {
  const [currentPage, setCurrentPage] = useState('directory');

  return (
    <main className="app-shell">
      <section className="panel">
        <h1>ENSF-381 Lab 06</h1>
      </section>

      <section className="panel">
        <div className="nav-buttons">
          <button
            className={`btn ${currentPage === 'directory' ? 'btn-active' : ''}`}
            
            onClick={() => setCurrentPage('directory')}
          >
            Exercise 1: User Directory
          </button>
          <button
            className={`btn ${currentPage === 'tictactoe' ? 'btn-active' : ''}`}
            
            onClick={() => setCurrentPage('tictactoe')}
          >
            Exercise 2: Tic-Tac-Toe
          </button>
        </div>
      </section>

      {currentPage === 'directory' ? <UserDirectoryPage /> : <TicTacToePage />}
    </main>
  );
}

export default App;
