import pool from "../config/db.js";
import STATUS_CODES from "../constants/statusCode.js";

export const getAllData = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 50;
    const offset = (page - 1) * pageSize;

    let query = "SELECT * FROM `Clalit_Search`";
    const params = [];

    const columns = [
      "`תאור התמחות`",
      "`קוד התמחות`",
      "`שם רופא`",
      "`שם מרפאה`",
      "`הנחיות ללקוח`",
    ];
    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery;

      query +=
        " WHERE " + columns.map((column) => `${column} LIKE ?`).join(" OR ");

      columns.forEach((column) => {
        params.push(`%${searchQuery}%`);
      });
    }
    query += " LIMIT ?, ?";
    params.push(offset, Number(pageSize));

    const [rows, fields] = await pool.query(query, params);

    res.setHeader("Content-Type", "application/json");
    res.status(STATUS_CODES.OK).send(rows);
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
};
