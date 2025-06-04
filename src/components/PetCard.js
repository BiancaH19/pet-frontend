import React from "react";

const PetCard = ({ pet, onEdit, onDelete, highlight }) => {
  return (
    <div
      style={{
        backgroundColor:
          highlight === "oldest"
            ? "#ffe0e0"
            : highlight === "youngest"
            ? "#e0fff1"
            : "#f5f5f5",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        margin: "16px auto",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "transform 0.2s",
      }}
    >
      <img
        src={pet.image}
        alt={pet.name}
        style={{
          width: "100%",
          maxWidth: "200px",
          height: "200px",
          objectFit: "cover",
          borderRadius: "10px",
          marginBottom: "12px",
        }}
      />

      <h2 style={{ margin: "8px 0" }}>{pet.name}</h2>
      <p>
        <strong>Species:</strong> {pet.species}
      </p>
      <p>
        <strong>Age:</strong> {pet.age}
      </p>
      <p>
        <strong>Status:</strong> {pet.status}
      </p>

      {(onEdit || onDelete) && (
        <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
          {onEdit && (
            <button
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "6px 12px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              onClick={onEdit}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "6px 12px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              onClick={onDelete}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PetCard;
