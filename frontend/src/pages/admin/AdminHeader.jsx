import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import logo from "../../assets/logo.png";

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
          src={logo}
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
          <LogOut size={18} />
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    border: "1.5px solid #fee2e2",
    color: "#dc2626",
    background: "#fff",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.2s"
  }
};
