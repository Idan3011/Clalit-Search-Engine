import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TablePage from "./pages/TablePage/TablePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import { AuthProvider } from "../context/AuthContext";

function App() {
  return (
    <Router>
          <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
            <Route path="/table" element={<TablePage />} />
        </Routes>
      </div>
          </AuthProvider>
    </Router>
  );
}

export default App;
