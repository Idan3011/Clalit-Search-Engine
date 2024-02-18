import pool from "../config/db.js";
import STATUS_CODES from "../constants/statusCode.js";

export const getAllData = async (req, res) => {
  try {
    const { page = 1, pageSize = 50, searchQuery } = req.query;
    const offset = (page - 1) * pageSize;

    let query = "SELECT * FROM `Clalit_Search`";
    const params = [];

    const columns = [
      "`תאור התמחות`",
      "`קוד התמחות`",
      "`סוג הנחיה`",
      "`שם רופא`",
      "`שם מרפאה`",
      "`הנחיות ללקוח`",
    ];

    if (searchQuery) {
      const searchCriteria = Array.isArray(searchQuery)
        ? searchQuery
        : [searchQuery]; // Convert searchQuery to array if it's not already
      query +=
        " WHERE " +
        searchCriteria
          .map((criteria) =>
            columns.map((column) => `${column} LIKE ?`).join(" OR ")
          )
          .join(" AND ");
      searchCriteria.forEach((criteria) => {
        columns.forEach(() => {
          params.push(`%${criteria}%`);
        });
      });
    }

    query += " LIMIT ?, ?";
    params.push(offset, Number(pageSize));

    const [rows, fields] = await pool.query(query, params);
    res.status(STATUS_CODES.OK).send(rows);
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
};

export const getColumnOptions = async (req, res) => {
  try {
    const columnName = req.params.columnName;
    const searchQuery = req.query.searchQuery;
    const decodedColumnName = decodeURIComponent(columnName);

    // Skip fetching options for the column "הנחיות ללקוח"
    if (decodedColumnName === "הנחיות ללקוח") {
      res.status(200).send([]);
      return;
    }

    let query = `SELECT DISTINCT \`${decodedColumnName}\` AS value FROM Clalit_Search`;

    if (searchQuery) {
      query += ` WHERE \`${decodedColumnName}\` LIKE '%${searchQuery}%'`;
    }

    const [rows, fields] = await pool.query(query);
    const options = rows.map((row) => row.value);
    res.status(200).send(options);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const searchColumnsAndFilterResult = async (req, res) => {
  try {
    const searchParams = [];
    const conditions = [];

    // Define the columns to search in
    const columns = [
      "`תאור התמחות`",
      "`קוד התמחות`",
      "`סוג הנחיה`",
      "`שם רופא`",
      "`שם מרפאה`",
    ];

    // Build the WHERE conditions dynamically based on the search parameters
    for (let i = 0; i < columns.length; i++) {
      if (req.query[`searchParam${i + 1}`]) {
        searchParams.push(req.query[`searchParam${i + 1}`]);
        conditions.push(`${columns[i]} = ?`);
      }
    }

    if (conditions.length === 0) {
      res
        .status(400)
        .send({ message: "At least one search parameter is required" });
      return;
    }

    const query = `
      SELECT *
      FROM Clalit_Search
      WHERE ${conditions.join(" AND ")}
    `;

    const [rows, fields] = await pool.query(query, searchParams);
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
