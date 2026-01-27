/**
 * Navbar.jsx - Navigation Bar Component
 * 
 * This component:
 * 1. Shows navigation links based on user authentication
 * 2. Displays logo and app name
 * 3. Highlights active route
 * 4. Displays user name and role
 * 5. Provides logout functionality with smooth animations
 * 
 * Used in: App.jsx (shown on all pages)
 */

import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Check if route is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/dashboard' || location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <Logo size="md" showText={true} />
          </Link>

          <div className="navbar-links">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" isActive={isActive('/dashboard')}>
                  Dashboard
                </NavLink>
                <NavLink to="/complaints" isActive={isActive('/complaints')}>
                  Complaints
                </NavLink>
                {/* Only show "New Complaint" for Citizens */}
                {user?.role === 'Citizen' && (
                  <NavLink to="/complaints/create" isActive={isActive('/complaints/create')}>
                    New Complaint
                  </NavLink>
                )}
                <NavLink to="/profile" isActive={isActive('/profile')}>
                  Profile
                </NavLink>
                <motion.div
                  className="navbar-user"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="user-name">{user?.name}</span>
                  <span className="user-role">({user?.role})</span>
                  <motion.button
                    onClick={handleLogout}
                    className="btn btn-outline btn-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </motion.div>
              </>
            ) : (
              <>
                <NavLink to="/login" isActive={isActive('/login')}>
                  Login
                </NavLink>
                <NavLink to="/register" isActive={isActive('/register')}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

// NavLink component with active state animation
const NavLink = ({ to, isActive, children }) => {
  return (
    <Link to={to} className="nav-link-wrapper">
      <motion.span
        className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.span>
      {isActive && (
        <motion.div
          className="nav-link-indicator"
          layoutId="activeIndicator"
          initial={false}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  )
}

export default Navbar
