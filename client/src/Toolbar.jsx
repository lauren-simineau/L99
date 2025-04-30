import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Toolbar.css';

function Toolbar({ onLogout }) {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <header className="toolbar">
      <nav className="toolbar-nav" aria-label="Main navigation">
        <div className="toolbar-links">
          <NavLink to="/dashboard" className="toolbar-link">Dashboard</NavLink>
          <NavLink to="/summary" className="toolbar-link">Summary</NavLink>
          <NavLink to="/reports" className="toolbar-link">Reports</NavLink>
        </div>
        {isLoggedIn && location.pathname !== '/login' && (
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

export default Toolbar;
