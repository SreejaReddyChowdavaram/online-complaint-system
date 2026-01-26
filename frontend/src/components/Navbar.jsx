/**
 * Navbar.jsx - Navigation Bar Component
 * 
 * This component:
 * 1. Shows navigation links based on user authentication
 * 2. Displays user name and role
 * 3. Provides logout functionality
 * 
 * Used in: App.jsx (shown on all pages)
 */

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <h2>JAN SUVIDHA</h2>
          </Link>

          <div className="navbar-links">
            {isAuthenticated ? (
              <>
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/complaints" className="nav-link">Complaints</Link>
                {/* Only show "New Complaint" for Citizens */}
                {user?.role === 'Citizen' && (
                  <Link to="/complaints/create" className="nav-link">New Complaint</Link>
                )}
                <Link to="/profile" className="nav-link">Profile</Link>
                <div className="navbar-user">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-role">({user?.role})</span>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
