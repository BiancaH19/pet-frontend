import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PetList from "./PetList";
import dummyPets from "../data/dummyPets";
import { BrowserRouter } from "react-router-dom";

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// Test wrapper to manage local state for delete test
const TestWrapper = () => {
  const [pets, setPets] = React.useState(dummyPets);
  return <PetList pets={pets} setPets={setPets} />;
};

describe("PetList Component", () => {
  test("renders Pet List title", () => {
    renderWithRouter(<PetList pets={dummyPets} setPets={() => {}} />);
    expect(screen.getByText("Pet List")).toBeInTheDocument();
  });

  test("renders all pets from dummyPets", () => {
    renderWithRouter(<PetList pets={dummyPets} setPets={() => {}} />);
    dummyPets.forEach((pet) => {
      expect(screen.getByText(pet.name)).toBeInTheDocument();
    });
  });

  test("filters pets by name when searching", () => {
    renderWithRouter(<PetList pets={dummyPets} setPets={() => {}} />);
    const input = screen.getByPlaceholderText("Search by name...");

    fireEvent.change(input, { target: { value: "Luna" } });

    expect(screen.getByText("Luna")).toBeInTheDocument();
    expect(screen.queryByText("Toby")).not.toBeInTheDocument();
    expect(screen.queryByText("Max")).not.toBeInTheDocument();
  });

  test("sorts pets by age ascending and then descending when clicking sort button", () => {
    renderWithRouter(<PetList pets={dummyPets} setPets={() => {}} />);
    const sortButton = screen.getByText(/Sort by Age/i);

    // Initially descending: check that "Milo" (youngest) is visible
    expect(screen.getByText("Milo")).toBeInTheDocument();

    fireEvent.click(sortButton);

    // After click: check that "Coco" (oldest) is now on top
    expect(screen.getByText("Coco")).toBeInTheDocument();
  });

  test("deletes a pet after confirming in the dialog", () => {
    renderWithRouter(<TestWrapper />);

    // Find the delete button corresponding to Luna
    const deleteButton = screen
      .getAllByText("Delete")
      .find((btn) =>
        screen.getByText("Luna").closest("div").contains(btn)
      );

    fireEvent.click(deleteButton);

    // Confirm the dialog
    expect(
      screen.getByText(/Are you sure you want to delete Luna/i)
    ).toBeInTheDocument();
    fireEvent.click(document.querySelector("button.confirm"));

    // Make sure Luna is no longer in the document
    expect(screen.queryByText("Luna")).not.toBeInTheDocument();
  });
});
