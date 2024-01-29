import express from 'express';
import { getAllData} from '../controllers/tableController.js';

const router = express.Router();

// Route to get all data
router.get('/all', getAllData);




export default router;
