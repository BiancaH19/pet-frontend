import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders PetList on default route", () => {
  render(<App />); 
  expect(screen.getByText(/Pet List/i)).toBeInTheDocument(); 
});
