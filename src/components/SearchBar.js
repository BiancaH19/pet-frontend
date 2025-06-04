import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search by name..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: "8px", margin: "10px 0", width: "200px" }}
    />
  );
};

export default SearchBar;
