import Login from "./Login";

const AdminLogin = () => {
  return <Login title="Admin Login" role="Admin" />;
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      formData
    );

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    navigate("/dashboard");
  } catch (err) {
    alert("Login failed");
    console.error(err);
  } finally {
    setLoading(false); // 🔑 THIS WAS MISSING
  }
};

export default AdminLogin;
