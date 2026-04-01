/**
 * CreateComplaint.jsx - Create Complaint Page
 * 
 * This page handles:
 * 1. Form input for complaint details
 * 2. Multi-image file selection and preview
 * 3. FormData construction for multipart/form-data submission
 * 4. Robust validation and debugging logs
 */

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useComplaint } from '../../context/ComplaintContext'
import ErrorMessage from '../../components/ErrorMessage'
import { 
  Upload, 
  MapPin, 
  Type, 
  AlignLeft, 
  Layers, 
  X, 
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import './CreateComplaint.css'

const CreateComplaint = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { createComplaint, loading, error } = useComplaint()

  // Flattened form data for easier mapping to FormData
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    address: '',
    latitude: '',
    longitude: ''
  })

  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [formError, setFormError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formError) setFormError('')
  }

  // Handle multi-file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    
    // Validation: Max 5 images
    if (images.length + selectedFiles.length > 5) {
      setFormError(t('complaints.upload_hint'))
      return
    }

    // Validation: File types and size (5MB per file)
    const validFiles = []
    const newPreviews = []

    selectedFiles.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setFormError(`File ${file.name} is not an image`)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError(`File ${file.name} is too large (max 5MB)`)
        return
      }
      validFiles.push(file)
      newPreviews.push(URL.createObjectURL(file))
    })

    console.log("📁 Files selected:", validFiles.map(f => f.name))
    setImages(prev => [...prev, ...validFiles])
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    const updatedImages = [...images]
    const updatedPreviews = [...previews]
    
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(updatedPreviews[index])
    
    updatedImages.splice(index, 1)
    updatedPreviews.splice(index, 1)
    
    setImages(updatedImages)
    setPreviews(updatedPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    
    console.log("🚀 Starting Submission Process...")

    // 1. Validation Logic
    if (!formData.title || !formData.category || !formData.description) {
      console.error("❌ Validation Failed: Missing required text fields")
      setFormError(t('complaints.placeholder_description'))
      return
    }

    if (!formData.address || !formData.latitude || !formData.longitude) {
      console.error("❌ Validation Failed: Missing location data")
      setFormError(t('complaints.location_hint'))
      return
    }

    if (images.length === 0) {
      console.error("❌ Validation Failed: No images uploaded")
      setFormError(t('complaints.evidence_upload'))
      return
    }

    // 2. FormData Construction
    const submissionData = new FormData()
    
    // Append text fields
    submissionData.append('title', formData.title)
    submissionData.append('category', formData.category)
    submissionData.append('description', formData.description)
    submissionData.append('address', formData.address)
    submissionData.append('latitude', formData.latitude)
    submissionData.append('longitude', formData.longitude)

    // Append files (matching backend field name "files")
    images.forEach((file, index) => {
      submissionData.append('files', file)
      console.log(`📎 Appending file [${index}]:`, file.name)
    })

    console.log("📡 Sending Multipart Request to Backend...")
    
    try {
      // 3. API Call
      const result = await createComplaint(submissionData)

      if (result.success) {
        console.log("✅ Complaint Created Successfully:", result.data)
        setIsSuccess(true)
        setTimeout(() => {
          navigate(`/complaints/${result.data._id}`)
        }, 1500)
      } else {
        console.error("❌ API Error:", result.error)
        setFormError(result.error || t('complaints.submit_error'))
      }
    } catch (err) {
      console.error("🔥 Unexpected Submission Error:", err)
      setFormError(t('complaints.submit_error'))
    }
  }

  return (
    <div className="create-complaint-page px-4">
      <div className="max-w-4xl mx-auto py-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-3">
            {t('complaints.register_title')}
          </h1>
          <p className="text-slate-500 font-medium">
            {t('complaints.register_subtitle')}
          </p>
        </header>

        {isSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 animate-pulse">
            <CheckCircle size={20} />
            <span className="font-bold">{t('complaints.submit_success')}</span>
          </div>
        )}

        {formError || error ? (
          <div className="mb-6">
            <ErrorMessage message={formError || error} />
            <p className="text-[10px] text-red-400 mt-1 font-mono uppercase tracking-widest pl-2 flex items-center gap-1">
              <AlertCircle size={10} /> Check Developer Console (F12) for detailed logs
            </p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="complaint-form neumorphic-card">
          <div className="space-y-8">
            {/* Basic Info Section */}
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <Type size={14} /> {t('complaints.basic_info')}
              </h2>
              <div className="form-row">
                <div className="form-group flex-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block pl-1">
                    {t('complaints.title_label')} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700 dark:text-white"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder={t('complaints.title_placeholder')}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block pl-1">
                    {t('complaints.category_label')} *
                  </label>
                  <div className="relative">
                    <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    <select
                      name="category"
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700 dark:text-white appearance-none"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">{t('complaints.placeholder_category')}</option>
                      <option value="Road">{t('complaints.categories.Roads')}</option>
                      <option value="Water">{t('complaints.categories.Water')}</option>
                      <option value="Electricity">{t('complaints.categories.Electricity')}</option>
                      <option value="Sanitation">{t('complaints.categories.Garbage')}</option>
                      <option value="Health">{t('complaints.categories.Drainage')}</option>
                      <option value="Other">{t('complaints.categories.Noise')}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group mt-6">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block pl-1">
                  {t('complaints.description_label')} *
                </label>
                <div className="relative">
                  <AlignLeft className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={16} />
                  <textarea
                    name="description"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700 dark:text-white"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t('complaints.placeholder_description')}
                    required
                    rows={5}
                  />
                </div>
              </div>
            </section>

            {/* Location Section */}
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <MapPin size={14} /> {t('complaints.location_details')}
              </h2>
              <div className="form-group mb-6">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block pl-1">
                  {t('complaints.address_placeholder')} *
                </label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700 dark:text-white"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t('complaints.address_placeholder')}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block pl-1">Latitude *</label>
                  <input
                    type="number"
                    name="latitude"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono font-bold"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g. 28.6139"
                    step="any"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 block pl-1">Longitude *</label>
                  <input
                    type="number"
                    name="longitude"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono font-bold"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g. 77.2090"
                    step="any"
                    required
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 italic">{t('complaints.location_hint')}</p>
            </section>

            {/* Evidence Section */}
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                <ImageIcon size={14} /> {t('complaints.evidence_upload')}
              </h2>
              
              <div 
                className="file-upload-section"
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                <div className="flex flex-col items-center">
                  <Upload className="upload-icon" size={32} />
                  <p className="upload-text-main">{t('complaints.click_to_upload')}</p>
                  <p className="text-xs text-slate-400 mt-1">{t('complaints.upload_hint')}</p>
                </div>
              </div>

              {previews.length > 0 && (
                <div className="image-previews">
                  {previews.map((url, index) => (
                    <div key={url} className="preview-container group">
                      <img src={url} alt="preview" className="preview-image" />
                      <button
                        type="button"
                        className="remove-img-btn"
                        onClick={() => removeImage(index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="form-actions mt-10">
            <button
              type="button"
              onClick={() => navigate('/complaints/my')}
              className="px-8 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
            >
              {t('complaints.cancel_btn')}
            </button>
            <button
              type="submit"
              disabled={loading || isSuccess}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> {t('complaints.submitting')}
                </>
              ) : (
                t('complaints.submit_btn')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateComplaint

