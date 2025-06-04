import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PetList from "./pages/PetList";
import AddEditPet from "./pages/AddEditPet";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import { fetchPets } from "./api";

function App() {
  const [pets, setPets] = useState([]);

  const isAdmin = () => localStorage.getItem("role") === "Admin";

  useEffect(() => {
    const loadPets = async () => {
      try {
        const petsFromServer = await fetchPets();
        setPets(petsFromServer);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
      }
    };
    loadPets();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PetList pets={pets} setPets={setPets} />} />
        <Route path="/edit" element={<AddEditPet pets={pets} setPets={setPets} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={isAdmin() ? <AdminDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
