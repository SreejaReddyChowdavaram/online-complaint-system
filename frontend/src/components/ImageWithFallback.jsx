import React, { useState } from 'react'
import { Image as ImageIcon, AlertCircle } from 'lucide-react'
import { getImgUrl } from '../utils/complaintUtils'

/**
 * A robust image component with loading state, error fallback, 
 * and standardized object-fit.
 */
const ImageWithFallback = ({ 
  src, 
  alt = "Complaint Evidence", 
  className = "", 
  fallback = null 
}) => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const resolvedUrl = getImgUrl(src)

  if (!resolvedUrl || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 gap-2 border border-slate-200 dark:border-slate-800 ${className}`}>
        {fallback || (
          <>
            <ImageIcon size={24} className="opacity-20" />
            <span className="text-[10px] uppercase tracking-widest font-black opacity-30">No Image</span>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 animate-pulse">
          <ImageIcon size={16} className="text-slate-300" />
        </div>
      )}
      <img
        src={resolvedUrl}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
        loading="lazy"
      />
    </div>
  )
}

export default ImageWithFallback
