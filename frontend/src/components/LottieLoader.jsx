/**
 * LottieLoader.jsx - Loading Animation Component
 * 
 * This component:
 * 1. Displays a lightweight animated loading spinner
 * 2. Used during route changes and API calls
 * 3. Performance-optimized with CSS animations
 * 
 * Props:
 * - size: number (default: 100)
 * - message: string (optional loading message)
 */

import { motion } from 'framer-motion'

const LottieLoader = ({ size = 100, message = 'Loading...' }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4"
      style={{ minHeight: '200px', padding: '2rem' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated Spinner */}
      <motion.div
        style={{
          width: size,
          height: size,
          border: `4px solid rgba(0, 86, 179, 0.2)`,
          borderTop: `4px solid var(--primary-color)`,
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      {message && (
        <motion.p
          className="text-secondary text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  )
}

export default LottieLoader
