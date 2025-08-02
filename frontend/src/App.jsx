import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [isSignup, setIsSignup] = useState(true);
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [skillData, setSkillData] = useState({ title: "", description: "", type: "teach" });
  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState("");

  const handleSignupChange = (e) => setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleLoginChange = (e) => setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSkillChange = (e) => setSkillData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/users/signup", signupData);
      setMessage("✅ Signup successful! User ID: " + res.data.id);
    } catch (err) {
      setMessage("❌ Signup failed: " + (err?.response?.data?.detail || err.message));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const form = new URLSearchParams();
      form.append("username", loginData.username);
      form.append("password", loginData.password);
      const res = await axios.post("http://localhost:8000/users/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      localStorage.setItem("token", res.data.access_token);
      setMessage("✅ Login successful!");
    } catch (err) {
      setMessage("❌ Login failed: " + (err?.response?.data?.detail || err.message));
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users/me", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      alert(`👋 Hello ${res.data.username} (${res.data.email})`);
    } catch (err) {
      alert("❌ Failed to fetch user info: " + (err?.response?.data?.detail || err.message));
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users/all", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      const list = res.data.map((u, i) => `${i + 1}. ${u.username} (${u.email})`).join("\n");
      alert("📋 All Users:\n" + list);
    } catch (err) {
      alert("❌ Failed to fetch users: " + (err?.response?.data?.detail || err.message));
    }
  };

  const postSkill = async () => {
    try {
      await axios.post("http://localhost:8000/skills/", skillData, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      setMessage("✅ Skill posted!");
      fetchSkills();
    } catch (err) {
      alert("❌ Failed to post skill: " + (err?.response?.data?.detail || err.message));
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await axios.get("http://localhost:8000/skills/all");
      setSkills(res.data);
    } catch (err) {
      setSkills([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMessage("👋 Logged out.");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("⚠️ Are you sure?");
    if (!confirmDelete) return;
    try {
      await axios.delete("http://localhost:8000/users/delete", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      localStorage.removeItem("token");
      setMessage("❌ Account deleted.");
    } catch (err) {
      alert("❌ Failed to delete: " + (err?.response?.data?.detail || err.message));
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const containerStyle = {
    maxWidth: "500px",
    margin: "auto",
    marginTop: "3rem",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
    backgroundColor: "#fff",
    textAlign: "center"
  };

  const inputStyle = {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none"
  };

  const buttonStyle = {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "8px",
    backgroundColor: "#1f77ff",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f2f2f2",
    color: "#333",
    border: "1px solid #ccc"
  };

  const icon = isSignup ? "🧑‍💻" : "🔐";

  return (
    <div style={containerStyle}>
      <h1>{icon} SkillSwap {isSignup ? "Signup" : "Login"}</h1>

      <form onSubmit={isSignup ? handleSignup : handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {isSignup ? (
          <>
            <input name="username" placeholder="Username" onChange={handleSignupChange} required style={inputStyle} />
            <input name="email" type="email" placeholder="Email" onChange={handleSignupChange} required style={inputStyle} />
            <input name="password" type="password" placeholder="Password" onChange={handleSignupChange} required style={inputStyle} />
            <button type="submit" style={buttonStyle}>Sign Up</button>
          </>
        ) : (
          <>
            <input name="username" placeholder="Email" onChange={handleLoginChange} required style={inputStyle} />
            <input name="password" type="password" placeholder="Password" onChange={handleLoginChange} required style={inputStyle} />
            <button type="submit" style={buttonStyle}>Log In</button>
          </>
        )}
      </form>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center", marginTop: "1rem" }}>
        <button onClick={() => setIsSignup(!isSignup)} style={secondaryButtonStyle}>
          {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
        </button>
        <button onClick={fetchUserInfo} style={secondaryButtonStyle}>🔐 Get My Info</button>
        <button onClick={fetchAllUsers} style={secondaryButtonStyle}>📋 View All Users</button>
        <button onClick={handleLogout} style={secondaryButtonStyle}>📕 Logout</button>
        <button onClick={handleDeleteAccount} style={{ ...secondaryButtonStyle, backgroundColor: "#ffdddd", border: "1px solid #e60000" }}>
          ❌ Delete My Account
        </button>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        <h3>🎓 Post a Skill</h3>
        <input name="title" placeholder="Skill Title" onChange={handleSkillChange} style={{ ...inputStyle, width: "100%", marginBottom: "0.5rem" }} />
        <input name="description" placeholder="Description" onChange={handleSkillChange} style={{ ...inputStyle, width: "100%", marginBottom: "0.5rem" }} />
        <select name="type" onChange={handleSkillChange} style={{ ...inputStyle, width: "100%", marginBottom: "0.5rem" }}>
          <option value="teach">Can Teach</option>
          <option value="learn">Want to Learn</option>
        </select>
        <button onClick={postSkill} style={buttonStyle}>Submit Skill</button>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "left" }}>
        <h3>📚 All Skills</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {skills.map((skill) => (
            <li key={skill.id} style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #eee",
              borderRadius: "8px",
              backgroundColor: "#fafafa"
            }}>
              <strong>{skill.title}</strong> <span style={{
                fontSize: "0.8rem",
                backgroundColor: skill.type === "teach" ? "#cce5ff" : "#ffe6cc",
                padding: "0.2rem 0.5rem",
                borderRadius: "6px",
                marginLeft: "0.5rem"
              }}>
                {skill.type === "teach" ? "Can Teach" : "Wants to Learn"}
              </span>
              <p style={{ margin: "0.5rem 0 0" }}>{skill.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
