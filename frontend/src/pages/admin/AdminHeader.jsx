import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login/admin");
  };

  return (
    <div style={styles.header}>
      {/* LEFT */}
      <div style={styles.left}>
        <img
          src="/logo.png"
          alt="logo"
          style={{ height: 40 }}
        />
        <span style={styles.title}>JAN SUVIDHA</span>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <span style={styles.user}>
          admin1 <small>(Admin)</small>
        </span>
        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  header: {
    height: 70,
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px"
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6d28d9"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 15
  },
  user: {
    fontWeight: 500
  },
  logout: {
    border: "1px solid #2563eb",
    color: "#2563eb",
    background: "transparent",
    padding: "6px 14px",
    borderRadius: 6,
    cursor: "pointer"
  }
};
