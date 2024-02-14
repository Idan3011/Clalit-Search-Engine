import React, { useState, useEffect, useRef } from "react";
import axios from "../services/api";
import "./TablePage/TablePage.css";
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
import AutocompleteInput from "../components/AutocompleteInput";

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
    navigator.clipboard.writeText(text);
    setCopiedText(text);
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
  const newPage = Math.max(page, 0);
  return (
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
                            column === "הנחיות ללקוח" ? "copy-to-clipboard" : ""
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
                          {result[column]}{" "}
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
    </div>
  );
};

export default SearchComponent;
