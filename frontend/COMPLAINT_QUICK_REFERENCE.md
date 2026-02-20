# Complaint System - Quick Reference

## Component Overview

### Pages
- **CreateComplaint** (`/complaints/create`) - Submit new complaint (Citizen only)
- **ComplaintList** (`/complaints`) - View all complaints with filters
- **ComplaintDetail** (`/complaints/:id`) - View full complaint details
- **ComplaintTracking** (`/tracking/:complaintId`) - Public tracking (no auth)

### Context Hooks
```javascript
import { useComplaint } from '../context/ComplaintContext'
import { useAuth } from '../context/AuthContext'

const { complaints, currentComplaint, loading, error, fetchComplaints, createComplaint, updateStatus, addComment } = useComplaint()
const { user, isAuthenticated } = useAuth()
```

### Role-Based Permissions

| Feature | Citizen | Officer | Admin |
|---------|---------|---------|-------|
| Create Complaint | ✅ | ❌ | ❌ |
| View Own Complaints | ✅ | - | - |
| View All Complaints | ❌ | ✅ | ✅ |
| Add Comments | ✅ | ✅ | ✅ |
| Update Status | ❌ | ✅ | ✅ |
| Delete Complaint | ❌ | ❌ | ✅ |

### API Functions (complaintService.js)
```javascript
getComplaints(filters)           // GET /api/complaints
getComplaint(id)                 // GET /api/complaints/:id
createComplaint(data)            // POST /api/complaints
updateStatus(id, status, notes)  // PUT /api/complaints/:id/status
addComment(id, text)             // POST /api/complaints/:id/comments
deleteComplaint(id)              // DELETE /api/complaints/:id
getComplaintByComplaintId(id)    // GET /api/complaints/complaint-id/:id
```

### Common Patterns

**Fetching Complaints:**
```javascript
useEffect(() => {
  fetchComplaints(filters)
}, [filters])
```

**Creating Complaint:**
```javascript
const result = await createComplaint(formData)
if (result.success) {
  navigate(`/complaints/${result.data._id}`)
}
```

**Updating Status:**
```javascript
const result = await updateStatus(id, 'In Progress', 'Notes here')
if (result.success) {
  // Status updated in context automatically
}
```

**Adding Comment:**
```javascript
const result = await addComment(id, commentText)
if (result.success) {
  setCommentText('') // Clear form
}
```

### Role Checks
```javascript
const isCitizen = user?.role === 'Citizen'
const isOfficer = user?.role === 'Officer'
const isAdmin = user?.role === 'Admin'
const canUpdateStatus = isOfficer || isAdmin
```

### Conditional Rendering
```jsx
{isCitizen && <Link to="/complaints/create">Create Complaint</Link>}
{canUpdateStatus && <button>Update Status</button>}
{user && <form>Add Comment</form>}
```
