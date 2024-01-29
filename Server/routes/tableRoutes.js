import express from 'express';
import { getAllData, filterData } from '../controllers/tableController.js';

const router = express.Router();

// Route to get all data
router.get('/all', getAllData);

// Route to filter data 
router.post('/filter', filterData);



export default router;
