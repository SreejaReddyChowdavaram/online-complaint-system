import { MapPin } from "lucide-react";

const ComplaintMapView = () => {
  return (
    <div className="card">
      <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <MapPin size={22} className="icon-blue" />
        Complaint Location
      </h2>
      <p>Latitude: 14.73</p>
      <p>Longitude: 78.55</p>
      {/* Later integrate Google Maps / Leaflet */}
    </div>
  );
};

export default ComplaintMapView;
