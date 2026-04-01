import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { useTranslation } from "react-i18next";

import {
  Zap,
  Droplet,
  Map,
  Waves,
  Trash2,
  Volume2,
} from "lucide-react";

import "./Home.css";

const Home = () => {
  const { t } = useTranslation();

  if (!t) return null;
  const navigate = useNavigate();

  return (

    <div className="home-wrapper">

      {/* PARTICLES */}
      <div className="particles"></div>

      {/* ================= MAIN SECTION ================= */}

      <div className="home-main">

        {/* Floating Lights */}

        <div className="light light1"></div>
        <div className="light light2"></div>
        <div className="light light3"></div>
        <div className="light light4"></div>

        {/* HERO SECTION */}

        <section className="hero-section">

          <div className="hero-content">

            <h1 className="hero-title">
              {t("home.hero_title")} <br />
              <span className="typing">
                <Typewriter
                  words={t("home.typewriter", { returnObjects: true })}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={100}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
            </h1>

            <p>
              {t("home.hero_desc")}
            </p>

            <div className="hero-buttons">

              <button
                className="btn-secondary"
                onClick={() => navigate("/landing")}
              >
                {t("home.get_started")}
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/register")}
              >
                {t("home.create_account")}
              </button>

            </div>

          </div>

        </section>

        {/* ================= SERVICES ================= */}

        <section className="features-section">
          <h2>{t("home.services_title")}</h2>

          <div className="features-grid">
            <div className="feature-card">
              <Zap size={40} />
              <h3>{t("home.services.electricity.title")}</h3>
              <p>{t("home.services.electricity.desc")}</p>
            </div>

            <div className="feature-card">
              <Droplet size={40} />
              <h3>{t("home.services.water.title")}</h3>
              <p>{t("home.services.water.desc")}</p>
            </div>

            <div className="feature-card">
              <Map size={40} />
              <h3>{t("home.services.roads.title")}</h3>
              <p>{t("home.services.roads.desc")}</p>
            </div>

            <div className="feature-card">
              <Waves size={40} />
              <h3>{t("home.services.drainage.title")}</h3>
              <p>{t("home.services.drainage.desc")}</p>
            </div>

            <div className="feature-card">
              <Trash2 size={40} />
              <h3>{t("home.services.garbage.title")}</h3>
              <p>{t("home.services.garbage.desc")}</p>
            </div>

            <div className="feature-card">
              <Volume2 size={40} />
              <h3>{t("home.services.noise.title")}</h3>
              <p>{t("home.services.noise.desc")}</p>
            </div>
          </div>
        </section>

      </div>

      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-container">

          <div className="footer-column">
            <h3>{t("navbar.title")}</h3>
            <p>
              {t("home.footer_desc")}
            </p>
          </div>

          <div className="footer-column">
            <h4>{t("home.quick_links")}</h4>
            <ul>
              <li><Link to="/">{t("home.quick_links")}</Link></li>
              <li><Link to="/landing">{t("home.get_started")}</Link></li>
              <li><Link to="/login">{t("auth.login")}</Link></li>
              <li><Link to="/register">{t("auth.register")}</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>{t("home.contact")}</h4>
            <p>Email: <a href="mailto:online.civic.complaintsystem@gmail.com">online.civic.complaintsystem@gmail.com</a></p>
            <p>Helpline: <a href="tel:9441451806">9441451806</a></p>
            <p>Office Hours: 8:00 AM - 6:00 PM</p>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} {t("home.copyright")}
        </div>

      </footer>

    </div>
  );
}

export default Home;