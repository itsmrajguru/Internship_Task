const express = require('express');
const cors = require('cors');

const app = express();

// basic middleware
app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse incoming json data

// require routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// simple test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.use(errorHandler);

module.exports = app;
