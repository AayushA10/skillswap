import { useState } from "react";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/users/login", new URLSearchParams(formData), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      const { access_token } = response.data;

      // ✅ Save token in localStorage
      localStorage.setItem("token", access_token);
      setMessage("✅ Login successful!");
    } catch (err) {
      setMessage("❌ Login failed: " + (err.response?.data?.detail || "Server error"));
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🔐 SkillSwap Login</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px", gap: "1rem" }}>
        <input name="username" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Log In</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Login;
