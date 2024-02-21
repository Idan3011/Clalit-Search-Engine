import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "../../services/api";
import "./TablePage.css";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import { Alert } from "@mui/material";
import AutocompleteInput from "../../components/AutocompleteInput";
import { AuthContext } from "../../../context/AuthContext";

const SearchComponent = () => {
  const initialSearchParams = {
    searchParam1: "",
    searchParam2: "",
    searchParam3: "",
    searchParam4: "",
  };

  const inputRefs = useRef([]);

  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [clickedCell, setClickedCell] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const { authenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleSearch();
      } else if (event.altKey && event.key === "Alt") {
        const updatedSearchParams = {};
        inputRefs.current.forEach((inputRef, index) => {
          const inputValue = inputRef.value;
          updatedSearchParams[`searchParam${index + 1}`] = inputValue;
        });
        setSearchParams(updatedSearchParams);
        handleSearch();
      } else if (event.ctrlKey && event.shiftKey) {
        handleReset();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchParams]);

  const columns = [
    "תאור התמחות",
    "קוד התמחות",
    "סוג הנחיה",
    "שם רופא",
    "שם מרפאה",
    "הנחיות ללקוח",
  ];

  const handleInputChange = (value, index) => {
    inputRefs.current[index].value = value;

    if (value === "") {
      // If the input value is empty, remove the corresponding search parameter
      const updatedSearchParams = { ...searchParams };
      delete updatedSearchParams[`searchParam${index + 1}`];
      setSearchParams(updatedSearchParams);
    } else {
      setSearchParams({ ...searchParams, [`searchParam${index + 1}`]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/search", { params: searchParams });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchResults([]);

    inputRefs.current.forEach((ref) => {
      ref.clearValue();
    });
    setSearchResults([]);

    handleCloseSnackbar();
    setSearchParams(initialSearchParams);
  };
  const handleCopyToClipboard = (text) => {
    const parsedText = alterInstructions(text); // Parse the text before copying
    navigator.clipboard.writeText(parsedText);
    setCopiedText(parsedText);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleCopyAllDescriptions = () => {
    // Create a Set to store unique descriptions
    const uniqueDescriptions = new Set();

    // Iterate over search results and add descriptions to the Set
    searchResults.forEach((result) => {
      uniqueDescriptions.add(result["הנחיות ללקוח"]);
    });

    // Convert Set to an array and join descriptions with newline characters
    const descriptionsText = [...uniqueDescriptions].join("\n");

    // Copy the concatenated descriptions text to the clipboard
    navigator.clipboard
      .writeText(descriptionsText)
      .then(() => {
        console.log("Unique descriptions copied to clipboard successfully.");
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.error("Error copying unique descriptions to clipboard:", error);
      });
  };
  const alterInstructions = (instructions) => {
    // Reverse the occurrences of two-digit numbers
    instructions = instructions.replace(/\b(\d{2})\b/g, (match) =>
      match.split("").reverse().join("")
    );

    // Handle the specific case where "7477965-20" should be "02-5697747"
    instructions = instructions.replace(
      /(\d{7})-(\d{2})/,
      (match, group1, group2) => {
        const reversedGroup1 = group1.split("").reverse().join("");
        return `02-${reversedGroup1}`;
      }
    );

    // Handle the specific case where "0072*" should be "*2700"
    instructions = instructions.replace(/0072\*/, (match) => {
      const reversedPart = match.slice(0, -1).split("").reverse().join("");
      return `*${reversedPart}`;
    });

    // Handle the specific case where "2700*" should be "*2700"
    instructions = instructions.replace(/(\d+)\*/, (match, group1) => {
      return `*${group1}`;
    });

    return instructions;
  };

  const newPage = Math.max(page, 0);
  return (
    <>
    <div className="logo-container"></div>
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <div
          className="table-container-wrapper"
          style={{ maxHeight: "500px", overflowY: "auto" }}
          >
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((columnName, index) => (
                    <TableCell key={index} style={{ textAlign: "center" }}>
                      <AutocompleteInput
                        ref={(el) => (inputRefs.current[index] = el)}
                        id={`input-${columnName}`}
                        onChange={(value) => handleInputChange(value, index)}
                        placeholder={columnName}
                        columnName={columnName}
                        />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={loading}
                    >
                      חיפוש
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={handleReset}>
                      רענון
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </div>
      </form>
      {loading && (
        <div className="loader-container">
          <CircularProgress color="secondary" />
        </div>
      )}
      <div
        className="table-body-wrapper"
        style={{ maxHeight: "500px", overflowY: "auto" }}
        >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ textAlign: "center" }}>
                {columns.map((column, index) => (
                  <TableCell
                  key={index}
                    className="table-header"
                    style={{ textAlign: "center" }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((result, rowIndex) => (
                  <TableRow key={rowIndex} style={{ textAlign: "center" }}>
                    {columns.map(
                      (
                        column,
                        columnIndex // Iterate over columns array
                        ) => (
                          <TableCell
                          key={columnIndex}
                          className={`table-cell ${
                            column === "הנחיות ללקוח"
                            ? "copy-to-clipboard rtl-text"
                            : ""
                          }`}
                          onClick={() => {
                            if (column === "הנחיות ללקוח") {
                              handleCopyToClipboard(result[column]);
                              setClickedCell(columnIndex);
                              setTimeout(() => {
                                setClickedCell(null);
                              }, 2000);
                            }
                          }}
                          style={{
                            backgroundColor:
                              clickedCell === columnIndex ? "#f0f0f0" : "",
                            textAlign: "right",
                          }}
                        >
                          {column === "הנחיות ללקוח"
                            ? alterInstructions(result[column])
                            : result[column]}{" "}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={searchResults.length}
        rowsPerPage={rowsPerPage}
        page={newPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="שורות לעמוד:"
        labelDisplayedRows={({ from, to, count }) =>
        `${from}-${to} מתוך ${count}`
      }
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        >
        <Alert onClose={handleCloseSnackbar} severity="success">
          הועתק: {copiedText}
        </Alert>
      </Snackbar>
      {searchResults.length > 0 && ( // Only render the button if search results are available
        <Button onClick={handleCopyAllDescriptions}>ההעתק את כל ההנחיות</Button>
        )}
    </div>
    <Button onClick={logout}>התנתק</Button>
        </>
  );
};

export default SearchComponent;
