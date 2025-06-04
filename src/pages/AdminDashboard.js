import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

export default function AdminDashboard() {
  const [monitoredUsers, setMonitoredUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
  const role = localStorage.getItem("role");

  if (role !== "Admin") {
    navigate("/login");  
    return;
  }

  const fetchMonitoredUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3001/monitored-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Access denied or server error.");
      }

      const data = await response.json();
      setMonitoredUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  fetchMonitoredUsers();
}, []);


  
  const handleLogout = () => {
    localStorage.clear();         // șterge token, role, userId etc.
    navigate("/");                // redirecționează la homepage
  };

  return (
    <div style={{ backgroundColor: "#ffe6ea", minHeight: "100vh", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Admin Dashboard</h1>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : monitoredUsers.length === 0 ? (
        <p>No monitored users.</p>
      ) : (
        <ul>
          {monitoredUsers.map((user) => (
            <li key={user.id}>
              <strong>UserID:</strong> {user.userId} <br />
              <strong>Reason:</strong> {user.reason}
            </li>
          ))}
        </ul>
      )}

      {}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "40px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "10px 20px",
          backgroundColor: "#ff4d4d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
