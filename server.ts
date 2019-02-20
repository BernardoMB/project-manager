import * as express from 'express';
import * as path from 'path';
import { Middlewares } from './middlewares';
import { Api } from './api';

const cors = require('cors')

const IP: string = "192.168.1.79";
const PORT: number = 3000;

const app: express.Application = express();

app.use(cors());

Middlewares.initialize(app);

app.use((request, response, next) => {
    // Set headers to allow cross origin request
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    next();
});

// Initialize all api routes
Api.initialize(app);

// Run the app by serving the static files in the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, IP, () => {
    console.log(`Server is now running @ port: ${PORT}`)
});
