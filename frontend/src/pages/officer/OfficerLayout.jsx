import { Link, Outlet } from "react-router-dom";

export default function OfficerLayout() {
  return (
    <>
      {/* FIXED SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={styles.title}>Officer Dashboard</h2>

        <Link to="/officer/complaints" style={styles.link}>
          📋 Assigned Complaints
        </Link>

        <Link to="/officer/profile" style={styles.link}>
          👤 Profile
        </Link>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.content}>
        <Outlet />
      </main>
    </>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    top: "60px", // adjust if navbar height different
    left: 0,
    width: "260px",
    height: "calc(100vh - 60px)",
    backgroundColor: "#1f2937",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  title: {
    marginBottom: "20px",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },

  content: {
    marginLeft: "260px", // push content right
    padding: "40px",
    marginTop: "60px", // below navbar
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#ffffff",
  },
};
