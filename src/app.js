const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/db');


app.use(express.json());

const orderRoutes = require('./routes/orderRoutes');

app.use('/', orderRoutes);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Intern error: ' + err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});