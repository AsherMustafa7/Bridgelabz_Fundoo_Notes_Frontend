import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/token';
import { logoutUser } from '../services/authService';

export const Navbar = ({ onToggleSidebar, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const user = getUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <header className="navbar-root">
      <div className="navbar-left">
        <button
          type="button"
          className="btn-icon btn-menu"
          onClick={onToggleSidebar}
          title="Main menu"
          aria-label="Toggle navigation menu"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>

        <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
          <div className="brand-logo-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#F4B400">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
            </svg>
          </div>
          <span className="navbar-brand-text">Fundoo Notes</span>
        </div>
      </div>

      <div className="navbar-center">
        <div className="search-bar">
          <button type="button" className="btn-search-icon" aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#5f6368">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search notes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#5f6368">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <div className="profile-container">
          <button
            type="button"
            className="profile-avatar-btn"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            title={user?.email || 'User Account'}
          >
            <span className="profile-initial">{userInitial}</span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <span className="profile-avatar-large">{userInitial}</span>
                <span className="profile-email">{user?.email || 'Active User'}</span>
              </div>
              <div className="profile-actions">
                <button
                  type="button"
                  className="btn-dropdown-logout"
                  onClick={handleLogout}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
