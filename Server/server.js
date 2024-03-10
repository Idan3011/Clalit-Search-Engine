import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRoutes from './routes/tableRoutes.js';
import path from 'path';
dotenv.config();
const app = express();

app.use(cors());

app.use('*', (req, res, next) => {
	try {
		console.log('Request was made to: ' + req.originalUrl);
		console.log('Request type: ' + req.method);
		console.log('Request body: ' + JSON.stringify(req.body));
		console.log('Request query: ' + JSON.stringify(req.query));
	} catch (err) {
		console.log('Error: ' + err);
	}

	next();
});

app.use(express.static('dist'));

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

//Routes
app.use('/api/v1', searchRoutes);

const PORT = process.env.PORT || 3000;

app.listen(8080, '0.0.0.0', () => {
	console.log(`Server is listenning on port: `, 8080);
});
