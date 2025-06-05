import React, { useState, useEffect } from "react";
import PetCard from "../components/PetCard";
import SearchBar from "../components/SearchBar";
import ConfirmDialog from "../components/ConfirmDialog";
import { useNavigate, Link } from "react-router-dom";
import { fetchPets, deletePet } from "../api";

const PetList = ({ pets, setPets }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
  const loadPets = async () => {
    try {
      const petsFromServer = await fetchPets({ page, sort: sortAsc ? 'age' : 'age_desc', name: searchQuery });
      setPets(petsFromServer);
    } catch (err) {
      console.error("Failed to fetch pets:", err);
    }
  };
  loadPets();
}, [page, sortAsc, searchQuery, setPets]);

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPets = [...filteredPets].sort((a, b) =>
    sortAsc ? a.age - b.age : b.age - a.age
  );

  const maxAge = Math.max(...sortedPets.map((pet) => pet.age));
  const minAge = Math.min(...sortedPets.map((pet) => pet.age));

  const handleAddPet = () => navigate("/edit");

  const handleEditPet = (pet) => {
    navigate("/edit", { state: { pet } });
  };

  const handleDeleteClick = (pet) => {
    setPetToDelete(pet);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
  try {
    await deletePet(petToDelete.id);
    const petsFromServer = await fetchPets({ page, sort: sortAsc ? 'age' : 'age_desc', name: searchQuery });
    setPets(petsFromServer);
  } catch (err) {
    console.error("Failed to delete pet:", err);
  } finally {
    setShowConfirm(false);
    setPetToDelete(null);
  }
  };


  const handleCancelDelete = () => {
    setShowConfirm(false);
    setPetToDelete(null);
  };

  const controlButtonStyle = {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  };

  return (
    <div>
      {/* Header bar with all actions */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 30px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        margin: "20px",
        flexWrap: "wrap"
      }}>
        {/* Title */}
        <h1 style={{ margin: 0, fontSize: "35px", display: "flex", alignItems: "center", color: "#333", gap: "10px" }}>
          <span role="img" aria-label="paw">🐾</span> 🐶 Adopt a Pet! :)
        </h1>

        {/* Controls */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <button style={controlButtonStyle} onClick={handleAddPet}>
            Add Pet
          </button>

          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <button style={controlButtonStyle} onClick={() => setSortAsc(!sortAsc)}>
            Sort by Age ({sortAsc ? "Descending" : "Ascending"})
          </button>

          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={controlButtonStyle}>
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* Pet grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
        padding: "20px",
        justifyItems: "center"
      }}>
        {sortedPets.map((pet) => {
          const canEdit = role === "Admin" || String(pet.userId) === userId;
          return (
            <PetCard
              key={pet.id}
              pet={pet}
              onEdit={canEdit ? () => handleEditPet(pet) : null}
              onDelete={canEdit ? () => handleDeleteClick(pet) : null}
              highlight={
                pet.age === maxAge
                  ? "oldest"
                  : pet.age === minAge
                  ? "youngest"
                  : "average"
              }
            />
          );
        })}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "10px" }}>
        <button style={controlButtonStyle} onClick={() => setPage((p) => Math.max(p - 1, 1))}>
          Previous
        </button>
        <span style={{ fontWeight: "bold", paddingTop: "6px" }}>Page {page}</span>
        <button style={controlButtonStyle} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <ConfirmDialog
          message={`Are you sure you want to delete ${petToDelete?.name}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default PetList;
