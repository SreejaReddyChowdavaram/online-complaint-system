import { useState, useEffect, useRef } from "react";
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
import { 
  ClipboardList, 
  MapPin, 
  Search,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import "./PostComplaint.css";
import api from "../../services/api";
import { useTranslation } from "react-i18next";

/* ===============================
   Click to Select Location
================================ */
const LocationMarker = ({ position, setPosition, setAddress }) => {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      const newPos = [lat, lng];
      setPosition(newPos);

      // Reverse Geocoding with Nominatim
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
        } else {
          setAddress(`Manual selection at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        setAddress(`Manual selection at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    },
  });

  return position ? <Marker position={position} /> : null;
};

const ChangeMapView = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position && position[0] && position[1]) {
      map.setView(position, 16, { animate: true });
    }
  }, [position, map]);
  return null;
};

const PostComplaint = () => {
  const { t } = useTranslation();
  const searchContainerRef = useRef(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  // Location State
  const [position, setPosition] = useState([17.385, 78.486]); // Default center
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  /* ===============================
     Outside Click Handler
  ================================ */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===============================
     Debounced Search Function
  ================================ */
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      setNoResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setNoResults(false);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
        );
        const data = await response.json();
        setSearchResults(data);
        setNoResults(data.length === 0);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectResult = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);

    setPosition([lat, lng]);
    setAddress(place.display_name);
    setSearchQuery(place.display_name);
    setSearchResults([]);
    setShowDropdown(false);
  };

  /* ===============================
     Validation
  ================================ */
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Please enter title";
    if (!category) newErrors.category = "Select category";
    if (!description.trim()) newErrors.description = "Enter description";
    if (!files || files.length === 0) newErrors.images = "Upload at least one photo";
    if (!address) newErrors.position = "Please select a location";

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
      formData.append("address", address);
      formData.append("latitude", position[0].toString());
      formData.append("longitude", position[1].toString());

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await api.post("/complaints/post", formData);
      alert(res.data.message || "Complaint submitted successfully! We are assigning an officer right now. ✅");

      // Reset
      setTitle("");
      setCategory("");
      setDescription("");
      setFiles([]);
      setAddress("");
      setSearchQuery("");
      setPosition([17.385, 78.486]);
      setErrors({});
      setSubmitted(false);
    } catch (err) {
      console.error("Post error:", err);
      const serverMsg = err.response?.data?.message || err.message;
      alert(`Failed to submit complaint: ${serverMsg}`);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <form className="post-complaint" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <h2 className="page-header">
        <ClipboardList size={24} className="icon-blue" />
        {t("complaints.post_complaint_title")}
      </h2>

      <div className="complaint-grid">
        {/* ================= LEFT FORM ================= */}
        <div className="form-section">
          {/* ✅ RESTORED TITLE FIELD (CRITICAL) */}
          <div className="input-group">
            <label className="label-row">{t("complaints.title_label") || "Complaint Title"} <span className="req">*</span></label>
            <input
              type="text"
              className={errors.title ? "error" : ""}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("complaints.placeholder_title") || "e.g. Broken streetlight"}
            />
            {errors.title && <span className="inline-error">{errors.title}</span>}
          </div>

          <div className="input-group">
            <label className="label-row">{t("complaints.category_label")} <span className="req">*</span></label>
            <select 
              className={errors.category ? "error" : ""}
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">{t("complaints.placeholder_category")}</option>
              <option value="electricity">Electricity Issues</option>
              <option value="supply">Water Supply</option>
              <option value="road">Road Maintenance</option>
              <option value="drainage">Drainage Management</option>
              <option value="garbage">Garbage Management</option>
              <option value="pollution">Noise Pollution</option>
            </select>
            {errors.category && <span className="inline-error">{errors.category}</span>}
          </div>

          <div className="input-group">
            <label className="label-row">{t("complaints.description_label")} <span className="req">*</span></label>
            <textarea
              className={errors.description ? "error" : ""}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("complaints.placeholder_description")}
            />
            {errors.description && <span className="inline-error">{errors.description}</span>}
          </div>

          <label className="label-row">{t("complaints.upload_photos")} <span className="req">*</span></label>
          <input 
            type="file" 
            multiple 
            className={errors.images ? "error" : ""}
            onChange={(e) => setFiles(e.target.files)} 
          />
          {errors.images && <span className="inline-error">{errors.images}</span>}

          {address && (
            <div className="address-display">
              <label>
                <MapPin size={16} /> 
                {t("complaints.selected_location_label") || "SELECTED LOCATION"}
              </label>
              <p>{address}</p>
            </div>
          )}
        </div>

        {/* ================= RIGHT MAP ================= */}
        <div className="map-section">
          <label className="label-row">
            <MapPin size={18} /> {t("complaints.select_location")} <span className="req">*</span>
          </label>

          <div className="search-container" ref={searchContainerRef}>
            <input
              type="text"
              className="location-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0 || noResults) setShowDropdown(true);
              }}
              placeholder={t("complaints.placeholder_search_location") || "Search for a location..."}
            />
            {isSearching && (
              <div className="search-loader">
                <div className="mini-spinner"></div>
              </div>
            )}

            {showDropdown && (
              <ul className="search-results-dropdown">
                {noResults && (
                  <li className="no-results">
                    <Search size={18} /> {t("complaints.no_locations_found") || "No locations found"}
                  </li>
                )}
                {searchResults.map((result, idx) => {
                  const addr = result.address || {};
                  const mainName = addr.amenity || addr.road || addr.suburb || result.display_name.split(',')[0];
                  const subName = result.display_name.replace(mainName + ',', '').trim();

                  return (
                    <li
                      key={idx}
                      className="suggestion-item"
                       onClick={() => handleSelectResult(result)}
                    >
                      <div className="suggestion-icon"><MapPin size={14} /></div>
                      <div className="suggestion-info">
                        <div className="suggestion-name">{mainName}</div>
                        <div className="suggestion-sub">{subName}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="map-box">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ChangeMapView position={position} />
              <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
            </MapContainer>
          </div>

          <div className="latlng-box">
            <div>
              <label>Latitude</label>
              <input value={position ? position[0].toFixed(6) : ""} readOnly />
            </div>
            <div>
              <label>Longitude</label>
              <input value={position ? position[1].toFixed(6) : ""} readOnly />
            </div>
          </div>

          {/* Removed address-display from here */}
        </div>
      </div>

      <div className="submit-box">
        <button type="submit" className="submit-btn" disabled={submitted}>
          {submitted ? t("complaints.submitting") || "Submitting..." : t("complaints.submit_btn")}
        </button>
      </div>
    </form>
  );
};

export default PostComplaint;