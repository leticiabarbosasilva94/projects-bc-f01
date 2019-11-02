const express = require('express');
const app = express();

app.use(express.json());

const homeRoutes = require('./src/routes/home');
const projetRoutes = require('./src/routes/project');

app.use('/', homeRoutes);
app.use('/projects', projetRoutes);

app.listen(3001);
