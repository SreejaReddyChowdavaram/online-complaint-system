import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Droplet,
  Map,
  Waves,
  Trash2,
  Volume2,
} from "lucide-react";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Online Civic Complaint <span>Registering System</span>
          </h1>

          <p>
            Empowering citizens to report public issues efficiently and
            ensuring transparent governance through digital tracking.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-secondary"
              onClick={() => navigate("/landing")}
            >
              Get Started
            </button>

            <button
              className="btn-secondary"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="features-section">
        <h2>Public Services Covered</h2>

        <div className="features-grid">

          <div className="feature-card">
            <Zap size={40} />
            <h3>Electricity Issues</h3>
            <p>Power outages, transformer faults, street light problems.</p>
          </div>

          <div className="feature-card">
            <Droplet size={40} />
            <h3>Water Supply</h3>
            <p>Water leakage, supply interruption, low pressure.</p>
          </div>

          <div className="feature-card">
            <Map size={40} />
            <h3>Road Maintenance</h3>
            <p>Potholes, damaged roads, unsafe pathways.</p>
          </div>

          <div className="feature-card">
            <Waves size={40} />
            <h3>Drainage</h3>
            <p>Blocked drains, overflow, sewage complaints.</p>
          </div>

          <div className="feature-card">
            <Trash2 size={40} />
            <h3>Garbage Management</h3>
            <p>Uncollected waste, sanitation issues.</p>
          </div>

          <div className="feature-card">
            <Volume2 size={40} />
            <h3>Noise Pollution</h3>
            <p>Excessive sound disturbances and public nuisance.</p>
          </div>

        </div>
      </section>

      {/* ================= FOOTER SECTION ================= */}
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-column">
            <h3>Online Complaint System</h3>
            <p>
              A digital platform enabling citizens to report civic issues
              and track complaint resolution transparently.
            </p>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li onClick={() => navigate("/")}>Home</li>
              <li onClick={() => navigate("/landing")}>Services</li>
              <li onClick={() => navigate("/login")}>Login</li>
              <li onClick={() => navigate("/register")}>Register</li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <p>Email: support@civicportal.gov</p>
            <p>Helpline: 1800-123-4567</p>
            <p>Office Hours: 9:00 AM - 6:00 PM</p>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Civic Complaint Registering System.
          All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}

export default Home;