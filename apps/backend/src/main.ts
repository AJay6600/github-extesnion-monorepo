import express from 'express';
import cors from 'cors';
import authHandler from './authHandler';
import userHandler from './user-handler';

const app = express();

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

/** Route for authentication using github Oauth */
app.use('/auth', authHandler);

/** Route for user */
app.use('/user', userHandler);

/** Port for backend */
const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on('error', console.error);
