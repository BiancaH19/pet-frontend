import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddEditPet from "./AddEditPet";

// Mock useNavigate and useLocation from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: jest.fn(), 
  };
});

import { useLocation } from "react-router-dom";

describe("AddEditPet Component", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it("calls setPets correctly when adding a new pet", () => {
    const mockSetPets = jest.fn();
    useLocation.mockReturnValue({ state: {} }); // no pet = add mode

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <AddEditPet pets={[]} setPets={mockSetPets} />
      </MemoryRouter>
    );

    // Fill out the form with valid data
    fireEvent.change(getByLabelText("Name:"), { target: { value: "Max" } });
    fireEvent.change(getByLabelText("Species:"), { target: { value: "Dog" } });
    fireEvent.change(getByLabelText("Age:"), { target: { value: 4 } });
    fireEvent.change(getByLabelText("Status:"), { target: { value: "Available" } });
    fireEvent.change(getByLabelText("Image URL:"), {
      target: { value: "https://example.com/max.jpg" },
    });

    fireEvent.click(getByText(/save/i));

    // Expect setPets to be called with correct data
    expect(mockSetPets).toHaveBeenCalledTimes(1);
    expect(mockSetPets.mock.calls[0][0][0]).toMatchObject({
      name: "Max",
      species: "Dog",
      age: 4,
      status: "Available",
      image: "https://example.com/max.jpg",
    });
  });

  it("calls setPets correctly when editing a pet", () => {
    const samplePet = {
      id: 1,
      name: "Luna",
      species: "Cat",
      age: 3,
      status: "Available",
      image: "https://example.com/luna.jpg",
    };

    const mockSetPets = jest.fn();
    useLocation.mockReturnValue({ state: { pet: samplePet } });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <AddEditPet pets={[samplePet]} setPets={mockSetPets} />
      </MemoryRouter>
    );

    // Edit name
    fireEvent.change(getByLabelText("Name:"), { target: { value: "Milo" } });
    fireEvent.change(getByLabelText("Image URL:"), {
      target: { value: "https://example.com/luna.jpg" },
    });

    fireEvent.click(getByText(/save/i));

    expect(mockSetPets).toHaveBeenCalledWith([
      {
        id: 1,
        name: "Milo",
        species: "Cat",
        age: 3,
        status: "Available",
        image: "https://example.com/luna.jpg",
      },
    ]);
  });

  it("navigates to home when cancel is clicked", () => {
    const samplePet = {
      id: 1,
      name: "Luna",
      species: "Cat",
      age: 3,
      status: "Available",
      image: "https://example.com/luna.jpg",
    };

    useLocation.mockReturnValue({ state: { pet: samplePet } });

    const { getByText } = render(
      <MemoryRouter>
        <AddEditPet pets={[samplePet]} setPets={jest.fn()} />
      </MemoryRouter>
    );

    fireEvent.click(getByText(/cancel/i));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows error when required name field is empty", () => {
    useLocation.mockReturnValue({ state: {} });

    const mockSetPets = jest.fn();

    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <AddEditPet pets={[]} setPets={mockSetPets} />
      </MemoryRouter>
    );

    // Leave name empty
    fireEvent.change(getByLabelText("Species:"), { target: { value: "Dog" } });
    fireEvent.change(getByLabelText("Age:"), { target: { value: 4 } });
    fireEvent.change(getByLabelText("Status:"), { target: { value: "Available" } });
    fireEvent.change(getByLabelText("Image URL:"), {
      target: { value: "https://example.com/max.jpg" },
    });

    fireEvent.click(getByText(/save/i));

    expect(getByText("Name is required.")).toBeInTheDocument();
    expect(mockSetPets).not.toHaveBeenCalled();
  });

  it("shows error when species is not Dog or Cat", () => {
    useLocation.mockReturnValue({ state: {} });

    const mockSetPets = jest.fn();

    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <AddEditPet pets={[]} setPets={mockSetPets} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText("Name:"), { target: { value: "Rex" } });
    fireEvent.change(getByLabelText("Species:"), { target: { value: "Tiger" } }); // Invalid
    fireEvent.change(getByLabelText("Age:"), { target: { value: 5 } });
    fireEvent.change(getByLabelText("Status:"), { target: { value: "Available" } });
    fireEvent.change(getByLabelText("Image URL:"), {
      target: { value: "https://example.com/rex.jpg" },
    });

    fireEvent.click(getByText(/save/i));

    expect(getByText("Species must be 'Dog' or 'Cat'.")).toBeInTheDocument();
    expect(mockSetPets).not.toHaveBeenCalled();
  });

  it("shows error when age is invalid", () => {
    useLocation.mockReturnValue({ state: {} });

    const mockSetPets = jest.fn();

    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <AddEditPet pets={[]} setPets={mockSetPets} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText("Name:"), { target: { value: "Luna" } });
    fireEvent.change(getByLabelText("Species:"), { target: { value: "Cat" } });
    fireEvent.change(getByLabelText("Age:"), { target: { value: -3 } }); // Invalid
    fireEvent.change(getByLabelText("Status:"), { target: { value: "Available" } });
    fireEvent.change(getByLabelText("Image URL:"), {
      target: { value: "https://example.com/luna.jpg" },
    });

    fireEvent.click(getByText(/save/i));

    expect(getByText("Age must be a number between 1 and 30.")).toBeInTheDocument();
    expect(mockSetPets).not.toHaveBeenCalled();
  });

  it("shows error when image URL is empty", () => {
    useLocation.mockReturnValue({ state: {} });

    const mockSetPets = jest.fn();

    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <AddEditPet pets={[]} setPets={mockSetPets} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText("Name:"), { target: { value: "Rex" } });
    fireEvent.change(getByLabelText("Species:"), { target: { value: "Dog" } });
    fireEvent.change(getByLabelText("Age:"), { target: { value: 6 } });
    fireEvent.change(getByLabelText("Status:"), { target: { value: "Adopted" } });
    fireEvent.change(getByLabelText("Image URL:"), { target: { value: "" } }); // Empty

    fireEvent.click(getByText(/save/i));

    expect(getByText("Image URL is required.")).toBeInTheDocument();
    expect(mockSetPets).not.toHaveBeenCalled();
  });
});
