/**
 * ErrorMessage.jsx - Error Display Component
 * 
 * Displays error messages in a user-friendly way
 * Used throughout the app for API errors
 */

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="error">
      <div className="flex-between">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="btn btn-sm" style={{ marginLeft: '1rem' }}>
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
