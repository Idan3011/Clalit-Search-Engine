import express from 'express';
import {getColumnOptions, searchColumnsAndFilterResult} from '../controllers/tableController.js';

const router = express.Router();

// Route to get column options for a specific column
router.get('/search/columnOptions/:columnName', getColumnOptions);


// GET table row's based on search parameters
router.get('/search', searchColumnsAndFilterResult);



export default router;
