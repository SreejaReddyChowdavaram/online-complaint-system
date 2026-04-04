import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import api, { BASE_URL } from "../../services/api";
import { 
  FileText, 
  Globe, 
  MessageSquare,
  Star,
  MapPin, 
  Camera, 
  CheckCircle,
  X,
  Plus
} from "lucide-react";
import "./ViewComplaints.css";
import ComplaintCard from "../../components/ComplaintCard";
import FeedbackForm from "../../components/FeedbackForm";
import WelcomeHeader from "../../components/WelcomeHeader";
import LocationSection from "../../components/LocationSection";
import { getDisplayCategory } from "../../utils/complaintUtils";

const ViewComplaints = () => {
  const { t } = useTranslation();

  if (!t) return null;

  const [myComplaints, setMyComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState("");
  const [complaintForFeedback, setComplaintForFeedback] = useState(null);
  const [openedFromAll, setOpenedFromAll] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user._id;

  /* ================= FETCH COMPLAINTS ================= */

  useEffect(() => {

    const fetchData = async () => {

      try {

        const myRes = await api.get("/complaints/user");

        const allRes = await api.get("/complaints");

        setMyComplaints(myRes.data);

        // ✅ Status Sorting Logic
        const statusPriority = { "Assigned": 1, "Pending": 2, "In Progress": 3, "Resolved": 4 };
        const sortedAll = (allRes.data || []).sort((a,b) => {
          const pA = statusPriority[a.status] || 99;
          const pB = statusPriority[b.status] || 99;
          if (pA !== pB) return pA - pB;
          return new Date(b.createdAt) - new Date(a.createdAt); // Secondary sort by date
        });

        setAllComplaints(sortedAll);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, [token]);



  /* ================= UPVOTE ================= */

  const handleUpvote = async (id) => {
    try {
      const res = await api.post(`/complaints/upvote/${id}`, {});

      const updateList = (prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, upvotes: res.data.upvotes, downvotes: res.data.downvotes, votes: res.data.votes }
            : c
        );

      setAllComplaints(updateList);
      setMyComplaints(updateList);
    } catch (err) {
      console.error("Upvote handle error:", err);
    }
  };



  /* ================= DOWNVOTE ================= */

  const handleDownvote = async (id) => {
    try {
      const res = await api.post(`/complaints/downvote/${id}`, {});

      const updateList = (prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, upvotes: res.data.upvotes, downvotes: res.data.downvotes, votes: res.data.votes }
            : c
        );

      setAllComplaints(updateList);
      setMyComplaints(updateList);
    } catch (err) {
      console.error("Downvote handle error:", err);
    }
  };


/* ================= FETCH COMMENTS ================= */
const fetchComments = async (complaintId) => {
  try {
    const res = await api.get(`/complaints/comments/${complaintId}`);
    setComments(res.data);
  } catch (err) {
    console.log(err);
  }
};

/* ================= ADD COMMENT ================= */
const addComment = async (complaintId) => {
  if (!newComment.trim()) return;
  try {
    const res = await api.post(
      `/complaints/comment/${complaintId}`,
      { text: newComment }
    );
    // Since we are fetching comments list in modal, we can just fetch again
    fetchComments(complaintId);
    setNewComment("");
  } catch (err) {
    console.error("Comment error:", err.response?.data || err);
  }
};



  /* ================= STATUS STYLE ================= */

  const getStatusClasses = (status) => {

    if (status === "Pending")
      return { badge: "status pending", card: "complaint-card card-pending", text: t("complaints.status_pending") };

    if (status === "In Progress")
      return { badge: "status in-progress", card: "complaint-card card-progress", text: t("complaints.status_progress") };

    if (status === "Resolved")
      return { badge: "status resolved", card: "complaint-card card-resolved", text: t("complaints.status_resolved") };

    return { badge: "status", card: "complaint-card", text: status };

  };



  if (loading) {

    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>{t("complaints.loading")}</p>
      </div>
    );

  }



  return (

    <div className="complaints-page">
      {/* ================= WELCOME GREETING ================= */}
      <WelcomeHeader userName={user?.name || "Citizen"} role={user?.role} />

      {/* ================= MY COMPLAINTS ================= */}

      <h2 className="section-title">
        <FileText size={22} className="icon-blue" />
        {t("complaints.my_complaints")}
      </h2>

      <div className="complaints-grid">

        {myComplaints.map((c) => (
          <ComplaintCard
            key={c._id}
            complaint={c}
            hideStats={true}
            onCardClick={(comp) => {
              setSelectedComplaint(comp);
              fetchComments(comp._id);
              setOpenedFromAll(false);
            }}
          />
        ))}

      </div>



      {/* ================= ALL COMPLAINTS ================= */}

      <h2 className="section-title">
        <Globe size={22} className="icon-blue" />
        {t("complaints.all_complaints")}
      </h2>

      <div className="complaints-grid">

        {allComplaints.map((c) => (
          <ComplaintCard
            key={c._id}
            complaint={c}
            currentUserId={userId}
            onCardClick={(comp) => {
              setSelectedComplaint(comp);
              fetchComments(comp._id);
              setOpenedFromAll(true);
            }}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
            onCommentClick={(comp) => {
              setSelectedComplaint(comp);
              fetchComments(comp._id);
            }}
            onRateClick={(comp) => {
              setComplaintForFeedback(comp);
              setShowFeedbackModal(true);
            }}
          />
        ))}

      </div>



      {/* ================= MODAL ================= */}

      {selectedComplaint && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedComplaint(null)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ──── Close Icon (Top-Right) ──── */}
            <button
              className="modal-close-icon"
              onClick={() => setSelectedComplaint(null)}
              title={t("complaints.modal_close_btn")}
            >
              <X size={20} />
            </button>

            <div className="modal-body scrollbar-thin">
              <h2>{selectedComplaint.title}</h2>
              <p><strong>{t("complaints.modal_category")}:</strong> {getDisplayCategory(selectedComplaint.category)}</p>

            <LocationSection 
              address={selectedComplaint.location?.address} 
              lat={selectedComplaint.location?.lat} 
              lng={selectedComplaint.location?.lng} 
            />

            <p><strong>{t("complaints.modal_description")}:</strong> {selectedComplaint.description}</p>

            <p><strong>{t("complaints.modal_status")}:</strong> {getStatusClasses(selectedComplaint.status).text}</p>



            {/* ===== CITIZEN IMAGES ===== */}

            {selectedComplaint.images?.length > 0 && (

              <div className="modal-images">

                <h4><Camera size={18} /> {t("complaints.modal_citizen_images")}</h4>

                <div className="image-grid">

                  {selectedComplaint.images.map((img, index) => {
                    const isCloudinary = String(img).startsWith("http");
                    const src = isCloudinary ? img : `${BASE_URL}/uploads/${img.replace(/\\/g, "/").replace(/^\/+/g, "").replace(/^uploads\//, "")}`;

                    return (
                      <img
                        key={index}
                        src={src}
                        alt="complaint"
                      />
                    );
                  })}

                </div>

              </div>

            )}



            {/* ===== OFFICER RESOLUTION IMAGE ===== */}

            {selectedComplaint.resolutionImage && (

              <div className="modal-images">

                <h4><CheckCircle size={18} /> {t("complaints.modal_officer_proof")}</h4>

                <img
                  src={selectedComplaint.resolutionImage.startsWith("http") ? selectedComplaint.resolutionImage : `${BASE_URL}/uploads/${selectedComplaint.resolutionImage}`}
                  alt="resolution"
                />

              </div>

            )}



            {/* ===== COMMENTS ===== */}

            <div className="comment-box">

              <h3><MessageSquare size={20} /> {t("complaints.modal_comments_title")}</h3>

              {comments.length === 0 ? (
                <p>{t("complaints.modal_no_comments")}</p>
              ) : (
                comments.map((com) => (
                  <div 
                    key={com._id} 
                    className="p-3.5 rounded-2xl mb-3 relative max-w-[90%] self-start bg-slate-100 dark:bg-slate-800 border border-light-border dark:border-dark-border transition-all duration-300"
                  >
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {com.userId?.name || "User"}
                    </div>
                    <div className="text-sm text-light-text dark:text-dark-text pb-4">
                      {com.message}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 absolute bottom-1.5 right-3 italic">
                      {new Date(com.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}

              <div className="comment-input">

                <input
                  type="text"
                  placeholder={t("complaints.modal_add_comment")}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />

                <button
                  onClick={() =>
                    addComment(selectedComplaint._id)
                  }
                >
                  {t("complaints.modal_post_btn")}
                </button>

              </div>

            </div>


            </div>

          </div>

        </div>

      )}

      {/* ================= FEEDBACK MODAL ================= */}
      {showFeedbackModal && (
        <FeedbackForm 
          complaint={complaintForFeedback} 
          onClose={() => setShowFeedbackModal(false)}
          onSuccess={(msg) => {
            setFeedbackSuccess(msg);
            setTimeout(() => setFeedbackSuccess(""), 5000);
          }}
        />
      )}

      {/* ================= SUCCESS TOAST ================= */}
      {feedbackSuccess && (
        <div className="feedback-success-toast">
          {feedbackSuccess}
        </div>
      )}

      {/* ================= FLOATING ACTION BUTTON (FAB) ================= */}
      <Link
        to="/dashboard/post-complaint"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 z-50 hover:scale-110 active:scale-95 group"
        title={t("sidebar.post_complaint")}
      >
        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
      </Link>

    </div>

  );

};

export default ViewComplaints;