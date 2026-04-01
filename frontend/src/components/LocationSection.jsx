import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Navigation, Info } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationSection = ({ address, lat, lng }) => {
  const hasCoordinates = lat && lng && !isNaN(lat) && !isNaN(lng);

  return (
    <div className="location-section mt-6">
      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
        <MapPin size={14} /> Location Details
      </h4>

      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
        {/* Address Info */}
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
            {address || "Location address not provided"}
          </p>
          {hasCoordinates && (
            <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
              <Navigation size={10} />
              <span>Lat: {parseFloat(lat).toFixed(6)}</span>
              <span className="opacity-30">|</span>
              <span>Lng: {parseFloat(lng).toFixed(6)}</span>
            </div>
          )}
        </div>

        {/* Map Preview */}
        {hasCoordinates ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <MapContainer 
              center={[lat, lng]} 
              zoom={13} 
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>
                  Complaint Location: <br /> {address}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <Info size={24} className="text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-400">Map preview unavailable (Missing Coordinates)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSection;
