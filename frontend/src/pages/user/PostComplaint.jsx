import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./PostComplaint.css";
import axios from "axios";

/* ===============================
   Map click handler
================================ */
const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng); // { lat, lng }
    },
  });
  return null;
};

const PostComplaint = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [position, setPosition] = useState(null);

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  /* ===============================
     Validation
  ================================ */
  const validate = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Please enter title";
    if (!category) newErrors.category = "Select category";
    if (!description.trim())
      newErrors.description = "Enter description";
    if (!files || files.length === 0)
      newErrors.images = "Upload at least one photo";
    if (!position)
      newErrors.position = "Select location on map";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ===============================
     Submit
  ================================ */
  const handleSubmit = async () => {
    setSubmitted(true);
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("latitude", position.lat.toString());
      formData.append("longitude", position.lng.toString());

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      await axios.post(
        "http://localhost:5000/api/complaints/post",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ DO NOT SET Content-Type
          },
        }
      );

      alert("Complaint submitted successfully ✅");

      // Reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setFiles([]);
      setPosition(null);
      setErrors({});
      setSubmitted(false);
    } catch (err) {
      console.error("Post complaint error:", err.response?.data || err.message);
      alert("Failed to submit complaint");
    }
  };

  return (
    <div className="post-complaint">
      <h2>📝 Post Complaint</h2>

      <div className="complaint-grid">
        {/* ================= LEFT FORM ================= */}
        <div className="form-section">
          {/* TITLE */}
          <label className="label-row">
            <span>
              Complaint Title <span className="required">*</span>
              {submitted && errors.title && (
                <span className="inline-error"> {errors.title}</span>
              )}
            </span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors({ ...errors, title: "" });
            }}
            className={submitted && errors.title ? "error" : ""}
            placeholder="Enter title"
          />

          {/* CATEGORY */}
          <label className="label-row">
            <span>
              Category <span className="required">*</span>
              {submitted && errors.category && (
                <span className="inline-error"> {errors.category}</span>
              )}
            </span>
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setErrors({ ...errors, category: "" });
            }}
            className={submitted && errors.category ? "error" : ""}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Roads">Roads</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
          </select>

          {/* DESCRIPTION */}
          <label className="label-row">
            <span>
              Description <span className="required">*</span>
              {submitted && errors.description && (
                <span className="inline-error">
                  {" "}
                  {errors.description}
                </span>
              )}
            </span>
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors({ ...errors, description: "" });
            }}
            className={submitted && errors.description ? "error" : ""}
            placeholder="Describe the issue..."
          />

          {/* IMAGES */}
          <label className="label-row">
            <span>
              Upload Photos <span className="required">*</span>
              {submitted && errors.images && (
                <span className="inline-error">
                  {" "}
                  {errors.images}
                </span>
              )}
            </span>
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => {
              setFiles(e.target.files);
              setErrors({ ...errors, images: "" });
            }}
          />
        </div>

        {/* ================= RIGHT MAP ================= */}
        <div className="map-section">
          <label className="label-row">
            <span>
              📍 Select Location <span className="required">*</span>
              {submitted && errors.position && (
                <span className="inline-error">
                  {" "}
                  {errors.position}
                </span>
              )}
            </span>
          </label>

          <div className="map-box">
            <MapContainer
              center={[14.4673, 78.8242]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker setPosition={setPosition} />
              {position && <Marker position={position} />}
            </MapContainer>
          </div>

          {position && (
            <div className="latlng-box">
              <div>
                <label>Latitude</label>
                <input type="text" value={position.lat} readOnly />
              </div>
              <div>
                <label>Longitude</label>
                <input type="text" value={position.lng} readOnly />
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Submit Complaint
      </button>
    </div>
  );
};

export default PostComplaint;
