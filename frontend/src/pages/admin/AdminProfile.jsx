export default function AdminProfile() {
  return (
    <div>
      <h2>My Profile</h2>

      <div style={styles.box}>
        <p><strong>Name:</strong> Admin</p>
        <p><strong>Email:</strong> admin@gmail.com</p>
        <p><strong>Role:</strong> Administrator</p>
      </div>
    </div>
  );
}

const styles = {
  box: {
    background: "white",
    padding: 20,
    width: 300,
    borderRadius: 6
  }
};
