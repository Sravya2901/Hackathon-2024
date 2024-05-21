// const express = require('express');
import express from 'express';
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser';
// const messageRoutes = require('./routes/messageRoutes');
import messageRoutes from './routes/messageRoutes.js'
const app = express();
// const cors = require('cors');
import cors from 'cors';
app.use(cors());
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use('/', messageRoutes);
app.listen(port, () => {

    console.log(`Server is running on port ${port}`);

});
