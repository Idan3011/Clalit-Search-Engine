import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(() => {
    // Initialize authenticated state from localStorage if available
    return localStorage.getItem("authenticated") === "true";
  });

  useEffect(() => {
    // Update localStorage when authenticated state changes
    localStorage.setItem("authenticated", authenticated);
  }, [authenticated]);

  const login = () => {
    // Implement your login logic here
    setAuthenticated(true);
  };

  const logout = () => {
    // Implement your logout logic here
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
