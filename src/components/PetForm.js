import React, { useState, useEffect } from "react";

const PetForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    age: "",
    status: "",
    image: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    // Name: required, letters and spaces only, max 30
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name must contain only letters and spaces.";
    } else if (formData.name.length > 30) {
      newErrors.name = "Name cannot exceed 30 characters.";
    }

    
    // Species: required and must be Dog or Cat
    if (!formData.species.trim()) {
      newErrors.species = "Species is required.";
    } else if (!["Dog", "Cat"].includes(formData.species)) {
      newErrors.species = "Species must be 'Dog' or 'Cat'.";
    }
    
    // Age: required, positive number between 1 and 30
    if (formData.age === "") {
      newErrors.age = "Age is required.";
    } else if (isNaN(formData.age) || formData.age <= 0 || formData.age > 30) {
      newErrors.age = "Age must be a number between 1 and 30.";
    }


    // Status: required and must be Available or Adopted
    if (!formData.status.trim()) {
      newErrors.status = "Status is required.";
    } else if (!["Available", "Adopted"].includes(formData.status)) {
      newErrors.status = "Status must be 'Available' or 'Adopted'.";
    }

    // Image: required and must be valid URL
    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required.";
    }    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        age: Number(formData.age), 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pet-form">
      <label>
        Name:
        <input name="name" value={formData.name} onChange={handleChange} />
        {errors.name && <div className="error">{errors.name}</div>}
      </label>

      <label>
        Species:
        <input name="species" value={formData.species} onChange={handleChange} />
        {errors.species && <div className="error">{errors.species}</div>}
      </label>

      <label>
        Age:
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
        />
        {errors.age && <div className="error">{errors.age}</div>}
      </label>

      <label>
        Status:
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Available">Available</option>
          <option value="Adopted">Adopted</option>
        </select>
        {errors.status && <div className="error">{errors.status}</div>}
      </label>


      <label>
        Image URL:
        <input name="image" value={formData.image} onChange={handleChange} />
        {errors.image && <div className="error">{errors.image}</div>}
      </label>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );

};

export default PetForm;
