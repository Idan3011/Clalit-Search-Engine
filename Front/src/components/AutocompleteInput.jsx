import React, { useState, useEffect, forwardRef } from "react";
import axios from "../services/api";
import Select from "react-select";
import "../pages/TablePage/TablePage.css";
const AutocompleteInput = forwardRef(
  ({ columnName, placeholder, onChange }, ref) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
      // Load initial options when the component mounts
      loadInitialOptions();
    }, []);

    const loadInitialOptions = async () => {
      setLoading(true);
      try {
        const db = await openDatabase();
        const storedOptions = await getStoredOptions(db, columnName);
        if (storedOptions && storedOptions.length > 0) {
          setOptions(storedOptions.slice(0, 50));
        } else {
          const response = await axios.get(
            `/search/columnOptions/${encodeURIComponent(columnName)}`
          );
          const optionsFromApi = response.data;
          setOptions(optionsFromApi.slice(0, 50));
          await storeOptionsInDB(db, columnName, optionsFromApi);
        }
      } catch (error) {
        console.error("Error fetching initial options:", error);
      } finally {
        setLoading(false);
      }
    };

    const openDatabase = () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("autocompleteDB", 1);

        request.onerror = (event) => {
          reject("Error opening database");
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          resolve(db);
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore("options", { keyPath: "columnName" });
        };
      });
    };

    const getStoredOptions = (db, columnName) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction("options");
        const objectStore = transaction.objectStore("options");
        const request = objectStore.get(columnName);

        request.onerror = (event) => {
          reject("Error getting options from database");
        };

        request.onsuccess = (event) => {
          const result = request.result;
          if (result && Array.isArray(result.options)) {
            // Sort the options before resolving the promise
            const sortedOptions = result.options.slice().sort((a, b) => {
              // Assuming a and b are strings or numbers
              if (typeof a === "string" && typeof b === "string") {
                return a.localeCompare(b);
              } else {
                return a - b;
              }
            });
            resolve(sortedOptions);
          } else {
            resolve([]);
          }
        };
      });
    };

    const storeOptionsInDB = (db, columnName, options) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction("options", "readwrite");
        const objectStore = transaction.objectStore("options");
        const request = objectStore.put({ columnName, options });

        request.onerror = (event) => {
          reject("Error storing options in database");
        };

        request.onsuccess = (event) => {
          resolve();
        };
      });
    };

    const handleInputChange = (newValue) => {
      setSearchValue(newValue);
      // Trigger search based on the new input value
      searchIndexDB(newValue);
    };

    const handleChange = (selectedOption) => {
      if (selectedOption) {
        onChange(selectedOption.value);
      } else {
        onChange("");
      }
    };

    const searchIndexDB = async (value) => {
      try {
        const db = await openDatabase();
        const storedOptions = await getStoredOptions(db, columnName);
        if (Array.isArray(storedOptions)) {
          const filteredResults = storedOptions.filter(
            (option) =>
              option &&
              option.toString().toLowerCase().includes(value.toLowerCase())
          );
          setOptions(filteredResults.slice(0, 50));
        }
      } catch (error) {
        console.error("Error searching indexDB:", error);
      }
    };

    return (
      <Select
        ref={ref}
        options={options.map((option) => ({ value: option, label: option }))}
        isLoading={loading}
        onInputChange={handleInputChange}
        onChange={handleChange}
        isClearable
        placeholder={placeholder}
        menuPortalTarget={document.body}
        inputValue={searchValue}
        className="no-horizontal-scroll"
      />
    );
  }
);

export default AutocompleteInput;
