import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={styles.title}>Admin Dashboard</h2>

        <Link style={styles.link} to="/admin/dashboard">
          📊 Dashboard
        </Link>

        <Link style={styles.link} to="/admin/complaints">
          📄 View Complaints
        </Link>

        <Link style={styles.link} to="/admin/profile">
          👤 Profile
        </Link>
      </aside>

      {/* CONTENT */}
      <main style={styles.content}>
        <Outlet />
      </main>
    </>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    top: "70px",               // 👈 below navbar
    left: 0,
    width: "260px",
    height: "calc(100vh - 70px)",
    backgroundColor: "#1f2937",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  title: {
    marginBottom: 20,
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: 16,
  },
content: {
  position: "fixed",
  top: "70px",
  left: "260px",
  width: "calc(100% - 260px)",
  height: "calc(100vh - 70px)",
  padding: "25px",
  overflowY: "auto",
  backgroundColor: "#ffffff",
},

};
