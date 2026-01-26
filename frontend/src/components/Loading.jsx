/**
 * Loading.jsx - Loading Spinner Component
 * 
 * Simple loading indicator
 * Used when fetching data from API
 */

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <p>{message}</p>
    </div>
  )
}

export default Loading
