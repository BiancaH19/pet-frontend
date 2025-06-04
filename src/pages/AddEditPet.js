import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PetForm from "../components/PetForm";
import { addPet, updatePet, fetchPets } from "../api";

const AddEditPet = ({ pets, setPets }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const petToEdit = location.state?.pet;

  const handleSubmit = async (formData) => {
  try {
    if (petToEdit) {
      await updatePet(petToEdit.id, formData);
    } else {
      await addPet(formData);
    }
    const updated = await fetchPets({ page: 1 }); 
    setPets(updated);
    navigate("/");
  } catch (err) {
    console.error("Failed to save pet:", err);
  }
};

  return (
    <div>
      <h1>{petToEdit ? "Edit Pet" : "Add a New Pet"}</h1>
      <PetForm
        initialData={petToEdit}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </div>
  );
};

export default AddEditPet;
