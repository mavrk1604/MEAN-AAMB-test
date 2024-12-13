require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');

app.use(requestLogger);
app.use(errorHandler);
app.use(cors());
app.use(express.json());

const connectDatabase = require('./db/config');
connectDatabase();

const apiRoutes = require('./routes/api.routes');
app.use('/', apiRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});