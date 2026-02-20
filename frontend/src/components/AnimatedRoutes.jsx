/**
 * AnimatedRoutes.jsx - Page Transition Wrapper
 * 
 * This component:
 * 1. Wraps React Router Routes with Framer Motion AnimatePresence
 * 2. Provides smooth page transitions (fade + slide)
 * 3. Ensures proper exit animations before route change
 * 4. Performance-optimized with layout animations
 * 
 * Usage: Wrap <Routes> component with this
 */

import { useLocation, Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const AnimatedRoutes = ({ children }) => {
  const location = useLocation()

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] // Custom easing for smooth feel
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        style={{ width: '100%', minHeight: '100%', flex: 1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimatedRoutes
