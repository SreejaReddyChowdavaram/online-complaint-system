/**
 * ComplaintForm.jsx - Complaint Form Page (Citizen)
 *
 * Requirement mapping:
 * - "Pages: Complaint Form"
 * - React functional component
 * - Uses Axios via ComplaintContext → complaintService → api (axios instance)
 * - Protected by RoleBasedRoute (Citizen) in App routing
 *
 * Implementation note:
 * We reuse the existing, fully-featured complaint creation UI.
 */
 
import CreateComplaint from './complaints/CreateComplaint'
 
export default function ComplaintForm() {
  return <CreateComplaint />
}

