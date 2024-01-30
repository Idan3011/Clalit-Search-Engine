import pool from '../config/db.js';
import  STATUS_CODES  from '../constants/statusCode.js';

// Controller to get all data
export const getAllData = async (req, res) => {
  try {
    const [rows, fields] = await pool.query('SELECT * FROM `clalit search`');
    res.status(STATUS_CODES.OK).send(rows);
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({message: 'Internal Server Error'});
  }
};




