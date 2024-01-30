import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";
import axios from "../../services/api";
import "./TablePage.css";
const TablePage = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/search/all");

        const rowsWithIds = response.data.map((row) => ({
          id: uuidv4(),
          ...row,
        }));
        setRows(rowsWithIds);

        const keys = Object.keys(response.data[0] || {});
        const dynamicColumns = keys.map((key) => ({
          field: key,
          headerName: key,
          width: 200,
        }));
        setColumns(dynamicColumns);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div  className="table-container">
      <DataGrid
        rows={rows}
        columns={columns.map((column) => ({
          ...column,
          headerClassName: "custom-header",
          cellClassName: "custom-cell",
          rowClassName: "custom-row",
          headerAlign: "center",
          align: "center",
        }))}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
        
      />
    </div>
  );
};

export default TablePage;
