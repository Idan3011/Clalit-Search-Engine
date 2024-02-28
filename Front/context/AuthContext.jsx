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
    setAuthenticated(true);
  };

  const logout = () => {
    setAuthenticated(false);
  };

  const logoutWithCleanup = async () => {
    try {
      await deleteIndexedDBData(); // Call function to delete IndexedDB data
      logout(); // Call regular logout function
    } catch (error) {
      console.error("Error during logout with cleanup:", error);
    }
  };

  const deleteIndexedDBData = async () => {
    try {
      // Open the IndexedDB database
      const db = await new Promise((resolve, reject) => {
        const dbRequest = indexedDB.open("autocompleteDB");
        dbRequest.onsuccess = () => resolve(dbRequest.result);
        dbRequest.onerror = () => reject("Error opening IndexedDB database");
      });

      // Start a transaction to access the "options" object store
      const transaction = db.transaction("options", "readwrite");
      const objectStore = transaction.objectStore("options");

      // Get total count of items in the object store
      const countRequest = objectStore.count();
      const totalCount = await new Promise((resolve, reject) => {
        countRequest.onsuccess = () => resolve(countRequest.result);
        countRequest.onerror = () =>
          reject("Error counting items in the object store");
      });

      const batchSize = 100; // Number of items to delete in each batch
      let offset = 0;

      // Delete data in batches
      while (offset < totalCount) {
        const keysToDelete = await new Promise((resolve, reject) => {
          const getRequest = objectStore.getAllKeys(null, batchSize, offset);
          getRequest.onsuccess = () => resolve(getRequest.result);
          getRequest.onerror = () => reject("Error fetching keys for deletion");
        });

        // Delete items using keys
        for (const key of keysToDelete) {
          objectStore.delete(key);
        }

        offset += batchSize;
      }

      console.log("Data deletion completed successfully.");

      // Once the data is deleted, close the database connection
      db.close();

      console.log("IndexedDB database connection closed.");
    } catch (error) {
      console.error("Error deleting IndexedDB data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, login, logout, logoutWithCleanup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
