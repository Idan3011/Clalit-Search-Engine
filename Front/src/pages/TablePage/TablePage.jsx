import React, { useState, useEffect } from "react";
import axios from "../../services/api";
import { useTable, useFilters } from "react-table";
import { v4 as uuidv4 } from "uuid";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { isEqual } from "lodash";
import "./TablePage.css";

const TablePage = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageSize, setPageSize] = useState(100);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedSearchValue, setSelectedSearchValue] = useState("");
  const [copiedValue, setCopiedValue] = useState("");

  const fetchPageData = async (pageNumber, size, searchQuery) => {
    try {
      const response = await axios.get(
        `/search/all?page=${pageNumber}&pageSize=${size}&searchQuery=${searchQuery}`
      );

      const rowsWithIds = response.data.map((row) => ({
        id: uuidv4(),
        ...row,
      }));

      if (!isEqual(rowsWithIds, data)) {
        setData(rowsWithIds);

        const keys = Object.keys(response.data[0] || {});
        const dynamicColumns = keys.map((key) => ({
          Header: key,
          accessor: key,
          Cell: ({ value, row }) =>
            key === "תאור הנחיה" ? (
              <div style={{cursor: "pointer"}}>
                <Button onClick={() => handleCopyToClipboard(value)}>
                {value}
                </Button>
              </div>
            ) : (
              <Tooltip title={value} arrow>
                <span>{value}</span>
              </Tooltip>
            ),
          Filter: DefaultColumnFilter(key, rowsWithIds, handleSearchChange),
        }));
        setColumns(dynamicColumns);

        setRowCount(response.data.length);
      } else {
        console.log("Data is the same as the previous fetch.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchChange = (event, value) => {
    setSelectedSearchValue(value || "");
  };

  const handleResetSearch = () => {
    setSelectedSearchValue("");
    setPage(1);
  };

  const handleCopyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
  };

  useEffect(() => {
    fetchPageData(page, pageSize, selectedSearchValue);
  }, [page, pageSize, selectedSearchValue]);

  const DefaultColumnFilter = (columnKey, rows, handleSearchChange) => {
    const options = [...new Set(rows.map((row) => row[columnKey]))];

    return ({ column: { filterValue, setFilter } }) => (
      <div>
        {options ? (
          <Autocomplete
            value={filterValue || null}
            onChange={(event, value) => {
              setFilter(value || undefined);
              handleSearchChange(event, value);
            }}
            options={options}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label={`Filter by ${columnKey}`} />
            )}
          />
        ) : (
          <Select
            value={filterValue || ""}
            onChange={(event) => {
              setFilter(event.target.value || undefined);
              handleSearchChange(event, event.target.value);
            }}
            displayEmpty
            inputProps={{ "aria-label": `Select filter for ${columnKey}` }}
          >
            <MenuItem value="" disabled>
              {`Filter by ${columnKey}`}
            </MenuItem>
            {options.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        )}
      </div>
    );
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: { pageSize },
      },
      useFilters
    );

  return (
    <div className="TablePage">

    
    <div className="table-container">
      <div className="pagination-container">
        <Button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </Button>
        <Button onClick={handleNextPage}>Next</Button>
        <Button onClick={handleResetSearch}>Reset Search</Button>
      </div>
      <div className="table-wrapper">

     
      <table {...getTableProps()} className="custom-table">
        <thead key={uuidv4()}>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="custom-header"
              key={uuidv4()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="custom-cell"
                  key={column.id}
                >
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="custom-row" key={row.id}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="custom-cell"
                    key={uuidv4()}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
    </div>
  );
};

export default TablePage;
