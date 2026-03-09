import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "./PostComplaint.css";
import axios from "axios";

/* ===============================
   Click to Select Location
================================ */
const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

/* ===============================
   Search Control
================================ */
const SearchControl = ({ setPosition }) => {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
    })
      .on("markgeocode", function (e) {
        const latlng = e.geocode.center;
        map.setView(latlng, 16);
        setPosition(latlng);
      })
      .addTo(map);

    return () => {
      map.removeControl(geocoder);
    };
  }, [map, setPosition]);

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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Complaint submitted successfully ✅");

      // Reset
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
          <label>Complaint Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />

          <label>Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Roads">Roads</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
          </select>

          <label>Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe issue..."
          />

          <label>Upload Photos *</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>

        {/* ================= RIGHT MAP ================= */}
        <div className="map-section">
          <label>📍 Select Location *</label>

          <div className="map-box">
            <MapContainer
              center={[14.4673, 78.8242]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* 🔥 Search Bar */}
              <SearchControl setPosition={setPosition} />

              {/* Click Select */}
              <LocationMarker setPosition={setPosition} />

              {/* Marker */}
              {position && <Marker position={position} />}
            </MapContainer>
          </div>

          {position && (
            <div className="latlng-box">
              <div>
                <label>Latitude</label>
                <input value={position.lat} readOnly />
              </div>
              <div>
                <label>Longitude</label>
                <input value={position.lng} readOnly />
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