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

  const fetchPageData = async (pageNumber, size) => {
    try {
      const response = await axios.get(
        `/search/all?page=${pageNumber}&pageSize=${size}`
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
          Cell: ({ value }) => (
            <Tooltip title={value} arrow>
              <span>{value}</span>
            </Tooltip>
          ),
          Filter: DefaultColumnFilter(key, rowsWithIds),
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

  useEffect(() => {
    fetchPageData(page, pageSize);
  }, [page, pageSize]);

  const DefaultColumnFilter = (columnKey, rows) => {
    const options = [...new Set(rows.map((row) => row[columnKey]))];

    return ({ column: { filterValue, setFilter } }) => (
      <div>
        {options.length > 5 ? (
          <Autocomplete
            value={filterValue || null}
            onChange={(event, value) => setFilter(value || undefined)}
            options={options}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label={`Filter by ${columnKey}`} />
            )}
          />
        ) : (
          <Select
            value={filterValue || ""}
            onChange={(event) => setFilter(event.target.value || undefined)}
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { filters },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize },
    },
    useFilters
  );

  return (
    <div className="table-container">
      <div className="pagination-container">
        <Button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </Button>
        <Button onClick={handleNextPage}>Next</Button>
      </div>
      <table {...getTableProps()} className="custom-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="custom-header">
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="custom-cell">
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
              <tr {...row.getRowProps()} className="custom-row">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="custom-cell">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablePage;
