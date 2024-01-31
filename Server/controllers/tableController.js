import pool from "../config/db.js";
import STATUS_CODES from "../constants/statusCode.js";

export const getAllData = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 50;
    const offset = (page - 1) * pageSize;

    const [rows, fields] = await pool.query(
      "SELECT * FROM `clalit_search` LIMIT ?, ?",
      [offset, Number(pageSize)]
    );

    res.status(STATUS_CODES.OK).send(rows);
  } catch (error) {
    console.error(error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal Server Error" });
  }
};
